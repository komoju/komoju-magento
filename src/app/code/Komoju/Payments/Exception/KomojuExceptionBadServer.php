<?php

namespace Komoju\Payments\Exception;

class KomojuExceptionBadServer extends \Magento\Framework\Exception\LocalizedException
{
    public $httpCode;

    public function __construct($msg, $httpCode = 400)
    {
        $this->httpCode = $httpCode;
        if (is_string($msg)) {
            parent::__construct(__($msg));
        } else {
            parent::__construct($msg);
        }
    }
}
