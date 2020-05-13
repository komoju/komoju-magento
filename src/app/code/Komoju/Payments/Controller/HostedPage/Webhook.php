<?php

namespace Komoju\Payments\Controller\HostedPage;

use Magento\Framework\App\ObjectManager;
use Magento\Sales\Model\Order;
use Magento\Framework\Exception\AuthorizationException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;

use Komoju\Payments\Model\WebhookEvent;
use Komoju\Payments\Plugin\WebhookEventProcessor;

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

    private $externalPayment;

    private $order = false;


    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Controller\ResultFactory $resultFactory,
        \Magento\Sales\Api\OrderRepositoryInterface $orderRepository,
        \Komoju\Payments\Model\ExternalPaymentFactory $externalPaymentFactory,
        \Komoju\Payments\Gateway\Config\Config $config,
        \Psr\Log\LoggerInterface $logger = null
    ) {
        $this->logger = $logger ?: ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
        $this->_resultFactory = $resultFactory;
        $this->orderRepository = $orderRepository;
        $this->externalPayment = $externalPaymentFactory->create();
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

        $requestBody = $this->getRequest()->getContent();
        $webhookEvent = new WebhookEvent($requestBody);
        
        $this->logger->info('event type: ' . $webhookEvent->eventType());

        $externalOrderNum = $webhookEvent->externalOrderNum();
        try {
            $order = $this->getOrder($externalOrderNum);
            
            $webhookEventProcessor = new WebhookEventProcessor($webhookEvent, $order);
            $webhookEventProcessor->processEvent();
        } catch (NoSuchEntityException $exception) {
            // if we can't find a matching komoju_external_payment then we're
            // assuming that the order belongs to another system
            $this->logger->info('No matching records found for external_order_num: ' . $externalOrderNum . '. Ignoring event');
        }

        
        $result = $this->_resultFactory->create(ResultFactory::TYPE_JSON);
        $result->setHttpResponseCode(200);
        $result->setData('');
        return $result;
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

    private function getOrder($externalOrderNum) {
        $this->logger->info('$externalOrderNum:' . $externalOrderNum);
        $payment = $this->externalPayment->getCollection()->getRecordForExternalOrderNum($externalOrderNum);
        $orderId = $payment->getSalesOrderId();

        return $this->orderRepository->get($orderId);
    }

    private function isHmacValid() {
        $hmacHeader = $this->getRequest()->getHeader('x-komoju-signature');
        $webhookSecretToken = $this->config->getWebhookSecretToken();
        $reqBody = $this->getRequest()->getContent();
        
        $calculatedHmac = hash_hmac('sha256', $reqBody, $webhookSecretToken);
        
        return hash_equals($hmacHeader, $calculatedHmac);
    }
}