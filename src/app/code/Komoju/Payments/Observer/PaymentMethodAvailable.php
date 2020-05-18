<?php
namespace Komoju\Payments\Observer;

use Magento\Framework\Event\ObserverInterface;

class PaymentMethodAvailable implements ObserverInterface
{
    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    private $storeManager;
    
    const ALLOWABLE_CURRENCY_CODES = ['JPY'];

    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager
    ) {
        $this->storeManager = $storeManager;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        if($observer->getEvent()->getMethodInstance()->getCode()=="komoju_payments"){
            $checkResult = $observer->getEvent()->getResult();

            $baseCurrencyCode = $this->storeManager->getStore()->getBaseCurrencyCode();
            if (in_array($baseCurrencyCode, self::ALLOWABLE_CURRENCY_CODES)) {
            // if (true) {
                $checkResult->setData('is_available', true); 
            } else {
                $checkResult->setData('is_available', false); 
            }
        }
    }
}