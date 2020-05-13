<?php
namespace Komoju\Payments\Model\ResourceModel\ExternalPayment;

class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
	/**
	 * Define resource model
	 *
	 * @return void
	 */
	protected function _construct()
	{
		$this->_init('Komoju\Payments\Model\ExternalPayment', 'Komoju\Payments\Model\ResourceModel\ExternalPayment');
    }

    public function getRecordForExternalOrderNum($externalOrderNum) {
        $collection = $this
            ->addFieldToFilter('external_payment_id', ['eq' => $externalOrderNum]);

        return $collection->getFirstItem();
    }
}