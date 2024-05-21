<?php

namespace Komoju\Payments\Observer;

use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Event\Observer;
use Magento\Framework\Session\SessionManager as CoreSession;
use Magento\Sales\Model\Order;
use Magento\Quote\Api\CartRepositoryInterface;
use Psr\Log\LoggerInterface;

class RestoreQuoteFromSession implements ObserverInterface
{
    protected $checkoutSession;
    protected $coreSession;
    protected $quoteRepository;
    private $logger;

    public function __construct(
        CheckoutSession $checkoutSession,
        CoreSession $coreSession,
        CartRepositoryInterface $quoteRepository,
        LoggerInterface $logger = null
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->coreSession = $coreSession;
        $this->quoteRepository = $quoteRepository;

        $this->logger = $logger ?: ObjectManager::getInstance()->get(LoggerInterface::class);
    }

    public function execute(Observer $observer)
    {
        $this->logger->info('RestoreQuoteFromSession observer triggered');

        $quote = $this->checkoutSession->getQuote();

        if ($quote) {
            $this->checkoutSession->restoreQuote();
            $order = $quote->getOrder();

            // $this->logger->info('### Restoring quote data from session: ' . json_encode($order));

            if ($order && $order->getState() == Order::STATE_PENDING_PAYMENT) {
                $this->quoteRepository->save($quote);
            }
        }
    }
}
