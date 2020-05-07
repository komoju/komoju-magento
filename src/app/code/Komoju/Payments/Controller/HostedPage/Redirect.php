<?php

namespace Komoju\Payments\Controller\HostedPage;

use Magento\Framework\App\ObjectManager;

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

        $this->logger->info('******** hostedPageUrl: ' . $hostedPageUrl);

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
            "transaction[return_url]" => "https://komoju.com",
            "transaction[cancel_url]" => "https://komoju.com",
            "transaction[external_order_num]" => $order->getEntityId(),
        );
    }
}