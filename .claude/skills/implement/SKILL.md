---
name: implement
description: Issue の内容を確認して実装を行い、コードレビューを経て PR を作成する。
argument-hint: <issue-number>
---

# Issue 実装

Issue 番号: $ARGUMENTS

## 事前準備

### ドキュメントの確認

以下のドキュメントを必ず確認し、ルールに従って実装を行う:

- `docs/development.md` — 開発ルール、コミットメッセージ形式、ブランチ命名規則
- `docs/tsdoc.md` — TSDoc 記載方針
- `CLAUDE.md` — プロジェクト全体のガイダンス

## 実装フロー

### 1. Issue の内容を確認

```bash
gh issue view $ARGUMENTS
```

Issue から以下を把握する:
- 目的と背景
- 要件と仕様
- 受け入れ条件

### 2. ブランチの作成

docs/development.md のブランチ命名規則に従う:

```bash
git checkout -b <prefix>/<変更内容をケバブケースで>
```

| prefix | 用途 |
|---|---|
| `feature/` | 新機能の追加 |
| `fix/` | バグの修正 |
| `chore/` | ドキュメント・リファクタ・CI・依存更新など |

### 3. TDD で実装

docs/development.md の開発フローに従い、TDD で進める:

1. **テストを先に書く**: Issue の仕様からテストケースを作成
2. **テストが失敗することを確認**: Red 状態
3. **実装を行う**: テストが通る最小限のコード
4. **テストが成功することを確認**: Green 状態
5. **リファクタリング**: コード品質を改善

### 4. コードレビューの実施

実装が完了したら、codex-code-reviewer エージェントを使用してコードレビューを受ける。

Task ツールで codex-code-reviewer を起動し、変更したファイルのレビューを依頼する。

### 5. レビュー指摘の修正

codex-code-reviewer からのフィードバックを確認し、以下を行う:

- 指摘された問題点を修正
- 提案された改善を検討・適用
- テストが引き続き通ることを確認

### 6. レビューサイクルの繰り返し

指摘がなくなるまで、手順 4-5 を繰り返す:

1. codex-code-reviewer でレビュー実行
2. 指摘があれば修正
3. 指摘がなくなるまで繰り返す

### 7. コミット

docs/development.md のコミットメッセージ形式に従う:

```
<prefix>: <要約>

<本文（任意）>
```

### 8. PR の作成

docs/development.md の PR ルールに従い、gh コマンドで PR を作成:

```bash
gh pr create --title "<prefix>: <要約>" --body "$(cat <<'EOF'
## 概要

変更内容の説明

## 関連 Issue

closes #$ARGUMENTS

## テスト方法

テスト手順の説明

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## チェックリスト

実装完了時に以下を確認:

- [ ] テストがすべて通る (`npm test`)
- [ ] ビルドが成功する (`npm run build`)
- [ ] コードレビューの指摘をすべて対応済み
- [ ] コミットメッセージが規約に従っている
- [ ] PR のタイトル・本文が規約に従っている
- [ ] TSDoc が公開 API に記載されている（該当する場合）

## 注意事項

- 実装中に仕様の不明点があれば、Issue にコメントで確認を求める
- 既存のコードパターンに従う
- 過度な抽象化や先回りした機能追加を避ける
- セキュリティ上の問題（インジェクション等）に注意する
