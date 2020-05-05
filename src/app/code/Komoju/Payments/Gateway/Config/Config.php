<?php

namespace Komoju\Payments\Gateway\Config;

use Magento\Framework\App\Config\ScopeConfigInterface;

/**
 * Class Config
 */
class Config extends \Magento\Payment\Gateway\Config\Config {
    /**
     * Komoju config constructor
     *
     * @param ScopeConfigInterface $scopeConfig
     * @param null|string $methodCode
     * @param string $pathPattern
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig,
        $methodCode = null,
        $pathPattern = self::DEFAULT_PATH_PATTERN
    ) {
        parent::__construct($scopeConfig, $methodCode, $pathPattern);
    }

    public function isActive($storeId = null)
    {
        return (bool) $this->getValue('active', $storeId);
    }


    public function getTitle($storeId = null) {
        return $this->getValue('title', $storeId);
    }  
    
    public function getDescription($storeId = null) {
        return $this->getValue('description', $storeId);
    }

    public function areCreditCardPaymentsEnabled($storeId = null) {
        return (bool) $this->getValue('enable_credit_card_payments', $storeId);
    }

    public function areKonbiniPaymentsEnabled($storeId = null) {
        return (bool) $this->getValue('enable_konbini_payments', $storeId);
    }

    public function getMerchantId($storeId = null) {
        return $this->getValue('merchant_id', $storeId);
    }

    public function getSecretKey($storeId = null) {
        return $this->getValue('secret_key', $storeId);
    }

    public function getWebhookSecretToken($storeId = null) {
        return $this->getValue('webhook_secret_token', $storeId);
    }
}