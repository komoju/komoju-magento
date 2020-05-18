<?php

namespace Komoju\Payments\Model\Ui;

use Magento\Framework\App\ObjectManager;
use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Framework\Session\SessionManagerInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;

use Komoju\Payments\Gateway\Config\Config;

class ConfigProvider implements ConfigProviderInterface {
    const CODE = 'komoju_payments';
    const ALLOWABLE_CURRENCY_CODES = ['JPY'];

        /**
     * @var Config
     */
    private $config;

    /**
     * @var SessionManagerInterface
     */
    private $session;

    /**
     * @var Psr\Log\LoggerInterface
     */
    private $logger;

    /**
     * Constructor
     *
     * @param Config $config
     * @param SessionManagerInterface $session
     */
    public function __construct(
        Config $config,
        SessionManagerInterface $session,
        ScopeConfigInterface $scopeConfig,
        \Psr\Log\LoggerInterface $logger = null
    ) {
        $this->config = $config;
        $this->session = $session;
        $this->scopeConfig = $scopeConfig;
        $this->logger = $logger ?: ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
    }

    /**
     * Retrieve assoc array of checkout configuration
     *
     * @return array
     */
    public function getConfig() {
        $storeId = $this->session->getStoreId();
        $isActive = $this->shouldEnableKomojuPayments();

        return [
            'payment' => [
                self::CODE => [
                    'isActive' => $isActive,
                    'title' => $this->config->getTitle($storeId),
                    'available_payment_methods' => $this->createPaymentMethodOptions(),
                    'merchant_id'  => $this->config->getMerchantId(),
                    'redirect_url' => $this->config->getRedirectUrl(),
                ]
            ]
        ];
    }

    private function createPaymentMethodOptions() {
        $paymentMethodOptions = [];
        if ($this->config->areCreditCardPaymentsEnabled()) {
            $paymentMethodOptions['credit_card'] = __('Credit Card');
        }

        if ($this->config->areKonbiniPaymentsEnabled()) {
            $paymentMethodOptions['konbini'] = __('Konbini');
        }

        return $paymentMethodOptions;
    }

    private function shouldEnableKomojuPayments() {
        $storeId = $this->session->getStoreId();
        return $this->config->isActive($storeId);
    }
}