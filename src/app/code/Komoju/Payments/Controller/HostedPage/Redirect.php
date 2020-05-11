<?php

namespace Komoju\Payments\Controller\HostedPage;

use Magento\Framework\App\ObjectManager;
use Magento\Sales\Model\Order;

use Komoju\Payments\Controller\HostedPage\Cancel;

class Redirect extends \Magento\Framework\App\Action\Action {

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

    private $order = false;


    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Controller\Result\RedirectFactory $resultRedirectFactory,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Komoju\Payments\Gateway\Config\Config $config,
        \Psr\Log\LoggerInterface $logger = null
    ) {
        $this->logger = $logger ?: ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
        $this->_resultRedirectFactory = $resultRedirectFactory;
        $this->_checkoutSession = $checkoutSession;
        $this->config = $config;

        return parent::__construct($context);
    }
    
    public function execute() {
        $hostedPageUrl = $this->createHostedPageUrl();

        $this->markOrderAsPendingPayment();

        $this->logger->info('redirecting user to hosted page at: ' . $hostedPageUrl);

        $resultRedirect = $this->_resultRedirectFactory->create();
        $resultRedirect->setUrl($hostedPageUrl);

        return $resultRedirect;
    }

    private function createHostedPageUrl() {
        $hostedPageParams = $this->getHostedPageParams();
        $paymentMethod = $this->getRequest()->getParam('payment_method');
        $merchantId = $this->config->getMerchantId();
        $secretKey = $this->config->getSecretKey();
        $komojuEndpoint = '/ja/api/'.$merchantId. '/transactions/';

        $qsParams = array();
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

    private function getOrder() {

        if (!$this->order) {
            $this->order = $this->_checkoutSession->getLastRealOrder();
        }
        return $this->order;
    }

    private function getHostedPageParams() {
        $order = $this->getOrder();
        $billingAddress = $order->getBillingAddress();
        $cancelUrl = $this->createCancelUrl($order->getEntityId());

        return array(
            "transaction[amount]" => $order->getGrandTotal(),
            "transaction[currency]" => $order->getOrderCurrencyCode(),
            "transaction[customer][email]" => $billingAddress->getEmail(),
            "transaction[customer][given_name]" => $billingAddress->getFirstname(),
            "transaction[customer][family_name]" => $billingAddress->getLastname(),
            "transaction[customer][phone]" => $billingAddress->getTelephone(),
            "transaction[tax]" => $order->getTaxAmount(),
            "timestamp" => time(),
            // "via" => "Magento",

            // TODO make sure these are real values
            "transaction[return_url]" => $this->_url->getUrl('checkout/onepage/success'),
            "transaction[cancel_url]" => $this->_url->getUrl($cancelUrl),
            "transaction[external_order_num]" => $order->getEntityId(),
        );
    }

    private function createCancelUrl($orderId) {
        $secretKey = $this->config->getSecretKey();

        $cancelEndpoint = 'komoju/hostedpage/cancel?order_id=' . $orderId;
        $hmac = hash_hmac('sha256', $cancelEndpoint, $secretKey);

        return $cancelEndpoint .= '&' . Cancel::HMAC_PARAM_KEY .'='.$hmac;
    }

    private function markOrderAsPendingPayment() {
        $order = $this->getOrder();

        $order->setState(ORDER::STATE_PENDING_PAYMENT);
        $order->setStatus(ORDER::STATE_PENDING_PAYMENT);
        $order->save();
    }
}