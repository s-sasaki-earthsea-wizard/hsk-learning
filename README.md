# Hanzi Step

日本語話者がHSK 1〜3の語彙・定型表現・簡単な会話を学ぶための5択クイズアプリ。簡体字、繁体字、拼音を常に見比べられ、中国語音声はgTTSで生成する。HSK学習を補完する別ジャンルとして、VRChatの語学交流ワールドで使える日常会話モードも収録している。

## 収録内容

- 旧HSK（HSK 2.0）の公式語彙：HSK 1は150語、HSK 2は累計300語、HSK 3は累計600語
- 各級の語彙を使った頻出定型表現：HSK 1・2は各18件、HSK 3は20件
- 各級10件のレベル別ミニ会話
- ホーム画面からのHSKレベル切替
- 日本語→中国語と中国語→日本語を均等に混ぜた5択問題
- 回答直後の正誤フィードバックとセッション終了後の復習一覧
- gTTSによる中国語音声。生成したMP3はローカルにキャッシュ
- 学習回数、回答数、正答率、挑戦済み項目を級別にブラウザへ保存
- `YOUR PATH`から切り替えられる、HSKとは独立したVRChat中国語会話モード
- 初対面、リアクション、聞き返し、VRChat固有表現、スラングの26フレーズ
- 表現の距離感表示、用法メモ、音声再生、3つの場面別会話例
- スマートフォン対応、キーボードの数字キーによる回答対応

HSKの級別語彙は複数の制度が併存している。このアプリでは、HSK 1〜3を150・300・600語で扱う旧HSK（HSK 2.0）体系を採用している。HSK 2と3の単語モードには下位級の語彙も含まれる。

## VRChat中国語会話モード

ホーム画面の`YOUR PATH`にある`VRChat 会話`から開く。HSKの出題範囲や学習履歴とは分離されており、試験対策では扱いにくい日常的な言い方を補完的に学べる。

- `初対面OK`、`フランク`、`相手を選ぶ`の3段階で表現の距離感を表示
- 簡体字、繁体字、拼音、日本語訳、用法メモを併記
- `#/vrchat`で直接アクセス可能
- 発音ボタンはHSKモードと同じ音声APIとブラウザ音声合成を利用

## 技術構成

- React 18 / TypeScript / Vite
- Flask / gTTS
- Vitest / pytest

## セットアップ

Node.js 18以降とPython 3.10以降が必要。

```bash
make install
```

## 開発

2つのターミナルでフロントエンドと音声APIを起動する。

```bash
make dev-api
```

```bash
make dev-web
```

ViteのURL（通常は `http://localhost:5173`）をブラウザで開く。Viteは `/api` をFlaskの `http://127.0.0.1:5001` へ転送する。

## 本番相当で起動

```bash
make run
```

`http://127.0.0.1:5001` を開く。初回の音声生成にはインターネット接続が必要で、生成後の同じ音声は `.audio-cache/` から再利用される。

## GitHub Pagesへ公開

このリポジトリはViteでビルドした `dist/` をGitHub Pagesへデプロイする。GitHubのリポジトリ設定で Settings → Pages → Build and deployment → Source を `GitHub Actions` にしてから、`main` へpushする。Actionsでは `GITHUB_PAGES=true` を使い、公開URLに合わせて `/hsk-learning/` 配下のアセットを参照する。

GitHub Pagesは静的ホスティングのため、FlaskのgTTS APIは動かない。発音ボタンはブラウザの音声合成へフォールバックする。gTTS音声まで公開する場合は別途サーバーやFunctionsへ配置する。

## テスト

```bash
make test
```

テストではgTTSを偽の実装に差し替えるため、外部通信は発生しない。

## データ出典

- 中国語検定サービス公式「新HSK 1〜4級語彙表」
- 繁体字と拼音の照合：Complete HSK Vocabulary（MIT License）
- VRChat内の機能用語：[VRChat Wiki「ソーシャル」](https://wiki.vrchat.com/wiki/Social/zh-hans)

VRChatモードの例文と日本語訳は本プロジェクトで作成し、ネット用語については用法と距離感を確認したうえで収録している。スラングは時期・地域・コミュニティによって温度差がある。

ライセンス表示は `THIRD_PARTY_NOTICES.md` を参照。
