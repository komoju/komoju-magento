<?php

namespace Komoju\Payments\Controller\HostedPage;

use Magento\Framework\App\ObjectManager;
use Magento\Sales\Model\Order;
use Magento\Framework\Exception\AuthorizationException;
use Magento\Framework\Controller\ResultFactory;

class Cancel extends \Magento\Framework\App\Action\Action {

    const HMAC_PARAM_KEY = 'hmac';

    /**
     * @var \Magento\Framework\Controller\ResultFactory
     */
    protected $_resultFactory;
    
    /**
     * @var \Magento\Sales\Api\OrderRepositoryInterface
     */
    private $orderRepository;

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
        \Magento\Framework\Controller\ResultFactory $resultFactory,
        \Magento\Sales\Api\OrderRepositoryInterface $orderRepository,
        \Komoju\Payments\Gateway\Config\Config $config,
        \Psr\Log\LoggerInterface $logger = null
    ) {
        $this->logger = $logger ?: ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
        $this->_resultFactory = $resultFactory;
        $this->orderRepository = $orderRepository;
        $this->config = $config;

        return parent::__construct($context);
    }
    
    public function execute() {
        if (!$this->isHmacValid()) {
            $this->logger->info('HMAC param does not match expected value, exiting.');    
            $result = $this->_resultFactory->create(ResultFactory::TYPE_RAW);
            $result->setHttpResponseCode(401);
            $result->setContents('hmac parameter is not valid');

            return $result;
        };
        
        $orderId = $this->getRequest()->getParam('order_id');
        $order = $this->getOrder($orderId);
        
        if ($this->orderCanBeCancelled($order)) {    
            $this->logger->info('Cancelling order for order id: ' . $orderId);
    
            $order->setState(Order::STATE_CANCELED);
            $order->setStatus(Order::STATE_CANCELED);
            $order->save();
    
            $this->logger->info('Order cancelled for order id: ' . $orderId);
        } else {
            $this->logger->info('Order is not in cancellable state. Redirecting without it. Order id: ' . $orderId);
        }


        $resultRedirect = $this->_resultFactory->create(ResultFactory::TYPE_REDIRECT);
        $resultRedirect->setUrl($this->_url->getUrl('/'));

        return $resultRedirect;
    }

    private function getOrder($orderId) {
        return $this->orderRepository->get($orderId);
    }

    private function isHmacValid() {
        $requestParams = $this->getRequest()->getParams();
        $hmacParam = rtrim($requestParams['hmac'], "/");
        unset($requestParams[self::HMAC_PARAM_KEY]);
        $secretKey = $this->config->getSecretKey();

        $queryString = http_build_query($requestParams);
        $urlForComp = 'komoju/hostedpage/cancel' . '?' . $queryString;
        $calculatedHmac = hash_hmac('sha256', $urlForComp, $secretKey);
        
        return hash_equals($hmacParam, $calculatedHmac);
    }

    private function orderCanBeCancelled($order) {
        return ($order->getState() == Order::STATE_CANCELED || $order->getState() == Order::STATE_NEW);
    }
}