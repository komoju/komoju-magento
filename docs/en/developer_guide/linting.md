# Linting

For the Magento plugin to be available on the Magento store, we need to adhere to [Magento's coding standards](https://devdocs.magento.com/guides/v2.3/coding-standards/bk-coding-standards.html) for PHP and JavaScript. To make this easier for developers working on this project, we've added some commands to the project to make checking and fix linting problems easier.

## Before running these steps

Make sure that the docker dev environment is already running. It can be started with:

```bash
bin/start
```

## Checking for Linting problems
To check for any linting problems run the following command from the root of the project:

```bash
bin/lint-check
```

## Autofixing Linting problems
Some linters have the option to automatically fix the certain problems. To try this run the following command from the root of the project:

**Note:** It's a good idea to commit any changes you want to keep before running this command, in case the linter changes the code in a way you don't want and you need to revert.

```bash
bin/lint-autofix
```
