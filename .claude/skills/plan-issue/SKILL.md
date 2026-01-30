---
name: plan-issue
description: Issue の詳細設計を行い、設計内容を Issue にコメントする。規模が大きい場合は Sub-issue に分割する。
argument-hint: <issue-number>
---

# Issue 詳細設計

Issue 番号: $ARGUMENTS

## 手順

### 1. Issue の内容を取得

```bash
gh issue view $ARGUMENTS
```

### 2. 関連情報の収集

- CLAUDE.md および参照先ドキュメント（README.md, docs/development.md など）を確認する
- Issue に関連するコードベースを調査する
- 既存の実装パターンや規約を把握する

### 3. 詳細設計の作成

以下の観点で詳細設計を行う:

#### 設計項目

- **目的**: Issue が解決しようとしている問題
- **スコープ**: 変更対象のファイル・モジュール
- **API 設計**: 関数シグネチャ、型定義（該当する場合）
- **実装方針**: 具体的な実装アプローチ
- **テスト計画**: TDD に基づくテストケース
- **影響範囲**: 既存コードへの影響

### 4. 規模の判断

設計内容を評価し、以下を判断する:

- 1 つの PR で対応可能な規模か
- 複数の独立したタスクに分割すべきか

#### 分割が必要な場合の基準

- 変更ファイル数が多い（目安: 5 ファイル以上）
- 独立してテスト・レビュー可能な単位がある
- 依存関係のある複数のステップがある

### 5. 結果の出力

#### 規模が適切な場合

詳細設計を Markdown 形式で該当 Issue にコメントする:

```bash
gh issue comment $ARGUMENTS --body "$(cat <<'EOF'
## 詳細設計

### 目的
...

### スコープ
...

### API 設計
...

### 実装方針
...

### テスト計画
...

### 影響範囲
...
EOF
)"
```

#### 規模が大きい場合

Sub-issue を作成して Issue に紐付ける:

```bash
# Sub-issue を作成
gh issue create --title "タスク名" --body "概要" --label "sub-issue"

# 親 Issue に Sub-issue を追加（GraphQL を使用）
gh api graphql -f query='
  mutation($issueId: ID!, $subIssueId: ID!) {
    addSubIssue(input: {issueId: $issueId, subIssueId: $subIssueId}) {
      issue {
        id
      }
    }
  }
' -f issueId="<親IssueのNodeID>" -f subIssueId="<SubIssueのNodeID>"
```

Issue の Node ID は以下で取得:

```bash
gh issue view $ARGUMENTS --json id -q '.id'
```

親 Issue には分割の概要をコメントする:

```bash
gh issue comment $ARGUMENTS --body "$(cat <<'EOF'
## 設計概要

この Issue は規模が大きいため、以下の Sub-issue に分割しました:

- #XX: タスク1の概要
- #YY: タスク2の概要
...

### 依存関係
...
EOF
)"
```

## 注意事項

- 詳細設計は docs/development.md の開発フローに従う
- TDD アプローチを前提とする
- 不明点があれば Issue にコメントで確認を求める
- Sub-issue を作成する場合、各タスクが独立してマージ可能であることを確認する
