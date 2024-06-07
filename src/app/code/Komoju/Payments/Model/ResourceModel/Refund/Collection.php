<?php
namespace Komoju\Payments\Model\ResourceModel\Refund;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;
use Magento\Framework\DataObject;
use Komoju\Payments\Model\Refund as RefundModel;
use Komoju\Payments\Model\ResourceModel\Refund as RefundResourceModel;

/**
 * The Collection class is an abstraction on top of queries to the database.
 * It's the main interface for access ExternalPayment resources.
 */
class Collection extends AbstractCollection
{
    /**
     * Defines the resource models the collection is matched to
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init(RefundModel::class, RefundResourceModel::class);
    }

    /**
     * Returns the record that matches the $refundId. If there's no matching
     * record then we assume that the refund has not been processed yet.
     * @param string $refundId
     * @return DataObject|null
     */
    public function getRecordForRefundId($refundId)
    {
        $collection = $this->addFieldToFilter('refund_id', ['eq' => $refundId]);

        if ($collection->getSize() < 1) {
            return null;
        }

        return $collection->getFirstItem();
    }
}
