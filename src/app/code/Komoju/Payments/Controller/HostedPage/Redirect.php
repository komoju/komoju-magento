<?php

namespace Komoju\Payments\Controller\HostedPage;

require_once dirname(__FILE__) . '/../../komoju-php/lib/komoju.php';

use Magento\Framework\App\ObjectManager;
use Magento\Sales\Model\Order;

use Komoju\Payments\Controller\HostedPage\Cancel;

/**
 * The Redirect endpoint is responsible for creating the Hosted Page URL
 * and redirecting the customers to it to capture payment. This endpoint is
 * called from the checkout page js, after the order details have been captured and
 * saved by Magento.
 */
class Redirect extends \Magento\Framework\App\Action\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\RedirectFactory
     */
    protected $_resultRedirectFactory;

    /**
     * @var \Magento\Checkout\Model\Session
     */
    protected $_checkoutSession;

    /**
     * @var \Psr\Log\LoggerInterface
     */
    private $logger;

    /**
     * @var \Komoju\Payments\Gateway\Config\Config
     */
    private $config;

    /**
     * @var \Magento\Sales\Model\Order|false
     */
    private $order = false;

    /**
     * @var \Komoju\Payments\Model\ExternalPayment
     */
    private $externalPayment;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Controller\Result\RedirectFactory $resultRedirectFactory,
        \Komoju\Payments\Model\ExternalPaymentFactory $externalPaymentFactory,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Komoju\Payments\Gateway\Config\Config $config,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Psr\Log\LoggerInterface $logger = null
    ) {
        $this->logger = $logger ?: ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
        $this->externalPayment = $externalPaymentFactory->create();
        $this->_resultRedirectFactory = $resultRedirectFactory;
        $this->_checkoutSession = $checkoutSession;
        $this->config = $config;
        $this->storeManager = $storeManager;

        return parent::__construct($context);
    }

    public function execute()
    {
        $resultRedirect = $this->_resultRedirectFactory->create();

        try {
            $hostedPageUrl = $this->createHostedPageUrl();
            $this->markOrderAsPendingPayment();
            $this->logger->info('redirecting user to hosted page at: ' . $hostedPageUrl);
            $resultRedirect->setUrl($hostedPageUrl);
        } catch(\KomojuExceptionBadServer | \KomojuExceptionBadJson $exception) {
            // Restore the items to the cart and redirect to the checkout payment page again
            // if there's an error communicating with Komoju
            $logMessage = 'Error redirecting to Komoju session: ' . $exception->getMessage();
            $this->logger->info($logMessage);
            $this->processFailedOrder();
            $checkoutUrl = $this->_url->getUrl('checkout', ['_fragment' => 'payment']);
            $resultRedirect->setUrl($checkoutUrl);
        }

        return $resultRedirect;
    }

    /**
     * Calls the KomojuApi to create a session with the relevant payment details
     * and returns the Komoju session's URL
     * @return string the Komoju session URL
     */

    private function createHostedPageUrl()
    {
        $paymentMethod = $this->getRequest()->getParam('payment_method');
        $secretKey = $this->config->getSecretKey();
        $order = $this->getOrder();
        $billingAddress = $order->getBillingAddress();
        $externalOrderNum = $this->createExternalPayment($order);
        $currencyCode = $this->storeManager->getStore()->getBaseCurrencyCode();
        $client = new \KomojuApi($secretKey);
        $returnUrl = $this->createReturnUrl($order->getEntityId());

        $komojuSession = $client->createSession([
          'return_url' => $returnUrl,
          'default_locale' => $this->config->getKomojuLocale(),
          'payment_types' => [$paymentMethod],
          'payment_data' => [
              'amount' => $order->getGrandTotal(),
              'currency' => $currencyCode,
              'external_order_num' => $externalOrderNum,
          ],
        ]);

        return $komojuSession->session_url;
    }

    /**
     * If a failed order can be cancelled: this restores stock to the product,
     * adds the products back to cart, and cancels the original failed order
     */

    private function processFailedOrder()
    {
      $order = $this->getOrder();
      if($order->canCancel()) {
        $this->_checkoutSession->restoreQuote();
        $order->registerCancellation();
        $order->save();
      }
    }

    /**
     * gets the last order made from the checkoutSession. The checkoutSession
     * is constructed from the request so this is scoped to the request that
     * was sent to this endpoint, and not the last order made in the entire app.
     * I'm not sure what the difference between the last order and last "real"
     * order is, but this seems to be the commonly accepted way to access this
     * data.
     * @return \Magento\Sales\Model\Order
     */
    private function getOrder()
    {

        if (!$this->order) {
            $this->order = $this->_checkoutSession->getLastRealOrder();
        }
        return $this->order;
    }


    /**
     * Creates the return url for the PostSessionRedirect endpoint in this plugin. Because we
     * don't want to leave an order in limbo if the user does not complete the session,s
     * we have a specific endpoint that takes the order id and HMAC token and marks
     * the order as cancelled in the system
     * @return String
     */
    private function createReturnUrl($orderId)
    {
        $secretKey = $this->config->getSecretKey();
        $endpoint = 'komoju/hostedpage/postsessionredirect?order_id=' . $orderId;
        $hmac = hash_hmac('sha256', $endpoint, $secretKey);
        $returnUrl = $this->_url->getUrl($endpoint .= '&hmac='.$hmac);
        return $returnUrl;
    }

    /**
     * Marks the order as pending in the database. Because at this point
     * the customer has submitted the order and it's been saved in the system
     * but have not paid for it the order is being marked as awaiting payment so
     * the Magento admins have a better understanding of where the order is at
     * @return void
     */
    private function markOrderAsPendingPayment()
    {
        $order = $this->getOrder();

        $order->setState(ORDER::STATE_PENDING_PAYMENT);
        $order->setStatus(ORDER::STATE_PENDING_PAYMENT);
        $order->save();
    }

    /**
     * Because the webhook sends events for changes to transactions it's
     * possible (but not supported) to have multiple storefronts connected to the
     * same Komoju account. Because the webhook events use the external_order_num
     * to indicate which order the event relates to there could be naming collisions
     * for multiple systems (A good example of this would be multiple systems that
     * both an incrementing id field. In that case both systems would have a order
     * with ID 1, and there's no way to know which order the event relates to). To
     * deal with this possibility we're constructing an id unique to each instance
     * of the plugin and tying it to the order. When a webhook event is send this
     * unique id is then mapped back to the relevant order
     * @var \Magento\Sales\Model\Order $order
     * @return \Komoju\Payments\Model\ExternalPayment
     */
    private function createExternalPayment($order)
    {
        return $this->externalPayment->createExternalPayment($order)->getExternalPaymentId();
    }
}
