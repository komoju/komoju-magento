<?php
namespace Komoju\Payments\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\ObjectManager;

class PaymentMethodAvailable implements ObserverInterface
{
    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    private $storeManager;

    private $allowableCurrencyCodes;

    private $methodCode;

    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        $methodCode,
        $allowableCurrencyCodes,
        \Psr\Log\LoggerInterface $logger = null
    ) {
        $this->storeManager = $storeManager;
        $this->methodCode = $methodCode;
        $this->allowableCurrencyCodes = $allowableCurrencyCodes;
        $this->logger = $logger ?: ObjectManager::getInstance()->get(\Psr\Log\LoggerInterface::class);
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        if($observer->getEvent()->getMethodInstance()->getCode()==$this->methodCode){
            $checkResult = $observer->getEvent()->getResult();

            $baseCurrencyCode = $this->storeManager->getStore()->getBaseCurrencyCode();
            if (in_array($baseCurrencyCode, $this->allowableCurrencyCodes)) {
                $checkResult->setData('is_available', true); 
            } else {
                $this->logger->info('Store currency code: ' . $baseCurrencyCode . ' is not in the list of allowable currency codes for Komoju');
                $checkResult->setData('is_available', false); 
            }
        }
    }
}