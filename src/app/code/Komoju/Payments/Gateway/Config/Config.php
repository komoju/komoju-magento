<?php

namespace Komoju\Payments\Gateway\Config;

use Magento\Framework\App\Config\ScopeConfigInterface;

/**
 * This class provides a programmatic interface between the rest of the module
 * and the options set for the module in the admin panel.
 */
class Config extends \Magento\Payment\Gateway\Config\Config
{

    private $urlInterface;

    /**
     * Komoju config constructor
     *
     * @param ScopeConfigInterface $scopeConfig
     * @param null|string $methodCode The method code is injected in frontend/di.xml
     * @param string $pathPattern
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig,
        \Magento\Framework\UrlInterface $urlInterface,
        \Magento\Framework\Locale\Resolver $locale,
        $methodCode = null,
        $pathPattern = self::DEFAULT_PATH_PATTERN
    ) {
        $this->urlInterface = $urlInterface;
        $this->locale = $locale;
        parent::__construct($scopeConfig, $methodCode, $pathPattern);
    }

    /**
     * Returns the value for the "Enable this solution" option on the admin page.
     * NOTE: Just because this is selected doesn't mean that the payment method will
     * appear, if the store currency isn't by Komoju then it isn't displayed on the
     * checkout page.
     * @param int|null $storeId
     * @return bool
     */
    public function isActive($storeId = null)
    {
        return (bool) $this->getValue('active', $storeId);
    }

    /**
     * Returns the value of the Title field on the admin page.
     * @param int|null $storeId
     * @return string
     */
    public function getTitle($storeId = null)
    {
        return $this->getValue('title', $storeId);
    }

    /**
     * Returns the value of the "Komoju merchant ID" on the field on the admin
     * page.
     * @param int|null $storeId
     * @return string
     */
    public function getMerchantId($storeId = null)
    {
        return $this->getValue('merchant_id', $storeId);
    }

    /**
     * Returns the value of the "Secret Key from Komoju" on the field on the admin
     * page.
     * @param int|null $storeId
     * @return string
     */
    public function getSecretKey($storeId = null)
    {
        return $this->getValue('secret_key', $storeId);
    }

    /**
     * Returns the value of the "Webhook Secret Token" on the field on the admin
     * page.
     * @param int|null $storeId
     * @return string
     */
    public function getWebhookSecretToken($storeId = null)
    {
        return $this->getValue('webhook_secret_token', $storeId);
    }

    /**
     * Returns the URL for the redirect controller, where the hosted page API is
     * built and sent to the browser to redirect the user for payment. This isn't
     * related to any fields on the admin page, but rather a internal plugin
     * constant.
     * @return string
     */
    public function getRedirectUrl()
    {
        return $this->urlInterface->getUrl('komoju/hostedpage/redirect');
    }

    /**
     * Gets the store locale and compares it to acceptable komoju locales
     * @return string (store locale or default locale)
     */

    public function getKomojuLocale()
    {
      $defaultLocale = 'en';
      $komojuLocales = array('en','ja');
      $storeLocale = substr($this->locale->getLocale(), 0, 2);
      if (in_array($storeLocale, $komojuLocales)) {
        return $storeLocale;
      } else {
        return $defaultLocale;
      }
    }
}
