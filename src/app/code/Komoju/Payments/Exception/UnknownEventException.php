<?php

namespace Komoju\Payments\Exception;

/**
 * An UnknownEventException is thrown when the webhook endpoint receives an
 * event from Komoju that it is not built to process.
 */
class UnknownEventException extends \Magento\Framework\Exception\LocalizedException {
    public $statusCode;
    
    public function __construct($msg, $statusCode = 400)
    {
        $this->statusCode = $statusCode;
        if (is_string($msg))
            parent::__construct(__($msg));
        else
            parent::__construct($msg);
    }
}