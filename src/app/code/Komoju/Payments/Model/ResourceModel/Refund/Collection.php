<?php
namespace Komoju\Payments\Model\ResourceModel\Refund;

use Magento\Framework\Exception\NoSuchEntityException;

class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
	/**
	 * Define resource model
	 *
	 * @return void
	 */
	protected function _construct()
	{
		$this->_init('Komoju\Payments\Model\Refund', 'Komoju\Payments\Model\ResourceModel\Refund');
    }

    public function getRecordForRefundId($refundId) {
        $collection = $this
            ->addFieldToFilter('refund_id', ['eq' => $refundId]);

        if ($collection->getSize() < 1) {
            return null;
        }

        return $collection->getFirstItem();
    }
}