# J Foreign Language Online Academy

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

> **語学学院の会員登録、受講申請、承認、問い合わせ、Excel出力を一つの業務フローとしてつないだフルスタック・ポートフォリオです。**

受講生は会員登録後に科目とクラスを申請し、管理者は承認状態、受講生一覧、問い合わせ一覧を管理してExcelで出力できます。紹介ページではなく、役割別の権限と実際のデータフローを持つ運用サービスを目標にしました。

## 解決する業務課題

| 課題 | 実装 |
| --- | --- |
| 申請情報が分散する | 受講生の申請を管理者の承認画面へ連携 |
| 名簿を手作業で整理する | 検索、20件単位のページネーション、Excel出力 |
| 申請状態が不明確 | 申請中・承認済み状態と案内画面 |
| 権限のない利用 | JWTとサーバー側の役割チェック |
| 運用通知の見落とし | バックグラウンドのメール通知 |

## 主な機能

- **アカウント**：入力検証、ID・電話番号の重複制限、JWTログイン、ID検索、パスワード変更
- **受講申請**：英語・スペイン語・日本語・中国語の科目・クラス申請と状態確認
- **管理者機能**：受講生検索、20件単位の一覧、申請状態の一括変更、Excel出力
- **相談UI**：承認済み科目・クラスの選択を相談フローに反映
- **モバイルUX**：タッチメニュー、横スクロール可能な管理表、行動につながるエラー案内

## アーキテクチャ

```text
Next.js / React UI
  └─ fetch + Bearer JWT → FastAPI
       ├─ Pydanticによる検証 / 役割認可
       ├─ SQLAlchemy Core → PostgreSQL
       ├─ BackgroundTasks → SMTP通知
       └─ pandas + openpyxl → Excel出力
```

## エンジニアリング上のポイント

| 分野 | 実装 |
| --- | --- |
| 認証・認可 | 保護APIでBearerトークンと役割をサーバー側で検証 |
| データ整合性 | SQL `UNIQUE`・`CHECK`・外部キーとAPIの409処理 |
| 一覧処理 | `LIMIT 20`・`OFFSET`・全件数とクライアントのページ移動を連携 |
| エラー処理 | 401・403・422・409を利用者向けの案内に変換 |
| 運用支援 | 画面の行番号とExcelの連続番号を用途に応じて分離 |
| 外部接続 | モバイル・外部ネットワークからCORS、ポート、応答形式を確認 |

## 技術スタック

| 分野 | 技術 |
| --- | --- |
| Frontend | Next.js 16.3、React 19.2、TypeScript 5、Tailwind CSS 4、PostCSS、Framer Motion、Lucide React、ESLint 9 |
| Backend | Python、FastAPI、Uvicorn、Pydantic、SQLAlchemy Core、python-dotenv |
| Data | PostgreSQL、psycopg2-binary、SQL `UNIQUE`・`CHECK`・外部キー |
| Security | PyJWT、HTTP Bearer、pwdlib、SessionMiddleware / itsdangerous、CORSMiddleware |
| Automation | pandas、openpyxl、FastAPI BackgroundTasks、SMTP SSL、Python email MIME |
| Environment | `.env.example`、`.gitignore`、Linux CLI `free -h` |

OpenAI Python SDKは相談AI連携のために準備しています。現在の回答は外部モデルを呼び出さない固定案内です。Make Webhooksとngrokは学習と一時的な外部接続テストに使ったもので、実行時の連携ではありません。

## 確認シナリオ

1. 重複ID・重複電話番号・不正入力に対する会員登録検証
2. 受講生・管理者の役割ごとの保護APIアクセス
3. 受講申請 → 管理者承認 → 受講生情報への反映
4. 検索、20件単位のページ移動、Excel生成
5. モバイルのメニュー、フォーム、管理表の動作

## ローカル実行

秘密情報は含めていません。

```text
backend/config/.env.example  → backend/config/.env
frontend/.env.example        → frontend/.env.local
```

```bash
# backend
py -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# frontend
npm run dev
```

## デプロイ環境変数

ファイルをコミットせず、配備プラットフォームの環境変数画面で次の値を設定します。実際のDBパスワード、SMTPアプリパスワード、APIキーはリポジトリに含めません。

```env
# Frontend
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.example.com

# Backend
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=
FRONTEND_ORIGINS=https://your-frontend-domain.example.com
SESSION_SECRET=
ADMIN_NAME=정지윤
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
ADMIN_AGE=
SMTP_ENABLED=false
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
OPENAI_API_KEY=
```

メール通知を有効にする場合は、Gmailのアプリパスワードを `SMTP_PASSWORD` に設定し、`SMTP_ENABLED=true` に変更します。現在、Webhookの送受信機能は実装していないため、`WEBHOOK_URL` は不要です。

## 今後の改善

- 使い捨て・有効期限付きのパスワード再設定トークン
- 失敗・費用処理を含む生成AI相談
- 本番フロントエンドのオリジンだけを許可するCORS
- 認証・受講申請の主要フローの自動テスト

---

個人学習・ポートフォリオプロジェクト · 企画・開発：정지윤


