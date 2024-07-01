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
                console.log('######## RESPONSE: ' + JSON.stringify(response));

                self.komojuSession(response.komojuSession);
                self.isDataLoaded(true);
            });
        },

        afterPlaceOrder: function() {
            const redirectUrl = this.redirectUrl() + "?payment_method=" + this.komojuMethod();

            fullScreenLoader.startLoader();

            const komojuField = document.querySelector(`komoju-fields[payment-type='credit_card']`);

            if (komojuField && typeof komojuField.submit === 'function') {
                console.log('KomojuField submit');

                komojuField.submit().then(token => {
                    console.log(`Token: ${JSON.stringify(token)}`);

                    if (!token) {
                        console.error('Failed to get token: ', JSON.stringify(redirectUrl));
                        $.mage.redirect(
                            redirectUrl
                        );
                        return;
                    }

                    this.sendToken(token);
                });
            }
            // $.mage.redirect(
            //     redirectUrl
            // );
        },

        getData: function() {
          return {
              'method': this.getCode(),
              'additional_data': null
          };
        },

        placeOrder: function (data, event) {
            if (!this.validate()) {
                return false;
            }

            const boundSuper = this._super.bind(this);

            boundSuper(data, event);

            console.log('##PLACE ORDER validate success');
        },

        sendToken: function (token) {
            var serviceUrl = url.build('komoju/komojufield/processToken');
            console.log('sendToken');

            var data = {
                'id': this.komojuSession().id,
                'token': token
            }

            return $.ajax({
                url: serviceUrl,
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (response) {
                    console.log('Server responded with:', response);
                    console.log('Server responded with:', JSON.stringify(response));

                    if (response.success) {
                        var redirectUrl = url.build('checkout/onepage/success');

                        $.mage.redirect(
                           redirectUrl
                        );
                    } else {
                        messageList.addErrorMessage({ message: response.message });
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Failed to send token:', error);
                }
            });
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
