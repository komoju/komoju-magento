<?php

namespace Komoju\Payments\Observer;

use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Event\Observer;
use Magento\Framework\Session\SessionManager;
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
    protected SessionManager $sessionManager;
    protected CartRepositoryInterface $quoteRepository;
    private LoggerInterface $logger;

    public function __construct(
        CheckoutSession $checkoutSession,
        SessionManager $sessionManager,
        CartRepositoryInterface $quoteRepository,
        LoggerInterface $logger = null
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->sessionManager = $sessionManager;
        $this->quoteRepository = $quoteRepository;
        $this->logger = $logger ?: ObjectManager::getInstance()->get(LoggerInterface::class);
    }

    public function execute(Observer $observer)
    {
        $quote = $this->checkoutSession->getQuote();

        if ($quote) {
            $order = $this->checkoutSession->getLastRealOrder();

            if ($order && $order->getStatus() == Order::STATE_PENDING_PAYMENT) {
                $this->checkoutSession->restoreQuote();
            } else {
                $this->checkoutSession->clearQuote();
                $this->checkoutSession->clearStorage();
            }
        }
    }
}
