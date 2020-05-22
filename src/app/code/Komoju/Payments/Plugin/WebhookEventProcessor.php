<?php

namespace Komoju\Payments\Plugin;

use Magento\Sales\Model\Order;
use Komoju\Payments\Model\WebhookEvent;
use Komoju\Payments\Exception\UnknownEventException;

class WebhookEventProcessor {

    private $webhookEvent;
    private $order;
    private $creditmemoFactory;
    private $creditmemoService;
    private $komojuRefundFactory;
    private $logger;

    public function __construct(
        \Magento\Sales\Model\Order\CreditmemoFactory $creditmemoFactory,
        \Magento\Sales\Model\Service\CreditmemoService $creditmemoService,
        \Komoju\Payments\Model\RefundFactory $komojuRefundFactory,
        \Psr\Log\LoggerInterface $logger,
        \Komoju\Payments\Model\WebhookEvent $webhookEvent,
        \Magento\Sales\Model\Order $order
        ) {
            $this->creditmemoFactory = $creditmemoFactory;
            $this->creditmemoService = $creditmemoService;
            $this->komojuRefundFactory = $komojuRefundFactory;
            $this->logger = $logger;
            $this->webhookEvent = $webhookEvent;
            $this->order = $order;
    }

    /**
     * Takes the event and the order and updates the system according to how the
     * payment has progressed with Komoju
     * @param Komoju\Payments\Model\WebhookEvent $webhookEvent
     * @param Magento\Sales\Model\Order $order
     */
    public function processEvent() {
        if($this->webhookEvent->eventType() == 'payment.captured') {
            $paymentAmount = $this->webhookEvent->amount();
            $currentTotalPaid = $this->order->getTotalPaid();
            $this->order->setTotalPaid($paymentAmount + $currentTotalPaid);
            $this->order->setState(Order::STATE_PROCESSING);
            $this->order->setStatus(Order::STATE_PROCESSING);
            
            $statusHistoryComment = $this->prependExternalOrderNum('Payment successfully received in the amount of: ' . $paymentAmount . ' ' . $this->webhookEvent->currency());
            $this->order->addStatusHistoryComment($statusHistoryComment);

            $this->order->save();
        } elseif($this->webhookEvent->eventType() == 'payment.authorized') {
            $statusHistoryComment = $this->prependExternalOrderNum('Received payment authorization for type: ' . $this->webhookEvent->paymentType() . 'Payment deadline is: ' . $this->webhookEvent->paymentDeadline());
            $this->order->addStatusHistoryComment($statusHistoryComment);

            $this->order->save();
        } elseif($this->webhookEvent->eventType() == 'payment.expired') {
            $this->order->setState(Order::STATE_CANCELED);
            $this->order->setStatus(Order::STATE_CANCELED);

            $statusHistoryComment = $this->prependExternalOrderNum('Payment was not received before expiry time');
            $this->order->addStatusHistoryComment($statusHistoryComment);

            $this->order->save();
        } elseif($this->webhookEvent->eventType() == 'payment.cancelled') {
            $this->order->setState(Order::STATE_CANCELED);
            $this->order->setStatus(Order::STATE_CANCELED);
            
            $statusHistoryComment = $this->prependExternalOrderNum('Received cancellation notice from Komoju');
            $this->order->addStatusHistoryComment($statusHistoryComment);
            $this->order->save();
        } elseif($this->webhookEvent->eventType() == 'payment.failed') {
            $this->order->setState(Order::STATE_CANCELED);
            $this->order->setStatus(Order::STATE_CANCELED);

            $statusHistoryComment = $this->prependExternalOrderNum('Payment failed');
            $this->order->addStatusHistoryComment($statusHistoryComment);

            $this->order->save();
        } elseif($this->webhookEvent->eventType() == 'payment.refunded') {
            $refundedAmount = $this->webhookEvent->amountRefunded();
            $refundCurrency = $this->webhookEvent->currency();
            
            $statusHistoryComment = $this->prependExternalOrderNum('Order has been fully refunded.');
            
            $this->order->setState(Order::STATE_COMPLETE);
            $this->order->setStatus(Order::STATE_COMPLETE);
            $this->order->addStatusHistoryComment($statusHistoryComment);
            $this->order->save();
        } elseif($this->webhookEvent->eventType() == 'payment.refund.created') {
            $grandTotal = $this->order->getBaseGrandTotal();
            $totalAmountRefunded = $this->webhookEvent->amountRefunded();
            $refundCurrency = $this->webhookEvent->currency();

            $this->order->setTotalRefunded($totalAmountRefunded);

            $refunds = $this->webhookEvent->getRefunds();
            $refundsToProcess = [];
            
            foreach ($refunds as $refund) {
                $refundId = $refund['id'];
                $komojuRefundCollection = $this->komojuRefundFactory->create()->getCollection();
                $refundRecord = $komojuRefundCollection->getRecordForRefundId($refundId, $this->logger);

                if (!$refundRecord) {
                    array_push($refundsToProcess, $refund);
                }
            }

            foreach($refundsToProcess as $refund) {
                $refundId = $refund['id'];
                $refundedAmount = $refund['amount'];
                $statusHistoryComment = $this->prependExternalOrderNum('Refund for order created. Amount: ' . $refundedAmount . ' ' . $refundCurrency );

                $creditmemo = $this->creditmemoFactory->createByOrder($this->order);
                $creditmemo->setSubtotal($refundedAmount);
                $creditmemo->addComment($statusHistoryComment);
                $this->creditmemoService->refund($creditmemo, true);

                $creditmemoId = $creditmemo->getEntityId();
                $komojuRefund = $this->komojuRefundFactory->create();
                $komojuRefund->addData([
                    'refund_id' => $refundId,
                    'sales_creditmemo_id' => $creditmemoId,
                ]);
                $komojuRefund->save();

                $this->order->addStatusHistoryComment($statusHistoryComment);
            }
            
            // $baseTotalNotRefunded = $invoice->getBaseGrandTotal() - $invoice->getBaseTotalRefunded();
            // $baseToOrderRate = $order->getBaseToOrderRate();
            // $creditmemo->setBaseSubtotal($baseTotalNotRefunded);
            // $creditmemo->setSubtotal($baseTotalNotRefunded * $baseToOrderRate);
            // $creditmemo->setBaseGrandTotal($refundAmount);
            // $creditmemo->setGrandTotal($refundAmount * $baseToOrderRate);

            $this->order->save();
        } else {
            throw new UnknownEventException('Unknown event type: ' . $this->webhookEvent->eventType());
        }
    }

    /**
     * Prepends the external order num to the string passed in. Because the
     * external_order_num passed to Komoju is a unique generated value, by
     * adding it to status history it makes it easier for the Magento admins to
     * search through the Komoju website with a unique value mapped to the order
     * @param string $str
     * @return string
     */
    private function prependExternalOrderNum($str) {
        return 'External Order ID: ' . $this->webhookEvent->externalOrderNum() . ' ' . $str;
    } 
}