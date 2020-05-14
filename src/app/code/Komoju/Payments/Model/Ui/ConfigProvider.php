<?php

namespace Komoju\Payments\Model\Ui;

use Magento\Checkout\Model\ConfigProviderInterface;
use Komoju\Payments\Gateway\Config\Config;
use Magento\Framework\Session\SessionManagerInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;

class ConfigProvider implements ConfigProviderInterface {
    const CODE = 'komoju_payments';

        /**
     * @var Config
     */
    private $config;

    /**
     * @var SessionManagerInterface
     */
    private $session;

    /**
     * Constructor
     *
     * @param Config $config
     * @param SessionManagerInterface $session
     */
    public function __construct(
        Config $config,
        SessionManagerInterface $session,
        ScopeConfigInterface $scopeConfig
    ) {
        $this->config = $config;
        $this->session = $session;
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Retrieve assoc array of checkout configuration
     *
     * @return array
     */
    public function getConfig() {
        $storeId = $this->session->getStoreId();
        $isActive = $this->config->isActive($storeId);

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

}