# japanese-holidays

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![npm version](https://img.shields.io/npm/v/@modelgeek/japanese-holidays)](https://www.npmjs.com/package/@modelgeek/japanese-holidays)

日本の祝日を扱うための TypeScript ライブラリです。

## 特徴

* **同期的に動作** — 外部 API やデータベースへの通信なしに祝日を判定できます。
* **未来の日付に対応** — 祝日ルールをロジックとして実装しているため、内閣府の CSV に記載されていない未来の日付も判定できます。
* **常に最新** — 内閣府の祝日データが更新されると、新しいバージョンが自動的に公開されます。
* **コンパクト** — バンドラーの Tree shaking により、使用する関数のみがバンドルに含まれます。
* **直感的** — date-fns に似た、関数ベースのシンプルなインターフェースを提供します。
* **高速** — 祝日の判定は定数時間で完了するため、ループ内でも安心して使用できます。

## インストール

```bash
npm install @modelgeek/japanese-holidays
```

## 使い方

```typescript
import { isHoliday, getHolidayName, isBusinessDay } from '@modelgeek/japanese-holidays';

// 祝日・土日かどうかを判定
isHoliday('2025-01-01');  // true（元日）
isHoliday('2025-01-04');  // true（土曜日）
isHoliday('2025-01-06');  // false（平日）

// 祝日名を取得
getHolidayName('2025-01-01');  // '元日'
getHolidayName('2025-01-06');  // undefined

// 営業日かどうかを判定
isBusinessDay('2025-01-06');  // true
isBusinessDay('2025-01-01');  // false
```

日付は `YYYY-MM-DD` 形式の文字列または `Date` オブジェクトで指定できます。
内部では JST（日本標準時）として解釈されます。

## API

### 祝日判定

| 関数 | 説明 |
|---|---|
| `isNationalHoliday(date)` | 国民の祝日かどうかを判定する |
| `getHolidayName(date)` | 祝日名を返す（祝日でなければ `undefined`） |
| `isWeekend(date)` | 土曜日または日曜日かどうかを判定する |
| `isHoliday(date)` | 祝日または土日かどうかを判定する |

### 営業日計算

| 関数 | 説明 |
|---|---|
| `isBusinessDay(date)` | 営業日（祝日・土日以外）かどうかを判定する |
| `addBusinessDays(date, days)` | 指定した営業日数を加算した日付を返す |
| `subBusinessDays(date, days)` | 指定した営業日数を減算した日付を返す |
| `getNextBusinessDay(date)` | 翌営業日を返す |
| `getPreviousBusinessDay(date)` | 前営業日を返す |
| `countBusinessDays(start, end)` | 期間内の営業日数をカウントする |
| `getLastBusinessDayOfMonth(date)` | 月末の最終営業日を返す |
| `getLastBusinessDayOfWeek(date)` | 週の最終営業日（金曜日）を返す |

## 仕組み

### 祝日ルールのロジック実装

祝日データは静的なリストではなく、祝日法に基づくルールとしてロジックで実装しています。これにより、内閣府の CSV に記載されていない未来の日付も正しく判定できます。

内閣府が公開する全期間の祝日データと照合するテストにより、ロジックの正確性を検証しています。

### 自動更新

内閣府が公開する CSV データを GitHub Actions で毎日チェックし、差分があればパッケージの新バージョンを自動で公開します。

また、ユーザーのプロジェクト向けに GitHub Actions ワークフローを提供しています。新バージョンが公開されると、依存を更新する PR が自動的に作成されます。

### Tree shaking によるサイズ最適化

単一のエントリポイントから全機能を提供します。バンドラーの Tree shaking により、使用する関数のみが最終的なバンドルに含まれます。

### 高速な検索

日付（JST の `YYYY-MM-DD` 形式）をキーとする Map でデータを保持しており、線形探索を行わず定数時間で判定できます。

## コントリビューター向け

| ドキュメント | 内容 |
|---|---|
| [開発ガイド](docs/development.md) | セットアップ、コマンド、開発フロー |
| [コーディングルール](docs/coding.md) | イミュータビリティ、再帰、パフォーマンス方針 |
| [ドキュメント作成ルール](docs/documentation.md) | 文体、表記、構成のルール |
| [TSDoc 記載方針](docs/tsdoc.md) | TSDoc を書く対象と書き方 |

## ライセンス

[MIT](LICENSE)
