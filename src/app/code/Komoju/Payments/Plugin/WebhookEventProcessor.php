<?php

namespace Komoju\Payments\Plugin;

use Magento\Sales\Model\Order;
use Komoju\Payments\Model\WebhookEvent;
use Komoju\Payments\Exception\UnknownEventException;

class WebhookEventProcessor {

    /**
     * Takes the event and the order and updates the system according to how the
     * payment has progressed with Komoju
     * @param Komoju\Payments\Model\WebhookEvent $webhookEvent
     * @param Magento\Sales\Model\Order $order
     */
    public static function processEvent($webhookEvent, $order) {
        if($webhookEvent->eventType() == 'payment.captured') {
            $order->setState(Order::STATE_PROCESSING);
            $order->setStatus(Order::STATE_PROCESSING);
            $order->addStatusHistoryComment('Payment successfully received');
            $order->save();
        } elseif($webhookEvent->eventType() == 'payment.authorized') {
            $order->addStatusHistoryComment('Received payment authorization for type: ' . $webhookEvent->paymentType() . 'Payment deadline is: ' . $webhookEvent->paymentDeadline());
            $order->save();
        } elseif($webhookEvent->eventType() == 'payment.expired') {
            $order->setState(Order::STATE_CANCELED);
            $order->setStatus('Payment expired');
            $order->addStatusHistoryComment('Payment was not received before expiry time');
            $order->save();
        } elseif($webhookEvent->eventType() == 'payment.cancelled') {
            $order->setState(Order::STATE_CANCELED);
            $order->setStatus(Order::STATE_CANCELED);
            $order->addStatusHistoryComment('Received cancellation notice from Komoju');
            $order->save();
        } elseif($webhookEvent->eventType() == 'payment.failed') {
            $order->setState(Order::STATE_CANCELED);
            $order->setStatus('Payment failed');
            $order->save();
        } elseif($webhookEvent->eventType() == 'payment.refunded') {
            // TODO: Implement once I figure out how Magento handles refunds
        } else {
            throw new UnknownEventException('Unknown event type: ' . $webhookEvent->eventType());
        }
    }
}