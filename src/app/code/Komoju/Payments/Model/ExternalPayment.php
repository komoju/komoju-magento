<?php
namespace Komoju\Payments\Model;

class ExternalPayment extends \Magento\Framework\Model\AbstractModel
{
	protected function _construct()
	{
		$this->_init('Komoju\Payments\Model\ResourceModel\ExternalPayment');
    }
    
    public function createExternalPayment($order) {
        $orderId = $order->getEntityId();
        $externalPaymentId = uniqid($orderId . '-');

        $data = array('sales_order_id' => $orderId, 'external_payment_id' => $externalPaymentId);
        $this->setData($data);
        $this->save();

        return $this;
    }
}