define(
    [
        "Magento_Checkout/js/view/payment/default"
    ],
    function (
        Component
    ) {
    "use strict";
    return Component.extend({
        defaults: {
            template: "Komoju_Payments/payment/komoju_cc_form",
            active: true,
            paymentMethod: ''
        },
        
        // add required logic here
        getEnabledPaymentTypes: function() {
            return [
                { key: 'credit_card', value: "Credit Card"},
                { key: 'konbini', value: "Konbini"}
            ]
        }
    });
});
