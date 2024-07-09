# KOMOJU Magento Plugin

This plugin allows for Magento store owners to accept payments with [Komoju payment methods](https://en.komoju.com/payment-methods). Currently, the plugin supports the following currency:

- JPY

## Installation instructions

**NOTE:** A [KOMOJU account](https://komoju.com/) is required to use this plugin.

### Installing the module manually

1. Download the latest version of the module from the [release page](https://github.com/degica/komoju-magento/releases)
2. Upload the downloaded file to your Magento server.
3. Unzip the file directly into your $MAGENTO_INSTALL/app/code directory, where $MAGENTO_INSTALL is the directory where Magento is installed:

```shell
$ unzip komoju-magento-release.zip -d $MAGENTO_INSTALL/src/app/code
```

4. Install the new module with the following commands:
```shell
$ php bin/magento setup:upgrade
$ php bin/magento setup:di:compile
$ php bin/magento cache:flush
$ php bin/magento setup:static-content:deploy
```

## Configuring the plugin

After installation, configure the plugin in the store configuration under the admin section by navigating to the payment methods. Enter your KOMOJU account details as found on the [KOMOJU merchant settings page](https://komoju.com/admin/merchant_settings):

![KOMOJU dashboard](./docs/screenshots/komoju_magento_setting.jpg "KOMOJU dashboard")

When configuring the "API Settings" section of the plugin use the following values:

Go to Stores > Sales > Payment Methods > Komoju > API Settings and fill out below

Merchant UUID: Your UUID
Secret Key: Secret Key
Publishable Key: Publishable Key
Webhook Secret: **Wil Explain below**

![Magento Configuration](./docs/screenshots/magento_configuration.jpg "KOMOJU dashboard")

### Configuring the KOMOJU Webhook

For proper functioning, set up a webhook from your KOMOJU dashboard to your Magento instance by visiting [Webhook page on the KOMOJU dashboard](https://komoju.com/admin/webhooks) and clicking "New Webhook". Use /komoju/hostedpage/webhook as your Webhook URL.

![KOMOJU Create New Webhook](./docs/screenshots/komoju_webhook_01.jpg "Create a new Webhook")

For example, if your Magento URL is https://magento.komoju.com, then your Webhook URL would be https://magento.komoju.com/komoju/hostedpage/webhook.

![KOMOJU Create New Webhook](./docs/screenshots/komoju_webhook_02.jpg "Set URL")

And don't forget to choose a secret and ensure the following events are selected:

- payment.authorized
- payment.captured
- payment.expired
- payment.cancelled
- payment.refunded
- payment.refund.created

![KOMOJU Create Webhook Webhook](./docs/screenshots/komoju_webhook_03.jpg "Set Events")

After configuring, click "Create Webhook" to save your settings.

Back in your Magento plugin configuration, enter the webhook secret you created into the "Webhook Secret Token" field.

## Contact Us

For questions or concerns, contact our support team at support@degica.com.
