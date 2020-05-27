# Komoju Magento Plugin

- link to the support email for any concerns or questions

This plugin allows for Magento store owners to accept payments through Komoju. Currently the plugin supports the following currencies:

- JPY

And the following payment methods:

- Credit Card (クレジットカード)
- Convenience Store (コンビニ)

## Installation instructions

**NOTE:** You will need a [Komoju account](https://komoju.com/) to be able to use the plugin.

### Installing the module manually

1. Download the module from [here](https://github.com/komoju/komoju-woocommerce/archive/master.zip)
2. Upload the folder to your magento server
3. Unzip the folder to the /tmp directory
```
$ unzip komoju-magento-master.zip "komoju-magento-master/src/app/code/*" -d /tmp
```
4. Copy the module code to your `$MAGENTO_INSTALL/app/code` folder, where MAGENTO_INSTALL is the directory where Magento is installed:
```
$ mv /tmp/komoju-magento-master/src/app/code/* $MAGENTO_INSTALL/app/code
```
5. Install the new module with the following commands:
```
$ php bin/magento setup:upgrade
$ php bin/magento setup:di:compile
$ php bin/magento cache:flush
$ php bin/magento setup:static-content:deploy
```

## Configuring the plugin

Once the plugin has been installed you will need to configure it. Go to the store configuration in the admin section and navigate to the payment methods. Here you will be able to configure the Komoju plugin, with your Komoju account details.

### Configuring the Komoju webhook 

To ensure that the WooCommerce plugin works correctly you will need to set up a webhook from your Komoju dashboard to the wordpress instance. To do this you will need to go to your [Webhook page on the Komoju dashboard](https://komoju.com/admin/webhooks) and click "New Webhook". If you don't know what the webhook URL should be you can check the admin page for this plugin on your wordpress instance to see the default address. The secret can be anything you want (as long as you remember it), but you must make sure the following events are ticked:

- payment.authorized
- payment.captured
- payment.expired
- payment.cancelled
- payment.refunded
- payment.refund.created
- payment.failed

In the module config section in Komoju, enter the webhook secret you just created into the "Webhook Secret Token" field.

## Contact Us

If you have any questions or concerns you can contact our support team at  support@degica.com.

## Development

To get started working on this module, check out the [dev setup guide](./docs/dev_setup.md)