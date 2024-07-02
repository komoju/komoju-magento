<?php

namespace Komoju\Payments\Controller\KomojuField;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;

use Magento\Checkout\Model\Session;
use Magento\Checkout\Model\Cart;
use Magento\Sales\Model\Order;

// use Magento\Sales\Api\OrderRepositoryInterface;

use Psr\Log\LoggerInterface;

use Komoju\Payments\Gateway\Config\Config;
use Komoju\Payments\Api\KomojuApi;
use Komoju\Payments\Model\ExternalPaymentFactory;
use Komoju\Payments\Model\ExternalPayment;

class ProcessToken extends Action
{
    protected JsonFactory $jsonResultFactory;
    protected KomojuApi $komojuApi;
    protected Session $checkoutSession;
    protected LoggerInterface $logger;
    protected Order $order;
    protected ExternalPaymentFactory $externalPaymentFactory;
    protected ExternalPayment $externalPayment;

    public function __construct(
        Context $context,
        JsonFactory $jsonResultFactory,
        // OrderRepositoryInterface $orderRepository,
        Session $checkoutSession,
        ExternalPaymentFactory $externalPaymentFactory,
        ExternalPayment $externalPayment,
        KomojuApi $komojuApi,
        LoggerInterface $logger
    ) {
        $this->jsonResultFactory = $jsonResultFactory;
        $this->checkoutSession = $checkoutSession;
        $this->externalPayment = $externalPaymentFactory->create();
        // $this->orderRepository = $orderRepository;
        $this->komojuApi = $komojuApi;
        $this->logger = $logger;
        parent::__construct($context);
    }

    public function execute()
    {
        $result = $this->jsonResultFactory->create();
        $order = $this->getOrder();

        $this->logger->debug('Before checking Order');

        if ($order) {
            $this->logger->debug('Order Data' . json_encode($order->getEntityId()));
            $externalPayment = $this->createExternalPayment($order);
            $this->logger->info('ExternalPayment: ' . $externalPayment);
        } else {
            $this->logger->debug('Executing KomojuSessionData controller' . 'No order found');
        }

        $this->logger->debug('After checking Order');

        if ($this->getRequest()->isPost()) {
            $postData = $this->getRequest()->getContent();
            $tokenData = json_decode($postData);

            $this->logger->debug('Executing KomojuSessionData controller' . json_encode($tokenData));

            $currencyCode = $order->getOrderCurrencyCode();

            // Let's create a session
            $session = $this->komojuApi->createSession([
                'amount' => $order->getGrandTotal(),
                'currency' => $currencyCode,
                'default_locale' => 'en',
                'email' => $order->getCustomerEmail(),
                'metadata' => ['note' => 'testing'],
                'payment_data' => [
                    'name' => $order->getCustomerName(),
                    'amount' => $order->getGrandTotal(),
                    'currency' => $currencyCode,
                    'external_order_num' => $externalPayment
                ],
            ]);

            $data = $this->komojuApi->paySession($session->id, [
                'customer_email' => $order->getCustomerEmail(),
                'payment_details' => $tokenData->token->id
            ]);

            return $result->setData(['success' => true, 'message' => 'Token processed successfully', 'data' => $data]);
        }

        return $result->setData(['success' => false, 'message' => 'Invalid request']);
    }

    private function getOrder()
    {
        $this->logger->info('Getting An Order');
        // $this->checkoutSession = ObjectManager::getInstance()->get(Session::class);
        $order = $this->checkoutSession->getLastRealOrder();
        $this->logger->info('ProcessToken::GetOrder->order id: ' . $order->getEntityId());
        $this->logger->info('Getting An Order Done');
        return $order;
    }

    private function createExternalPayment($order)
    {
        return $this->externalPayment->createExternalPayment($order)->getExternalPaymentId();
    }
}
