<?php

namespace Komoju\Payments\Observer;

use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Event\Observer;
use Magento\Quote\Api\CartRepositoryInterface;
use Psr\Log\LoggerInterface;

class RestoreAfterCancel implements ObserverInterface
{
    protected CheckoutSession $checkoutSession;
    protected CartRepositoryInterface $quoteRepository;
    private LoggerInterface $logger;

    public function __construct(
        CheckoutSession $checkoutSession,
        CartRepositoryInterface $quoteRepository,
        LoggerInterface $logger = null
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->quoteRepository = $quoteRepository;
        $this->logger = $logger ?: ObjectManager::getInstance()->get(LoggerInterface::class);
    }

    public function execute(Observer $observer)
    {
        $lastRealQuoteId = $this->checkoutSession->getLastRealQuoteId();

        if (!$lastRealQuoteId) {
            $quote = $observer->getEvent()->getQuote();
            $quote->setIsActive(true);
            return;
        }

        $order = $observer->getEvent()->getOrder();
        $quote = $this->quoteRepository->get($lastRealQuoteId);

        if ($order) {
            try {
                $this->checkoutSession->replaceQuote($quote);
                $this->checkoutSession->restoreQuote();
            } catch (Exception $e) {
                $this->logger->info('RestoreAfterCancel:: Fail to restore');
            }
        }
    }
}
