<?php

namespace Komoju\Payments\Exception;

/**
 * An InvalidJsonException is thrown when the webhook endpoint receives an
 * event from that it knows how to process, but contains an invalid JSON body.
 */
class InvalidJsonException extends \Magento\Framework\Exception\LocalizedException
{
    public $statusCode;
    
    public function __construct($msg, $statusCode = 400)
    {
        $this->statusCode = $statusCode;
        if (is_string($msg)) {
            parent::__construct(__($msg));
        } else {
            parent::__construct($msg);
        }
    }
}
