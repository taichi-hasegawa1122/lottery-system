# Vercelデプロイ手順

## セットアップ

1. **Vercelアカウントの作成**
   - [Vercel](https://vercel.com)にアカウントを作成

2. **Vercel CLIのインストール（オプション）**
   ```bash
   npm i -g vercel
   ```

3. **デプロイ方法**

   ### 方法1: Vercel CLIを使用
   ```bash
   cd くじ引き
   vercel
   ```

   ### 方法2: GitHub経由でデプロイ
   1. GitHubリポジトリにプッシュ
   2. Vercelダッシュボードで「New Project」を選択
   3. GitHubリポジトリを選択
   4. デプロイ設定を確認して「Deploy」

   ### 方法3: Vercelダッシュボードから直接アップロード
   1. Vercelダッシュボードで「New Project」を選択
   2. 「Upload」を選択
   3. プロジェクトフォルダをZIPでアップロード

## ファイル構成

```
くじ引き/
├── api/              # サーバーレス関数
│   ├── lottery.js
│   ├── get-results.js
│   ├── delete-member.js
│   └── reset.js
├── index.html        # スタッフ用ページ
├── admin.html        # 管理者ページ
├── logo.png          # ロゴ画像
├── img/              # 幹部陣アイコン
│   ├── 1.png
│   ├── 2.png
│   └── ...
├── vercel.json       # Vercel設定
└── package.json      # Node.js設定
```

## 注意事項

### データの永続化について

現在の実装では、Vercelの`/tmp`ディレクトリにデータを保存していますが、これは**一時的なストレージ**です。サーバーレス関数はステートレスなため、データは永続化されません。

**本番環境で永続的なデータ保存が必要な場合：**

1. **Vercel KV（推奨）**
   - VercelのRedisサービス
   - 無料プランで利用可能

2. **外部データベース**
   - MongoDB Atlas
   - PostgreSQL（Vercel Postgres）
   - Supabase

3. **外部ストレージ**
   - Vercel Blob Storage
   - AWS S3

### 環境変数の設定

必要に応じて、Vercelダッシュボードで環境変数を設定できます。

## トラブルシューティング

### データが保存されない

- `/tmp`ディレクトリは一時的なため、関数実行間でデータが保持されない可能性があります
- 永続的なストレージ（Vercel KVなど）の使用を検討してください

### CORSエラー

- API関数にはCORS設定が含まれています
- 問題が続く場合は、`vercel.json`でCORS設定を追加してください

## サポート

問題が発生した場合は、Vercelのドキュメントを参照してください：
- https://vercel.com/docs

