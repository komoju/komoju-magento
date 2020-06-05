define(
    [
        "jquery",
        "Magento_Checkout/js/view/payment/default",
        "Magento_Checkout/js/model/full-screen-loader",
    ],
    function (
        $,
        Component,
        fullScreenLoader
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
            var redirectUrl = this.redirectUrl() + "?payment_method=" + this.paymentMethod;

            fullScreenLoader.startLoader();
            $.mage.redirect(
                redirectUrl
            );
        },

        getConfig: function() {
            var code = this.getCode();
            
            return window.checkoutConfig.payment[code];
        },

        getAvailablePaymentMethods: function() {
            var config = this.getConfig();

            return config.available_payment_methods;
        },

        shouldShowCreditCardOption: function() {
            var config = this.getConfig();

            return config.enable_credit_card_payments;
        },

        shouldShowKonbiniOption: function() {
            var config = this.getConfig();

            return config.enable_konbini_payments;
        },

        redirectUrl: function () {
            var config = this.getConfig();

            return config.redirect_url;
        },

        getEnabledPaymentTypes: function() {
            var options = [];
            var option;
            var availablePaymentMethods = this.getAvailablePaymentMethods();
            
            for (option in availablePaymentMethods) {
                if (Object.prototype.hasOwnProperty.call(availablePaymentMethods, option)) {
                    options.push({
                        value: option,
                        displayText: availablePaymentMethods[option]
                    });
                }
                
            }
            
            return options;
        }
    });
});
