<?php

namespace Komoju\Payments\Observer;

use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Event\Observer;
use Magento\Sales\Model\Order;
use Magento\Quote\Api\CartRepositoryInterface;
use Psr\Log\LoggerInterface;

/**
 * Observer for restoring a customer's quote during the checkout,
 * if the last order state is pending payment.
 *
 * Configured to listen to `controller_action_postdispatch_checkout_index_index` event.
 * It verifies if the last real order within the session is still pending payment.
 * If so, it restores the quote to the session.
 * This allows customers to resume their cart and complete the transaction without re-entering info.
 * For more information, please check the events_and_observers.md file in docs folder.
 */
class RestoreQuoteFromSession implements ObserverInterface
{
    protected CheckoutSession $checkoutSession;
    protected CartRepositoryInterface $quoteRepository;
    private LoggerInterface $logger;

    public function __construct(
        CheckoutSession $checkoutSession,
        CartRepositoryInterface $quoteRepository,
        ?LoggerInterface $logger = null
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->quoteRepository = $quoteRepository;
        $this->logger = $logger ?: ObjectManager::getInstance()->get(LoggerInterface::class);
    }

    public function execute(Observer $observer)
    {
        $lastRealQuoteId = $this->checkoutSession->getLastRealQuoteId();

        if (!$lastRealQuoteId) {
            $this->logger->info('No last real quote ID found');
            return;
        }

        $quote = $this->quoteRepository->get($lastRealQuoteId);

        if ($quote) {
            $order = $this->checkoutSession->getLastRealOrder();
            if ($order) {
                $status = $order->getStatus();

                if ($status == Order::STATE_PENDING_PAYMENT && $quote->getItemsCount() > 0) {
                    $this->checkoutSession->replaceQuote($quote);
                    $this->checkoutSession->restoreQuote();
                }
            }
        }
    }
}
