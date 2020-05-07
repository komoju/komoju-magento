<?php

namespace Komoju\Payments\Gateway\Config;

use Magento\Framework\App\Config\ScopeConfigInterface;

/**
 * Class Config
 */
class Config extends \Magento\Payment\Gateway\Config\Config {

    private $urlInterface;

    /**
     * Komoju config constructor
     *
     * @param ScopeConfigInterface $scopeConfig
     * @param null|string $methodCode
     * @param string $pathPattern
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig,
        \Magento\Framework\UrlInterface $urlInterface,
        $methodCode = null,
        $pathPattern = self::DEFAULT_PATH_PATTERN
    ) {
        $this->urlInterface = $urlInterface;
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

    public function getRedirectUrl() {
        return $this->urlInterface->getUrl('komoju/hostedpage/redirect');
    }
}