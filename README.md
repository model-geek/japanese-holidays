# japanese-holidays

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

日本の祝日を扱うための TypeScript ライブラリです。

## 特徴

* **同期的に動作** — 外部 API やデータベースへの通信なしに祝日を判定できます。
* **常に最新** — 内閣府の祝日データが更新されると、新しいバージョンが自動的に公開されます。
* **コンパクト** — 必要な機能だけを import すれば、不要なデータはバンドルに含まれません。
* **直感的** — date-fns に似た、関数ベースのシンプルなインターフェースを提供します。
* **高速** — 祝日の判定は定数時間で完了するため、ループ内でも安心して使用できます。

## 仕組み

### データの同梱

祝日データはライブラリ内に静的に含まれています。実行時に外部との通信は発生しません。

### 自動更新

内閣府が公開する CSV データを GitHub Actions で毎日チェックし、差分があればパッケージの新バージョンを自動で公開します。

また、ユーザーのプロジェクト向けに GitHub Actions ワークフローを提供しています。新バージョンが公開されると、依存を更新する PR が自動的に作成されます。

### サブパスによるデータの最適化

用途に応じて 2 つのエントリポイントを提供します。

| エントリポイント | 用途 | サイズ (gzip) |
|---|---|---|
| `japanese-holidays` | 祝日の判定のみ | 約 2.5 KB |
| `japanese-holidays/full` | 祝日の判定 + 祝日名の取得 | 約 3.5 KB |

### 高速な検索

日付（JST の `YYYY-MM-DD` 形式）をキーとする Map でデータを保持しており、線形探索を行わず定数時間で判定できます。

## コントリビューター向け

### 必要な環境

- Node.js 24 以上（開発時）
  - ネイティブ TypeScript サポートを使用するため
  - nvm, fnm, asdf, mise 等のバージョンマネージャーを使用している場合、`.nvmrc` により自動で切り替わります

### セットアップ

```bash
git clone https://github.com/model-geek/japanese-holidays.git
cd japanese-holidays
npm install
```

### 開発コマンド

| コマンド | 説明 |
|---|---|
| `npm run build` | TypeScript をコンパイル |
| `npm test` | テストを実行（Node.js 24+ 必須） |
| `npm run clean` | ビルド成果物を削除 |

### テストの書き方

- テストファイルは `src/` 内に `.test.ts` の命名規則で配置する
- Node.js 組み込みの `node:test` を使用する

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isHoliday } from './core.ts';

describe('isHoliday', () => {
  it('祝日の場合 true を返す', () => {
    assert.strictEqual(isHoliday('2026-01-01'), true);
  });
});
```
