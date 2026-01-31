# 開発ガイド

## 必要な環境

- Node.js 24 以上
  - ネイティブ TypeScript サポートを使用するため
  - nvm, fnm, asdf, mise 等のバージョンマネージャーを使用している場合、`.nvmrc` により自動で切り替わります

## セットアップ

```bash
git clone https://github.com/model-geek/japanese-holidays.git
cd japanese-holidays
npm install
```

## 開発コマンド

| コマンド | 説明 |
|---|---|
| `npm run build` | TypeScript をコンパイル |
| `npm test` | テストを実行 |
| `npm run clean` | ビルド成果物を削除 |

## TypeScript

- import パスには `.ts` 拡張子を付ける（例: `import { x } from './core.ts'`）
  - `rewriteRelativeImportExtensions` により `tsc` がコンパイル時に `.js` に書き換える
- ランタイム依存ライブラリは追加しない（devDependencies のみ許可）
- ソースファイル・ディレクトリ名はキャメルケースを使用する（例: `holidayDates.ts`, `getHolidayName.ts`）
  - `index.ts` 等の慣習的な名前はそのまま使う
  - 設定ファイル（`tsconfig.json` 等）やメタファイル（`README.md`, `LICENSE` 等）は慣習に従う

## package.json

- `exports` フィールドで `types` は `default` より前に記述する
- `files` フィールドでビルド成果物のみを npm publish 対象にする

## データ設計

- 日付は JST の `YYYY-MM-DD` 形式で扱う
- 単一のエントリポイントから全機能を提供し、Tree shaking で最適化する
- 検索は Map/Set による O(1) ルックアップを使用する

## ビルド方法

```bash
npm run build   # tsc でコンパイル（dist/ に出力）
```

- ビルドツールは `tsc` のみ。バンドラーは使用しない
- 出力形式は ESM のみ（CJS 非対応）
- 出力先は `dist/`

## コミットメッセージ

### 形式

```
<prefix>: <要約>

<本文（任意）>
```

### prefix 一覧

| prefix | 用途 |
|---|---|
| `feat` | 新機能の追加 |
| `fix` | バグの修正 |
| `docs` | ドキュメントの変更 |
| `refactor` | 機能変更を伴わないコードの改善 |
| `test` | テストの追加・修正 |
| `chore` | ビルド設定・CI・依存更新など |

### ルール

- 要約は簡潔に、何を変更したかを書く
- 本文には変更の理由（WHY）を書く。差分を見れば分かる内容（WHAT）だけでは不十分
  - 例: 「Map に変更した」ではなく「線形探索がボトルネックだったため Map に変更した」
- 要約・本文は日本語で書く（prefix は英語のまま使用する）

## ブランチ戦略

GitHub Flow を採用する。

- `main` — 常にリリース可能な状態を維持する
- 作業ごとにブランチを切り、PR で `main` にマージする

### ブランチの命名規則

```
<prefix>/<変更内容をケバブケースで簡潔に>
```

| prefix | 用途 | 例 |
|---|---|---|
| `feature/` | 新機能の追加 | `feature/add-holiday-name-api` |
| `fix/` | バグの修正 | `fix/timezone-handling` |
| `chore/` | ドキュメント・リファクタ・CI・依存更新など | `chore/update-holiday-data` |

### Issue

- Bug Report と Feature Request の 2 種類のテンプレートを使用する
- タイトルは内容を簡潔に書く

### Pull Request

- タイトルはコミットメッセージと同じ形式（`<prefix>: <要約>`）
- 本文にはテンプレートに従い、変更の概要・関連 Issue・テスト方法を記載する
- `main` への直接プッシュは禁止し、PR を必須とする
- マージ方法は Squash merge を使用する
- Issue を閉じる場合は本文に `closes #番号` を記載する

### バージョニング

[Semantic Versioning](https://semver.org/) に従う。

| 変更内容 | バージョン | 例 |
|---|---|---|
| 破壊的変更 | メジャー | `1.0.0` → `2.0.0` |
| 機能追加（後方互換） | マイナー | `1.0.0` → `1.1.0` |
| バグ修正 | パッチ | `1.0.0` → `1.0.1` |

## テスト

- TDD に基づき、実装とセットで作成する
- テストケースは仕様に基づいて記述する（Spec Driven）
- テストファイルは `src/` 内に `.test.ts` の命名規則で配置する
- Node.js 組み込みの `node:test` を使用する

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isHoliday } from './index.ts';

describe('isHoliday', () => {
  it('祝日の場合 true を返す', () => {
    assert.strictEqual(isHoliday('2026-01-01'), true);
  });
});
```

## 開発フロー

AI エージェント（Claude Code 等）の活用を前提としたフロー。

### 1. Issue の作成

- テンプレートに従い Issue を作成する
- 機能の場合: 背景、提案内容、API の入出力例を記載する
- バグの場合: 再現手順、期待する動作、実際の動作を記載する

### 2. 仕様の確定

- Issue 上で仕様を議論し、以下が明確になった状態にする
  - 関数のシグネチャ（引数・戻り値の型）
  - 振る舞いの定義（境界値・エラーケースを含む）
  - 影響範囲（既存 API への影響など）
- 仕様が確定したら Issue にまとめ、実装着手の判断基準とする

### 3. 実装

- Issue の仕様を読み込み、ブランチを作成する
- TDD で進める: 仕様からテストを先に書き、テストが通るよう実装する
- コミットメッセージとブランチ命名は規約に従う

### 4. PR の作成

- テンプレートに従い PR を作成する
- `closes #番号` で関連 Issue を紐付ける
- CI（ビルド・テスト）が通ることを確認する

### 5. レビューとマージ

- レビューで仕様との整合性・コード品質を確認する
- Squash merge で `main` にマージする
- マージ後、ブランチは自動削除される

## リリース

- `main` から直接 npm publish し、Git タグ（`v1.2.0`）を打つ
- 旧メジャーバージョンのメンテナンスブランチは、必要になった時点で検討する
