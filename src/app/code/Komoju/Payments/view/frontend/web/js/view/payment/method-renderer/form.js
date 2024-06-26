define(
    [
        "jquery",
        "Magento_Checkout/js/view/payment/default",
        "Magento_Checkout/js/model/full-screen-loader",
        "Magento_Checkout/js/action/select-payment-method",
        "Magento_Checkout/js/checkout-data",
        "ko",
        "Magento_Ui/js/model/messageList",
        "mage/translate",
        "mage/url"
    ],
    function (
        $,
        Component,
        fullScreenLoader,
        selectPaymentMethodAction,
        checkoutData,
        ko,
        messageList,
        $t,
        url
    ) {
    ko.bindingHandlers.safeJsonAttribute = {
        update: function(element, valueAccessor) {
            var data = ko.unwrap(valueAccessor());
            var jsonString = JSON.stringify(data);

            console.log('##JSON: ' + jsonString);

            element.setAttribute('session', jsonString);
        }
    };

    "use strict";
    return Component.extend({
        defaults: {
            template: "Komoju_Payments/payment/form",
            active: true,
            redirectAfterPlaceOrder: false,
            komojuMethod: ko.observable(''),
            komojuSession: ko.observable(''),
            isDataLoaded: ko.observable(false)
        },

        initialize: function () {
            this._super();
            this.loadKomojuData();
        },

        loadKomojuData: function () {
            const self = this;
            self.isDataLoaded(false);

            $.get(url.build('komoju/komojufield/komojusessiondata'))
            .done(function (response) {
                // const komojuHost = document.querySelector('komoju-host');
                // console.log('##KOMOJU HOST: ' + komojuHost);

                // if (komojuHost) {
                //     console.log('##Setting SESSION: ' + JSON.stringify(this.komojuSession()));
                //     const sessionData = JSON.stringify(this.komojuSession());
                //     komojuHost.setAttribute('session', sessionData);
                // }
                // console.log('##RESPONSE: ' + response);

                self.komojuSession(response.komojuSession);
                self.isDataLoaded(true);
            });
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
            var currentNode = document.querySelector('#' + this.komojuMethod() + '-node');

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

        getTitle: function () {
            var config = this.getConfig();

            return config.title;
        },

        getSession: function () {
            return JSON.stringify(this.komojuSession());
        },

        showTitle: function () {
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
              messageList.addErrorMessage(
                {message: $t("Encountered an issue communicating with KOMOJU. Please wait a moment and try again.")}
              );
            }

            return options;
        }
    });
});
