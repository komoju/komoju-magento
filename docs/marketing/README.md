# Marketing Material

To submit our extension to the Magento Marketplace we need to have a collection of Marketing Material. This directory contains all the marketing material supplied to Magento.

Note: The project README will be converted into a PDF and submitted as the installation guide

## Creating the zip package

When uploading a new version of the extension to the Magento store, you will need to package up the code in a zip file. The zip file needs to be packaged up from `src/app/code/Komoju/Payments/` for it to be considered valid:
```bash
$ cd src/app/code/Komoju/Payments
$ zip -r komoju_payments-$VERSION.zip .
```

`$VERSION` should be the version specified in the [`composer.json`](../../src/app/code/Komoju/Payments/composer.json) file.