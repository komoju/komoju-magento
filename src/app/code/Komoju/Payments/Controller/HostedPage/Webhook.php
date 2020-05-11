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

use Komoju\Payments\Model\WebhookEvent;

/**
 * API endpoint to receive Webhook notifications from Komoju. To make the
 * endpoint a POST endpoint a Magento Action needs to implement the
 * HttpPostActionInterface. And because all POST have automatic CSRF checking,
 * and as this is a API endpoint to receive JSON requests it doesn't have a
 * CSRF token, this class is also implementing the CsrfAwareActionInterface
 * interface and disabling checking by returning false from the inherited methods.
 */
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
        $requestBody = $this->getRequest()->getContent();
        // convert to assoc array
        $webhookEvent = new WebhookEvent($requestBody);
        // grab type
        
        $this->logger->info('event type: ' . $webhookEvent->eventType());

        $orderId = $webhookEvent->externalOrderNum();
        $order = $this->getOrder($orderId);
        // update order according to the type (mark as complete, authorized, failed, etc)

        if($webhookEvent->eventType() == 'payment.captured') {
            $order->setState(Order::STATE_PROCESSING);
            $order->setStatus(Order::STATE_PROCESSING);
            // $order->addStatusHistoryComment('Order complete!');
            $order->save();
        }
        
        $result = $this->_resultFactory->create(ResultFactory::TYPE_JSON);
        $result->setHttpResponseCode(200);
    }

    /**
     * Required to implement by the CsrfAwareActionInterface. Since all requests
     * are valid there's no need for any validation exception handling, so
     * returning null just uses Magento's defaults.
     */
    public function createCsrfValidationException(RequestInterface $request): ?InvalidRequestException {
        return null;
    }

    /**
     * By default all non-AJAX post requests do CSRF checking. Because this
     * endpoint is only receiving JSON requests there is no CSRF token, so 
     * returning true here to mark all requests as CSRF valid. If this is not
     * set then Magento will fail on all requests from Komoju
     */
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