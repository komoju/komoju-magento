<?php

namespace Komoju\Payments\Model;

use Komoju\Payments\Exception\InvalidJsonException;

/**
 * An encapsulation around the data from Webhook events. This allows us to
 * change the structure of the webhook request data without having to change it
 * throughout the code. This has no corresponding database table, it is just an
 * in memory object created during processing.
 */
class WebhookEvent
{

    private $requestJson;

    /**
     * Constructor
     * @param string $requestBody the body of the webhook request
     * @throws Komoju\Payments\Exception\InvalidJsonException If the requestBody does
     * not contain valid JSON then the InvalidJsonException and a response of 400
     * is returned to the Komoju.
     */
    public function __construct($requestBody)
    {
        $this->requestJson = json_decode($requestBody, true);

        if (! empty(json_last_error())) {
            $errorMsg = (__("KOMOJU Payments JSON Decoding Failure. Error: %1", json_last_error_msg()));
            throw new Komoju\Payments\Exception\InvalidJsonException($errorMsg);
        }
    }

    /**
     * A getter to retrieve the event type from the webhook event
     * @return string
     */
    public function eventType()
    {
        return $this->requestJson['type'];
    }

    private function data()
    {
        return $this->requestJson['data'];
    }

    /**
     * A getter to retrieve the status of the webhook event
     * @return string
     */
    public function status()
    {
        return $this->data()['status'];
    }

    /**
     * A getter to retrieve the external_order_num from the webhook event
     * @return string|null
     */
    public function externalOrderNum()
    {
        $data = $this->data();
        return isset($data['external_order_num']) ? $data['external_order_num'] : null;
    }

    /**
     * A getter to retrieve the payment id from the webhook event
     * @return string
     */
    public function uuid()
    {
        return $this->data()['id'];
    }

    /**
     * A getter to retrieve the currency from the webhook event
     * @return string
     */
    public function currency()
    {
        return $this->data()['currency'];
    }

    /**
     * A getter to retrieve the total of the payment from the webhook event. This
     * is the price of the purchase + tax + payment_method_fee.
     * @return int
     */
    public function grandTotal()
    {
        return $this->data()['total'];
    }

    /**
     * A getter to retrieve the payment method fee from the webhook event
     * @return int
     */
    public function paymentMethodFee()
    {
        return $this->data()['payment_method_fee'];
    }

    /**
     * A getter to retrieve the additional information from the webhook event
     * @return array
     */
    public function additionalInformation()
    {
        return $this->data()['payment_details'];
    }

    /**
     * A getter to retrieve the payment type from the webhook event
     */
    public function paymentType()
    {
        return $this->additionalInformation()['type'];
    }

    /**
     * A getter to retrieve the tax from the webhook event
     * @return int
     */
    public function tax()
    {
        return $this->data()['tax'];
    }

    /**
     * A getter to retrieve the amount from the webhook event
     * @return int
     */
    public function amount()
    {
        return $this->data()['amount'];
    }

    /**
     * A getter to retrieve the amount refunded from the webhook event. This will
     * only be sent on payment.refunded events
     * @return int
     */
    public function amountRefunded()
    {
        return $this->data()['amount_refunded'];
    }

    /**
     * A getter to retrieve the refunds
     * @return array
     */
    public function getRefunds()
    {
        return $this->data()['refunds'];
    }

    /**
     * A getter to retrieve the payment deadline from the webhook event
     * @return string
     */
    public function paymentDeadline()
    {
        return $this->data()['payment_deadline'];
    }
}
