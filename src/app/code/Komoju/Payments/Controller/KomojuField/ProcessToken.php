<?php

namespace Komoju\Payments\Controller\KomojuField;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;

use Magento\Checkout\Model\Session;
use Magento\Sales\Model\Order;

use Komoju\Payments\Api\KomojuApi;
use Komoju\Payments\Gateway\Config\Config;
use Komoju\Payments\Model\ExternalPaymentFactory;
use Komoju\Payments\Model\ExternalPayment;

use Psr\Log\LoggerInterface;
use Exception;

class ProcessToken extends Action
{
    protected JsonFactory $jsonResultFactory;
    protected KomojuApi $komojuApi;
    protected Session $checkoutSession;
    protected Config $config;
    protected LoggerInterface $logger;
    protected Order $order;
    protected ExternalPaymentFactory $externalPaymentFactory;
    protected ExternalPayment $externalPayment;

    public function __construct(
        Context $context,
        JsonFactory $jsonResultFactory,
        Session $checkoutSession,
        ExternalPaymentFactory $externalPaymentFactory,
        ExternalPayment $externalPayment,
        KomojuApi $komojuApi,
        Config $config,
        LoggerInterface $logger
    ) {
        $this->jsonResultFactory = $jsonResultFactory;
        $this->checkoutSession = $checkoutSession;
        $this->externalPayment = $externalPaymentFactory->create();
        $this->komojuApi = $komojuApi;
        $this->config = $config;
        $this->logger = $logger;
        parent::__construct($context);
    }

    public function execute()
    {
        $result = $this->jsonResultFactory->create();
        $order = $this->getOrder();

        if (!$order) {
            $this->logger->debug('Executing KomojuSessionData controller' . 'No order found');
            return $result->setData(['success' => false, 'message' => 'No order found']);
        }

        if ($this->getRequest()->isPost()) {
            $postData = $this->getRequest()->getContent();
            $tokenData = json_decode($postData);

            $currencyCode = $order->getOrderCurrencyCode();
            $externalPayment = $this->createExternalPayment($order);

            $session = $this->komojuApi->createSession([
                'amount' => $order->getGrandTotal(),
                'currency' => $currencyCode,
                'default_locale' => $this->config->getKomojuLocale(),
                'email' => $order->getCustomerEmail(),
                'metadata' => ['note' => 'testing'],
                'payment_data' => [
                    'name' => $order->getCustomerName(),
                    'amount' => $order->getGrandTotal(),
                    'currency' => $currencyCode,
                    'external_order_num' => $externalPayment
                ],
            ]);

            try {
                $data = $this->komojuApi->paySession($session->id, [
                    'payment_details' => (string) $tokenData->token->id
                ]);

                return $result->setData(['success' => true, 'message' => 'Token processed successfully', 'data' => $data]);
            } catch (Exception $e) {
                $data = ['redirect_url' => $session->session_url];
                return $result->setData(['success' => true, 'message' => 'Cannot process token, redirect', 'data' => $data]);
            }
        }

        return $result->setData(['success' => false, 'message' => 'Invalid request']);
    }

    private function getOrder()
    {
        $order = $this->checkoutSession->getLastRealOrder();
        // $this->logger->info('ProcessToken::GetOrder->order id: ' . $order->getEntityId());
        return $order;
    }

    private function createExternalPayment($order)
    {
        return $this->externalPayment->createExternalPayment($order)->getExternalPaymentId();
    }
}
