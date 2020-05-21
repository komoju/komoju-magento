<?php
namespace Komoju\Payments\Model;

class Refund extends \Magento\Framework\Model\AbstractModel
{
	protected function _construct()
	{
		$this->_init('Komoju\Payments\Model\ResourceModel\Refund');
    }
}