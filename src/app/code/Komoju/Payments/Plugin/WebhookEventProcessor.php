<?php

namespace Komoju\Payments\Plugin;

use Magento\Sales\Model\Order;
use Komoju\Payments\Model\WebhookEvent;
use Komoju\Payments\Exception\UnknownEventException;

class WebhookEventProcessor {

    private $webhookEvent;
    private $order;

    public function __construct($webhookEvent, $order) {
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
            $this->order->setState(Order::STATE_PROCESSING);
            $this->order->setStatus(Order::STATE_PROCESSING);
            
            $statusHistoryComment = $this->prependExternalOrderNum('Payment successfully received');
            $this->order->addStatusHistoryComment($statusHistoryComment);

            $this->order->save();
        } elseif($this->webhookEvent->eventType() == 'payment.authorized') {
            $statusHistoryComment = $this->prependExternalOrderNum('Received payment authorization for type: ' . $this->webhookEvent->paymentType() . 'Payment deadline is: ' . $this->webhookEvent->paymentDeadline());
            $this->order->addStatusHistoryComment($statusHistoryComment);

            $this->order->save();
        } elseif($this->webhookEvent->eventType() == 'payment.expired') {
            $this->order->setState(Order::STATE_CANCELED);
            $this->order->setStatus('Payment expired');

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
            $this->order->setStatus('Payment failed');

            $statusHistoryComment = $this->prependExternalOrderNum('Payment failed');
            $this->order->addStatusHistoryComment($statusHistoryComment);

            $this->order->save();
        } elseif($this->webhookEvent->eventType() == 'payment.refunded') {
            // TODO: Implement once I figure out how Magento handles refunds
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