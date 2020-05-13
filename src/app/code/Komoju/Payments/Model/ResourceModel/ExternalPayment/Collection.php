<?php
namespace Komoju\Payments\Model\ResourceModel\Post;

class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
	/**
	 * Define resource model
	 *
	 * @return void
	 */
	protected function _construct()
	{
		$this->_init('Komoju\Payments\Model\Post', 'Komoju\Payments\Model\ResourceModel\Post');
    }
}