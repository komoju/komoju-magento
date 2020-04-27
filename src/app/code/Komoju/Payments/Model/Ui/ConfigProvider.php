<?php

namespace Komoju\Payments\Model\Ui;

use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Braintree\Gateway\Config\Config;
use Magento\Framework\Session\SessionManagerInterface;

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
        SessionManagerInterface $session
    ) {
        $this->config = $config;
        $this->session = $session;
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
                    'title' => $this->config->getTitle(),
                    'description' => $this->config->getDescription(),
                    'enable_credit_card_payments' => $this->config->getEnableCreditCardPayments(),
                    'enable_konbini_payments' => $this->config->getEnableKonbiniPayments(),
                    'merchant_id'  => $this->config->getMerchantId(),
                    'secret_key' => $this->config->getSecretKey(),
                    'webhook_secret_token' => $this->config->getWebhookSecretToken()
                ]
            ]
        ];
    }

}