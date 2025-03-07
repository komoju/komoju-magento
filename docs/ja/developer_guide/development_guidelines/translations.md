# 翻訳について

## テキストを翻訳可能にするために

言語辞書はコードベース内のテキストから自動生成されますが、特定のルールに従った場合のみ有効になります。このプラグインを簡単に多言語化できるようにするため、以下の推奨事項を遵守してください。

### バックエンド (PHP)

PHPの文字列は、Phrase関数（`__()`、二重アンダースコア）で囲むことで辞書に取り込まれます。文字列にはプレースホルダーを使用して引数を渡すことができます。

コードの例はこちらで確認できます：[例](https://github.com/komoju/komoju-magento/blob/2087840774341cdd6aad441c4bebbe82b5133aa5/src/app/code/Komoju/Payments/Plugin/WebhookEventProcessor.php#L53)

詳細は [Magentoの翻訳ガイドライン](https://devdocs.magento.com/guides/v2.3/config-guide/cli/config-cli-subcommands-i18n.html#config-cli-subcommands-xlate-dict-trans) をご参照ください。

### フロントエンド (KnockoutJs)

Magentoのフロントエンドは、データバインディングとJSを使ったHTML生成のために[KnockoutJs](https://knockoutjs.com/)を使用しています。KnockoutJSはHTMLコメントを用いてデータを挿入しますが、言語辞書を生成する際には、i18nプロパティが設定された`ko`コメントが取り込まれます。

コードの例はこちらで確認できます：[例](https://github.com/komoju/komoju-magento/blob/2087840774341cdd6aad441c4bebbe82b5133aa5/src/app/code/Komoju/Payments/view/frontend/web/template/payment/form.html#L31)

## 言語辞書の生成

複数の言語でプラグインを動作させるために、プロジェクトのルートディレクトリで以下のコマンドを実行し辞書を生成します（Dockerコンテナが起動中である必要があります）：

```bash
$ bin/generate-translations
```

このコマンドを実行すると、プロジェクト内の`i18n/en_US.csv`ファイルが更新されます。このファイルを別の言語用にコピーして適切な翻訳を追加してください。

## Magentoの表示言語を変更する

プラグインをテストする際、ユーザーが目にするテキストがサポートする言語に正しく翻訳されるかを確認することが重要です。そのため、顧客向けと管理者向けに分けて言語設定を変更する方法を以下に示します。

### ストアビューを他の言語に変更する

1. 管理画面で左メニューの「Stores」をクリックし、サブメニューの「Configuration」をクリックします。
2. 中央のパネルで「Locale Options」を展開します。
3. 「Locale」項目を目的の言語に変更します（例えば、日本語の場合は「Japanese (Japan)」）。
4. プロジェクトのルートディレクトリで`bin/magento cache:flush`を実行し、キャッシュをクリアします。

**注意:** Magentoのデフォルトには言語パックが含まれていないため、プラグインがサポートしている範囲でのみ言語が変更されます。

詳細は[こちらの記事](https://magefan.com/blog/installation-and-enabling-magento-2-language-packs)をご覧ください。

### 管理画面の言語を変更する

1. 管理画面の右上にある管理者のアバターをクリックします。
2. ドロップダウンメニューから「Account Setting (USERNAME)」を選択します。
3. アカウント設定ページで、インターフェースのロケールを希望する言語に変更します（例えば、日本語は「日本語 (日本) / Japanese (Japan)」）。
4. パスワードを入力して設定を保存します。

**注意:** Magentoのデフォルトには言語パックが含まれていないため、プラグインがサポートしている範囲でのみ言語が変更されます。

詳細は[こちらの記事](https://magefan.com/blog/how-to-change-language-of-magneto-2-admin-panel)をご覧ください。
