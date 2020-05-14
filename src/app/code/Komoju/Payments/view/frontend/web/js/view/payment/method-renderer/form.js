define(
    [
        "jquery",
        "Magento_Checkout/js/view/payment/default"
    ],
    function (
        $,
        Component
    ) {
    "use strict";
    return Component.extend({
        defaults: {
            template: "Komoju_Payments/payment/form",
            active: true,
            paymentMethod: '',
            redirectAfterPlaceOrder: false,
        },

        afterPlaceOrder: function() {
            $.mage.redirect(
                `${this.redirectUrl()}?payment_method=${this.paymentMethod}`
            );
        },

        getConfig: function() {
            let code = this.getCode();
            
            return window.checkoutConfig.payment[code];
        },

        getAvailablePaymentMethods: function() {
            let config = this.getConfig();
            return config.available_payment_methods;
        },

        shouldShowCreditCardOption: function() {
            let config = this.getConfig();
            return config.enable_credit_card_payments;
        },

        shouldShowKonbiniOption: function() {
            let config = this.getConfig();
            return config.enable_konbini_payments;
        },

        redirectUrl: function () {
            let config = this.getConfig();
            return config.redirect_url;
        },

        getEnabledPaymentTypes: function() {
            let options = [];

            const availablePaymentMethods = this.getAvailablePaymentMethods();
            
            for (let option in availablePaymentMethods) {
                options.push({
                    value: option,
                    displayText: availablePaymentMethods[option]
                });
            }

            return options;
        }
    });
});
