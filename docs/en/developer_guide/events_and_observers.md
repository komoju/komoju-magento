# Magento Events and Observers

## Introduction to Magento Events

Magento utilizes an event-driven architecture to allow for extending and customizing the behavior of the core system and third-party components without modifying the original source code. This architecture revolves around the concept of events and observers:

- Events: These are specific points in the Magento codebase where Magento announces that something has occurred, such as saving an item, loading a page, or completing a transaction.
- Observers: These are custom modules or scripts that 'listen' for specific events and execute code in response to them. This allows developers to hook into the application lifecycle to add or modify functionality dynamically.

## How Events Work in Magento

When an event is triggered in Magento, any observers that are configured to listen to that event are executed. This mechanism is managed by Magento's event dispatch system, which handles the mapping of events to their respective observers. The process can be summarized as follows:

- Event Triggering: An event is triggered by calling a method like $this->_eventManager->dispatch('event_name', ['data' => $data]) from within Magento's core code or a custom module.
- Observer Execution: Once an event is dispatched, Magento checks for observers registered for that event and executes their execute method, passing an Observer object that contains any relevant data about the event.

## Configuration of Observers

Observers are configured in a module's events.xml file, which is located in the module's etc directory. The file specifies which events an observer is listening to and the class that contains the logic to be executed when the event is triggered.

Example of an events.xml configuration:

```xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Event/etc/events.xsd">
    <event name="controller_action_postdispatch_checkout_index_index">
        <observer name="restore_quote_from_session" instance="Komoju\Payments\Observer\RestoreQuoteFromSession" />
    </event>
</config>
```

## Restore Quote Session Observer
### What is the Restore Quote Session?

The `RestoreQuoteFromSession` observer is designed to enhance the user experience during the checkout process. It specifically addresses scenarios where a customer may not complete their payment, leaving their order in a pending_payment state.

### Why This Functionality Is Important

Restoring a quote to the session in cases where the payment was not completed is crucial for the following reasons:

- User Convenience: It provides a seamless experience for users who may have navigated away from the checkout page or experienced an interruption during the payment process.
- Increased Conversion Rates: By allowing users to easily return to their last state in the checkout process, it potentially increases the likelihood of completing the sale.
- Reduced Frustration: Minimizes customer frustration by eliminating the need to re-add products to the cart and re-enter information.

```php
public function execute(Observer $observer)
{
	$quote = $this->checkoutSession->getQuote();

	if ($quote) {
		$order = $this->checkoutSession->getLastRealOrder();

		if ($order) {
			$orderStatus = $order->getStatus();

			if ($orderStatus == ORDER::STATE_PENDING_PAYMENT) {
				$this->checkoutSession->restoreQuote();
			}
		}
	}
}
```
Explanation:
- State Check and Action: Only if the order's status matches Order::STATE_PENDING_PAYMENT then perform the action to restore the quote.