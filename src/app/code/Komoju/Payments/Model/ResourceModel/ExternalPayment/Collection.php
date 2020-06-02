<?php
namespace Komoju\Payments\Model\ResourceModel\ExternalPayment;

use Magento\Framework\Exception\NoSuchEntityException;

/**
 * The Collection class is an abstraction on top of queries to the database.
 * It's the main interface for access ExternalPayment resources
 */
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    /**
     * Defines the resource models the collection relates to.
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init(
            \Komoju\Payments\Model\ExternalPayment::class,
            \Komoju\Payments\Model\ResourceModel\ExternalPayment::class
        );
    }

    /**
     * Finds the ExternalOrder record that matches the $externalOrderNum passed in.
     * The record contains the order id and can be used to map the relationship
     * between the external order num and the sales order.
     * @param string $externalOrderNum The external_order_num sent with the webhook
     * @return Komoju\Payments\Model\ExternalPayment
     * @throws NoSuchEntityException Thrown iff there's no matching record
     */
    public function getRecordForExternalOrderNum($externalOrderNum)
    {
        $collection = $this
            ->addFieldToFilter('external_payment_id', ['eq' => $externalOrderNum]);

        if ($collection->getSize() < 1) {
            throw new NoSuchEntityException();
        }

        return $collection->getFirstItem();
    }
}
