# Magentoのイベントとオブザーバー

## Magentoのイベント概要

Magentoはイベント駆動型のアーキテクチャを採用しており、元のソースコードを変更せずに、コアシステムやサードパーティのコンポーネントの動作を拡張・カスタマイズできるようになっています。このアーキテクチャは、イベントとオブザーバーという概念に基づいています。

- **イベント（Events）**： Magentoのコードベース内の特定のポイントで発生し、アイテムの保存、ページの読み込み、取引の完了など、何かが起きたことをMagentoが通知する仕組みです。
- **オブザーバー（Observers）**： 特定のイベントを監視し、それに応じてコードを実行するカスタムモジュールまたはスクリプトです。これにより、開発者はアプリケーションのライフサイクルにフックして、機能を動的に追加または変更できます。

## Magentoにおけるイベントの仕組み

Magentoでイベントが発生すると、そのイベントを監視するように設定されたすべてのオブザーバーが実行されます。この仕組みはMagentoのイベントディスパッチシステムによって管理されており、イベントとそれに関連するオブザーバーのマッピングを処理します。処理の流れは次のように要約できます。

- **イベントの発生**： Magentoのコアコードやカスタムモジュール内から、`$this->_eventManager->dispatch('event_name', ['data' => $data])` のようなメソッドを呼び出してイベントがトリガーされます。
- **オブザーバーの実行**： イベントがディスパッチされると、Magentoはそのイベントに登録されているオブザーバーを確認し、それらの`execute`メソッドを実行します。この際、イベントに関連するデータを含む`Observer`オブジェクトが渡されます。

## オブザーバーの設定

オブザーバーの設定は、モジュールの`etc`ディレクトリ内にある`events.xml`ファイルで行います。このファイルで、オブザーバーが監視するイベントと、イベント発生時に実行されるロジックを含むクラスを指定します。

`events.xml`の設定例：

```xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Event/etc/events.xsd">
    <event name="controller_action_postdispatch_checkout_index_index">
        <observer name="restore_quote_from_session" instance="Komoju\Payments\Observer\RestoreQuoteFromSession" />
    </event>
</config>
```

## セッションのQuote復元オブザーバー（RestoreQuoteFromSession）

### RestoreQuoteFromSessionとは？

`RestoreQuoteFromSession`オブザーバーは、チェックアウトプロセス中のユーザー体験を向上させるために設計されています。特に、顧客が支払いを完了せず、注文が`pending_payment`（支払い保留）の状態で放置されるケースに対応します。

### この機能の重要性

支払いが未完了の場合にQuote（カート内情報）をセッションに復元することは、以下の理由で非常に重要です。

- **ユーザーの利便性**： 支払いプロセスの途中で離脱した、あるいは何らかのトラブルで完了できなかった場合でも、ユーザーが簡単に元の状態に戻れるようになります。
- **コンバージョン率の向上**： ユーザーがチェックアウトプロセスに簡単に復帰できるため、購入完了の可能性が高まります。
- **ストレスの軽減**： カートに再び商品を追加したり、情報を再入力したりする手間が省けるため、顧客のストレスを減少させます。

```php
public function execute(Observer $observer)
{
	$quote = $this->checkoutSession->getQuote();

	if ($quote) {
		$order = $this->checkoutSession->getLastRealOrder();

		if ($order) {
			$orderStatus = $order->getStatus();

			if ($orderStatus == ORDER::STATE_PENDING_PAYMENT) {
				$this->checkoutSession->restoreQuote();
			}
		}
	}
}
```

解説：
- **状態の確認と処理**： 注文のステータスが`Order::STATE_PENDING_PAYMENT`（支払い保留）の場合のみ、セッションのQuoteを復元します。