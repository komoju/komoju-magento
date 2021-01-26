define(
    [
        "jquery",
        "Magento_Checkout/js/view/payment/default",
        "Magento_Checkout/js/model/full-screen-loader",
        "Magento_Checkout/js/action/select-payment-method",
        "Magento_Checkout/js/checkout-data",
        "ko",
        "Magento_Ui/js/model/messageList",
        "mage/translate"
    ],
    function (
        $,
        Component,
        fullScreenLoader,
        selectPaymentMethodAction,
        checkoutData,
        ko,
        messageList,
        $t
    ) {
    "use strict";
    return Component.extend({
        defaults: {
            template: "Komoju_Payments/payment/form",
            active: true,
            redirectAfterPlaceOrder: false,
            komojuMethod: ko.observable('')
        },

        afterPlaceOrder: function() {
            var redirectUrl = this.redirectUrl() + "?payment_method=" + this.komojuMethod();

            fullScreenLoader.startLoader();
            $.mage.redirect(
                redirectUrl
            );
        },

        getData: function() {
          return {
              'method': this.getCode(),
              'additional_data': null
          };
        },

        selectPaymentMethod: function () {
            this.moveBillingForm();
            selectPaymentMethodAction(this.getData());
            checkoutData.setSelectedPaymentMethod(this.getCode());
            return true;
        },

        moveBillingForm: function () {
            var billingForm = document.querySelector('.komoju_payment_billing');
            var currentNode = document.querySelector(`#${this.komojuMethod()}-node`);
            currentNode.appendChild(billingForm);
        },

        getConfig: function() {
            var code = this.getCode();

            return window.checkoutConfig.payment[code];
        },

        getAvailablePaymentMethods: function() {
            var config = this.getConfig();

            return config.available_payment_methods;
        },

        redirectUrl: function () {
            var config = this.getConfig();

            return config.redirect_url;
        },

        getTitle() {
            var config = this.getConfig();

            return config.title;
        },

        showTitle() {
            var config = this.getConfig();

            return config.show_title;
        },

        getEnabledPaymentTypes: function() {
            var options = [];
            var option;
            var availablePaymentMethods = this.getAvailablePaymentMethods();

            for (option in availablePaymentMethods) {
              if (Object.prototype.hasOwnProperty.call(availablePaymentMethods, option)) {
                  options.push({
                      value: option,
                      displayText: availablePaymentMethods[option],
                  });
              }
            }

            if (options.length === 0) {
              messageList.addErrorMessage({message: $t("Encountered an issue communicating with KOMOJU. Please wait a moment and try again.")});
            }

            return options;
        }
    });
});
