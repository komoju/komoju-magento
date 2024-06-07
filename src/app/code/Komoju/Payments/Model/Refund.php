<?php
namespace Komoju\Payments\Model;

use Magento\Framework\Model\AbstractModel;
use Komoju\Payments\Model\ResourceModel\Refund as RefundResourceModel;

/**
 * The Refund model is for programmatic access to the komoju_refund data.
 *
 * The Refund model exists because payment.refund.created events that come
 * from Komoju list all the refunds that occurred for a transaction and don't
 * provide a way to determine which refund was the cause of the event to fire.
 * Because we don't want to process the same refund multiple times, the Refund model
 * exists to remember which refunds have already been processed. They also map to the
 * creditmemo's that have been created, but that's more of a future proofing act
 * in the event we may need that data.
 */
class Refund extends AbstractModel
{
    protected function _construct()
    {
        $this->_init(RefundResourceModel::class);
    }
}
