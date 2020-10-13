<?php

namespace Komoju\Payments\Controller\HostedPage;

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
        $hostedPageUrl = $this->createHostedPageUrl();

        $this->markOrderAsPendingPayment();

        $this->logger->info('redirecting user to hosted page at: ' . $hostedPageUrl);

        $resultRedirect = $this->_resultRedirectFactory->create();
        $resultRedirect->setUrl($hostedPageUrl);

        return $resultRedirect;
    }

    /**
     * Constructs the Hosted Page URL as per the docs:
     * https://docs.komoju.com/en/hosted_page/overview/#creating_a_payment.
     * @return string The Hosted Page Url
     */
    private function createHostedPageUrl()
    {
        $hostedPageParams = $this->getHostedPageParams();
        $paymentMethod = $this->getRequest()->getParam('payment_method');
        $merchantId = $this->config->getMerchantId();
        $secretKey = $this->config->getSecretKey();
        $komojuEndpoint = '/ja/api/'.$merchantId. '/transactions/';

        $qsParams = [];
        foreach ($hostedPageParams as $key => $val) {
            $qsParams[] = urlencode($key) . '=' . urlencode($val);
        }
        sort($qsParams);
        $queryString = implode('&', $qsParams);

        $url = $komojuEndpoint.$paymentMethod.'/new'. '?' .$queryString;
        $hmac = hash_hmac('sha256', $url, $secretKey);
        $queryString .= '&hmac='.$hmac;

        return 'https://komoju.com/'.$komojuEndpoint.$paymentMethod.'/new'. '?' . $queryString;
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
     * Creates the necessary parameters to pass to the hosted page API to get
     * capture payment from the customer
     * @return array
     */
    private function getHostedPageParams()
    {
        $order = $this->getOrder();
        $billingAddress = $order->getBillingAddress();
        $cancelUrl = $this->createCancelUrl($order->getEntityId());
        $externalOrderNum = $this->createExternalPayment($order);
        $currencyCode = $this->storeManager->getStore()->getBaseCurrencyCode();

        return [
            "transaction[amount]" => $order->getGrandTotal(),
            "transaction[currency]" => $currencyCode,
            "transaction[customer][email]" => $billingAddress->getEmail(),
            "transaction[customer][given_name]" => $billingAddress->getFirstname(),
            "transaction[customer][family_name]" => $billingAddress->getLastname(),
            "transaction[customer][phone]" => $billingAddress->getTelephone(),
            "transaction[tax]" => 0,
            "timestamp" => time(),
            "transaction[return_url]" => $this->_url->getUrl('checkout/onepage/success'),
            "transaction[cancel_url]" => $this->_url->getUrl($cancelUrl),
            "transaction[external_order_num]" => $externalOrderNum,
            "via" => "magento",
        ];
    }

    /**
     * Creates the cancel url for the cancel endpoint in this plugin. Because we
     * don't want to leave an order in limbo if the user clicks the cancel link
     * we have a specific endpoint that takes the order id and HMAC token and marks
     * the order as cancelled in the system
     * @return string
     */
    private function createCancelUrl($orderId)
    {
        $secretKey = $this->config->getSecretKey();

        $cancelEndpoint = 'komoju/hostedpage/cancel?order_id=' . $orderId;
        $hmac = hash_hmac('sha256', $cancelEndpoint, $secretKey);

        return $cancelEndpoint .= '&' . Cancel::HMAC_PARAM_KEY .'='.$hmac;
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
