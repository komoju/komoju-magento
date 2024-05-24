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

class RestoreQuoteFromSession implements ObserverInterface
{
    protected $checkoutSession;
    protected $sessionManager;
    protected $quoteRepository;
    private $logger;

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

            if ($order) {
                $orderStatus = $order->getStatus();

                if ($orderStatus == ORDER::STATE_PENDING_PAYMENT) {
                    $this->checkoutSession->restoreQuote();
                }
            }
        }
    }
}
