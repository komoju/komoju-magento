<?php

namespace Komoju\Payments\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Checkout\Model\Session as CheckoutSession;
use Psr\Log\LoggerInterface;

class SaveQuoteBeforeOrder implements ObserverInterface
{
    protected $checkoutSession;
    protected $logger;

    public function __construct(
        CheckoutSession $checkoutSession,
        LoggerInterface $logger
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->logger = $logger;
    }

    public function execute(Observer $observer)
    {
        $quote = $observer->getEvent()->getQuote();
        $this->checkoutSession->setLastRealQuoteId($quote->getId());
    }
}
