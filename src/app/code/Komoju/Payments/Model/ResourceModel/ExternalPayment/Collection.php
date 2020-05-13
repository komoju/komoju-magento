<?php
namespace Komoju\Payments\Model\ResourceModel\ExternalPayment;

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
		$this->_init('Komoju\Payments\Model\ExternalPayment', 'Komoju\Payments\Model\ResourceModel\ExternalPayment');
    }

    public function getRecordForExternalOrderNum($externalOrderNum) {
        $collection = $this
            ->addFieldToFilter('external_payment_id', ['eq' => $externalOrderNum]);

        if ($collection->getSize() < 1) {
            throw new NoSuchEntityException();
        }

        return $collection->getFirstItem();
    }
}