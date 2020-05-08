<?php

namespace Komoju\Payments\Controller\HostedPage;

use Magento\Framework\App\ObjectManager;
use Magento\Sales\Model\Order;
use Magento\Framework\Exception\AuthorizationException;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;

class Webhook extends \Magento\Framework\App\Action\Action implements HttpPostActionInterface, CsrfAwareActionInterface {
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

        $this->logger->info('HMAC Valid, processing event');

        // grab body
        // convert to assoc array
        // grab type
        // update order according to the type (mark as complete, authorized, failed, etc)
        
        $result = $this->_resultFactory->create(ResultFactory::TYPE_JSON);
        $result->setHttpResponseCode(200);
    }

    public function createCsrfValidationException(RequestInterface $request): ?InvalidRequestException {
        return null;
    }

    public function validateForCsrf(RequestInterface $request): ?bool {
        return true;
    }

    private function getOrder($orderId) {
        return $this->orderRepository->get($orderId);
    }

    private function isHmacValid() {
        // get hmac from headers
        $hmacHeader = $this->getRequest()->getHeader('x-komoju-signature');
        $webhookSecretToken = $this->config->getWebhookSecretToken();
        $reqBody = $this->getRequest()->getContent();
        
        $calculatedHmac = hash_hmac('sha256', $reqBody, $webhookSecretToken);
        
        return hash_equals($hmacHeader, $calculatedHmac);
    }
}