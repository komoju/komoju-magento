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
            template: "Komoju_Payments/payment/komoju_cc_form",
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
            
            if (this.shouldShowCreditCardOption()) {
                options.push({
                    key: "credit_card", value: "Credit Card"}
                );
            }

            if (this.shouldShowKonbiniOption()) {
                options.push({
                    key: "konbini", value: "Konbini"
                });
            }

            return options;
        }
    });
});
