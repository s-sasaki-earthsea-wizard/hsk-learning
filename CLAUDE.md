# Hanzi Step

## プロジェクト概要

日本語話者向けの中国語学習Webアプリ。HSK 1〜3と、HSK学習を補完するVRChat中国語会話モードを実装済み。

## 実装状況

- HSK 2.0の公式語彙：HSK 1は150語、HSK 2は累計300語、HSK 3は累計600語
- 定型表現：HSK 1・2は各18件、HSK 3は20件。ミニ会話は各級10件
- レベル切替と級別の学習履歴
- 日中・中日の混合5択クイズ
- 簡体字、繁体字、拼音の併記
- YOUR PATHから開くHSK非連動のVRChat中国語会話モード
- VRChat向けのフランクな26フレーズ、距離感表示、3つの場面別会話例
- Flask + gTTSの音声APIとMP3キャッシュ
- React 18 + TypeScript + ViteのレスポンシブUI
- Vitestとpytestによる問題生成・APIテスト

## 技術仕様

- Frontend: React 18, TypeScript, Vite
- Backend: Python 3, Flask, gTTS
- Local storage key: `hanzi-step:stats`（旧HSK 1キーから自動移行）
- VRChat mode URL: `#/vrchat`（学習履歴はHSKモードと分離）
- Audio cache: `.audio-cache/`

## 言語設定

このプロジェクトでは**日本語**での応答を行ってください。コード内のコメント、ログメッセージ、エラーメッセージ、ドキュメンテーション文字列なども日本語で記述してください。

## 開発ルール

### コーディング規約

- Python: PEP 8準拠
- 関数名: snake_case
- クラス名: PascalCase
- 定数: UPPER_SNAKE_CASE
- Docstring: Google Style

## Git運用

- ブランチ戦略: feature/*, fix/*, refactor/*
- コミットメッセージ: 英文を使用、動詞から始める
- PRはmainブランチへ

## 開発ガイドライン

### ドキュメント更新プロセス

機能追加やPhase完了時には、以下のドキュメントを同期更新する：

1. **CLAUDE.md**: プロジェクト全体状況、Phase完了記録、技術仕様
2. **README.md**: ユーザー向け機能概要、実装状況、使用方法
3. **Makefile**: コマンドヘルプテキスト（## コメント）の更新
4. **makefiles/**: コマンドヘルプテキスト（## コメント）の更新

### コミットメッセージ規約

#### コミット粒度

- **1コミット = 1つの主要な変更**: 複数の独立した機能や修正を1つのコミットにまとめない
- **論理的な単位でコミット**: 関連する変更は1つのコミットにまとめる
- **段階的コミット**: 大きな変更は段階的に分割してコミット

#### プレフィックスと絵文字

- ✨ feat: 新機能
- 🐞 fix: バグ修正
- 📚 docs: ドキュメント
- 🎨 style: コードスタイル修正
- 🛠️ refactor: リファクタリング
- ⚡ perf: パフォーマンス改善
- ✅ test: テスト追加・修正
- 🏗️ chore: ビルド・補助ツール
- 🚀 deploy: デプロイ
- 🔒 security: セキュリティ修正
- 📝 update: 更新・改善
- 🗑️ remove: 削除

**重要**: Claude Codeを使用してコミットする場合は、必ず以下の署名を含める：

```text
🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```
