<?php
namespace Komoju\Payments\Model\ResourceModel;

/**
 * The ExternalPayment class is a programmatic wrapper around direct database
 * access for the komoju_external_payment table
 */
class ExternalPayment extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
	
	public function __construct(
		\Magento\Framework\Model\ResourceModel\Db\Context $context
	)
	{
		parent::__construct($context);
	}
	
	protected function _construct()
	{
		$this->_init('komoju_external_payment', 'entity_id');
    }
}