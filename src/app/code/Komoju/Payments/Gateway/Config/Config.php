<?php

namespace Komoju\Payments\Gateway\Config;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Serialize\Serializer\Json;

/**
 * Class Config
 */
class Config extends \Magento\Payment\Gateway\Config\Config {
    /**
     * @var \Magento\Framework\Serialize\Serializer\Json
     */
    private $serializer;

    /**
     * Komoju config constructor
     *
     * @param ScopeConfigInterface $scopeConfig
     * @param null|string $methodCode
     * @param string $pathPattern
     * @param Json|null $serializer
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig,
        $methodCode = null,
        $pathPattern = self::DEFAULT_PATH_PATTERN,
        Json $serializer = null
    ) {
        parent::__construct($scopeConfig, $methodCode, $pathPattern);
        $this->serializer = $serializer ?: \Magento\Framework\App\ObjectManager::getInstance()
            ->get(Json::class);
    }

    public function isActive($storeId = null)
    {
        return true;
        // return (bool) $this->getValue('active', $storeId);
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
        return (bool) $this->getValue('enable_credit_card_payments', $storeId);
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