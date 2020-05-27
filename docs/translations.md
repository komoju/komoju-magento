# Translations

## Making sure text can be translated

The language dictionaries are automatically from text in the codebase, but only if they follow certain conventions. To make it as easy as possible to provide this plugin in multiple languages, follow these recommendations:

### Backend (PHP)

Any PHP string that is wrapped in a Phrase function (__(), double underscore) will be picked up and added to the generated dictionary. Arguments can be passed into the string using placeholders. An example in the code can be found [here](https://github.com/komoju/komoju-magento/blob/2087840774341cdd6aad441c4bebbe82b5133aa5/src/app/code/Komoju/Payments/Plugin/WebhookEventProcessor.php#L53)

[Magento article on translation guidelines](https://devdocs.magento.com/guides/v2.3/config-guide/cli/config-cli-subcommands-i18n.html#config-cli-subcommands-xlate-dict-trans)

### Frontend (KnockoutJs)

The Magento frontend uses [KnockoutJs]() to create data bindings and use JS to insert values into the generated HTML. KnockoutJS uses HTML comments to insert data, and any ko comment with the i18n property set will be picked up when generating the language dictionary. An example in the code can be found [here](https://github.com/komoju/komoju-magento/blob/2087840774341cdd6aad441c4bebbe82b5133aa5/src/app/code/Komoju/Payments/view/frontend/web/template/payment/form.html#L31)

## Generating the language dictionary

To generate dictionaries to allow the plugin to work for multiple languages run the following command at the root level of the project. You will need to have the docker containers running:

```bash
$ bin/magento i18n:collect-phrases -o /var/www/html/app/code/Komoju/Payments/i18n/en_US.csv app/code/Komoju/Payments/
```

This command will update the i18n/en_US.csv file in the project. This file can be copied to additional languages and updated with the correct translations.

## Switching magento to other languages

When testing to the plugin it's important to ensure that the user facing text correctly translates into the supported languages. To do this we need to follow two separate processes for the customer and the store admins.

### Switch the store view to a separate language

1. To change the store language, go the admin page and click on "Stores" in the left menu, and then click on "Configuration" in the submenu.
2. In the centre panel expand the option called "Locale Options"
3. Switch the Locale field to the desired language (eg for Japanese it would be  "Japanese (Japan)")
4. Flush the cache by running `bin/magento cache:flush` in the root directory of the project

**NOTE:** This may not change the language used for the other parts of the store as the other language packs are not packaged by default with Magento, but it will use that language for the plugin if it supports it.

Based off of the information from this article: https://magefan.com/blog/installation-and-enabling-magento-2-language-packs

### Switch the admin view to a separate language

1. To change the store language, go the admin page and click on the admin avatar in the top right corner.
2. Select "Account Setting (USERNAME)" from the dropdown
3. On the account settings page, switch the interface locale to be the desired language (for example, "日本語 (日本) / Japanese (Japan)" for Japanese).
4. Enter your password and save.

**NOTE:** This may not change the language used for the other parts of the admin page as the other language packs are not packaged by default with Magento, but it will use that language for the plugin if it supports it.

Based off of information from this article: https://magefan.com/blog/how-to-change-language-of-magneto-2-admin-panel
