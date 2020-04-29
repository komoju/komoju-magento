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
            code: 'komoju-payments',
        },
        // add required logic here

        initialize: function () {
            var self = this;

            this._super();
            
            
            console.log('hey hey hey')
        }
    });
});
