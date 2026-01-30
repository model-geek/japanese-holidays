# TSDoc 記載方針

## 対象

| 対象 | TSDoc |
|---|---|
| 公開 API（export された関数・型） | 必須 |
| 内部関数 | 任意（複雑な場合のみ） |
| 定数・データ | 必須（用途を説明） |

## 言語

- 日本語で記載する
- 技術用語（例: Date, Map, Set）は英語のまま使用
- 文体は「だ・である調」を使用する

## 基本構造

```typescript
/**
 * 関数の説明（1 行で簡潔に）
 *
 * @param paramName - パラメータの説明
 * @returns 戻り値の説明
 *
 * @example
 * ```typescript
 * functionName('2025-01-01');
 * // => 期待する結果
 * ```
 */
```

## タグの使用ルール

| タグ | 使用条件 |
|---|---|
| `@param` | パラメータがある場合は必須 |
| `@returns` | 戻り値がある場合は必須（`void` は省略可） |
| `@example` | 公開 API には必須 |
| `@throws` | 例外をスローする場合は必須 |
| `@see` | 関連する関数・ドキュメントがある場合 |
| `@deprecated` | 非推奨の場合 |

## 省略ルール

- 型が自明な場合、`@param` / `@returns` の型注釈は省略
- 説明が不要なほど自明なパラメータ名でも、`@param` は記載する

## 書き方の例

### 公開 API

```typescript
/**
 * 指定した日付が祝日かどうかを判定する
 *
 * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
 * @returns 祝日の場合は true
 *
 * @example
 * ```typescript
 * isHoliday('2025-01-01');
 * // => true
 *
 * isHoliday(new Date('2025-01-01'));
 * // => true
 * ```
 */
export function isHoliday(date: DateInput): boolean {
  // ...
}
```

### 型定義

```typescript
/**
 * 日付の入力型
 *
 * Date オブジェクトまたは YYYY-MM-DD 形式の文字列を受け付ける
 */
export type DateInput = Date | string;
```

### インターフェース

フィールドのコメントは複数行で記載し、フィールド間には空行を入れる。

```typescript
/**
 * 祝日データ
 */
export interface Holiday {
  /**
   * 日付（YYYY-MM-DD 形式）
   */
  date: string;

  /**
   * 祝日名
   */
  name: string;
}
```

### 内部関数（複雑な場合のみ）

```typescript
/**
 * 日付を YYYY-MM-DD 形式の文字列に変換する
 */
function formatDate(date: DateInput): string {
  // ...
}
```

## アンチパターン

```typescript
// ❌ 型をそのまま説明しているだけ
/**
 * @param date - DateInput 型の日付
 * @returns boolean を返す
 */

// ✅ 意味を説明する
/**
 * @param date - 判定する日付
 * @returns 祝日の場合は true
 */
```

```typescript
// ❌ コードを読めばわかる実装の説明
/**
 * holidayDates.has() を呼び出して判定する
 */

// ✅ 何をするかを説明
/**
 * 指定した日付が祝日かどうかを判定する
 */
```
