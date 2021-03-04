# Dev Setup

This document will guide you through setting up your machine to develop the module locally. The development environment is based off of [Mark Shust's docker configuration](https://github.com/markshust/docker-magento)

## Prerequisites

1. Have Docker installed on your local machine
2. Ensure Docker has enough resources to run properly (in the docker settings set the resources to about half for CPU, RAM and Swap)
3. Have access to a [magento marketplace](https://marketplace.magento.com/) account

## Set up magento account

Once you have a magento account, you can create an access key [here](https://marketplace.magento.com/customer/accessKeys/). Once you have the public and private key you need to place them in the `~/.composer/auth.json`:
```
{
  "http-basic": {
    "repo.magento.com": {
      "username": "public key goes here",
      "password": "private key goes here"
    }
  }
}
```

## Set up ngrok

Because Komoju uses webhooks to alert systems to updates to the transactions, the dev environment needs to be publicly accessible on the internet.[Ngrok](https://ngrok.com/) is the easiest solution for this. If possible it's best to pick a static address, so you won't have to manually change the address in Magento each time. Once you have a stable address to run it from start it with the following command:

```bash
$ ~/ngrok http 443 <ngrok endpoint>
```

For example if the site was going to be run from https://degicaexample.au.ngrok.io then the ngrok command would look like:
```
~/ngrok http 443 -region au --subdomain=degicaexample
```

## Run Docker

**NOTE:** You only need to run the following commands once. After everything is set up you can use `bin/start` and `bin/stop` to start and stop the Magent dev environment.

### Building the docker environment

You can create the docker environment with the following command:

```bash
$ docker-compose build --build-arg MAGENTO_VERSION=$MAGENTO_VERSION
# $MAGENTO_VERSION is the version of Magento you wish to use. For example,
# if you wanted to use 2.3.4 then you would run:
# docker-compose build --build-arg MAGENTO_VERSION=2.3.4
```

Once the docker container is built, run the setup command to configure Magento.

```bash
$ bin/setup $NGROK_DOMAIN
```

Where `$NGROK_DOMAIN` is the ngrok endpoint (minus the https:// part) set up in a previous step. Using the example above for https://degicaexample.au.ngrok.io the command would be:

```
$ bin/setup degicaexample.au.ngrok.io
```

Let that run (it can take a while). Once done the magento website will be available on the ngrok endpoint.

## Set up the magento store

To set up the store to be able to test changes to the plugin you will need to have some items for sale as well configuring the plugin to correctly communicate with Komoju. To do this you will first need to log into the admin page.

### Logging into the admin page

Every time you create the development environment the admin url will be slightly different. To find out what the URL is for your instance you can run the following command:

```bash
$ bin/magento info:adminuri

Admin URI: /admin_1y2j6j
```

Going to this page you will be prompted for admin credentials, which you can find in [the setup script](../bin/setup:51) (look for the `--admin-user` and `admin-password` flags, these are the credentials needed).

### Adding items to the store

Once inside the admin page, click the "Catalog" option on the left menu and then click the "Add Product" button. Fill in the required fields as well as:

- Categories: Make sure the item has at least one category
- Quantity: Set to a large enough number you won't run out during testing (eg, 1000)
- Stock Status: Set to "In Stock"

## Configure the plugin

1. To Configure the plugin, go the admin page and click on "Stores" in the left menu, and then click on "Configuration" in the submenu.
2. Once on the Configuration page, there should be a "General" menu on the left, next to the main admin menu. Scroll down to the "Sales" section, expand it and click on "Payment Methods"
3. Click "Configure" next to Komoju to configure the plugin.
4. Update with the relevant Komoju account details

## Lint
You can run `bin/lint-check` to show linting errors (PHP Codesniffer using Magento standards) and JS linting errors.
`bin/lint-autofix` can also be used to autocorrect some mistakes.
