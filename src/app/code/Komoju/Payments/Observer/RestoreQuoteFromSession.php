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
 * Observer for restoring a customer's quote during the checkout process when the last order is in a pending payment state.
 *
 * This class is configured to listen to the `controller_action_postdispatch_checkout_index_index` event.
 * It checks if the last real order placed within the session is still pending payment.
 * If so, it restores the quote to the session.
 * This action allows customers to return to their cart and potentially complete the transaction without needing to re-enter their information.
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
            }
        }
    }
}
