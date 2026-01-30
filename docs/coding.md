# コーディングルール

## 1. 配列・オブジェクトのイミュータビリティ方針

### 1-1. 外部 API ではイミュータブルに扱う

**規約**

- 公開関数・メソッド(他モジュールから呼ばれる API)は、
  - 引数として受け取った配列・オブジェクトを **直接変更しない** こと
  - 状態の変更が必要な場合は、**新しいオブジェクト/配列を生成して返す** こと

**理由**

- 呼び出し元から見たときに、副作用の有無が分かりやすくなる
- 意図しない共有データの破壊(別名参照のバグ)を防ぎやすい
- テストしやすくなり、関数ごとの責務が明確になる

**例**

```typescript
// NG: 引数の配列を直接書き換えている
export function addItemNg(list: string[], item: string): string[] {
  list.push(item);
  return list;
}

// OK: 新しい配列を返す
export function addItemOk(list: readonly string[], item: string): string[] {
  return [...list, item];
}
```

### 1-2. 内部実装では性能のためのミュータブル操作を許容する

**規約**

- モジュール内で完結する内部実装(外部から直接呼ばれない関数)では、
  - パフォーマンスが重要な箇所に限り、`let` や `push` などのミュータブル操作を **許容** する
- ただし、そのミュータブルな値がそのまま外部に晒されないように注意すること

**理由**

- `const` + `[...a, ...b]` などによる完全イミュータブルな実装は、
  - 大きな配列や高頻度な呼び出しに対して、**メモリと CPU のコストが高くなる**
- ライブラリやコア処理では、性能がそのまま利用者全体の体験に影響するため、
  - 外部 API はイミュータブルに保ちつつ、
  - 内部では必要な範囲でミュータブルに実装するのが実務的なバランスである

**例**

```typescript
// 外部 API(イミュータブルに見える)
// パフォーマンス最適化: 数十年分の日付範囲(数万日)を走査する可能性があるため、
// ループ内での配列コピーを避け、push を使用している。
export function getHolidaysInRange(start: string, end: string): Holiday[] {
  const result: Holiday[] = [];
  collectHolidays(start, end, result); // 内部で破壊的に追加
  return result; // 変更されたのはこの関数内で作った配列のみ
}

// 内部実装(ミュータブル許容)
function collectHolidays(start: string, end: string, out: Holiday[]): void {
  let current = start;
  while (current <= end) {
    const name = getHolidayName(current);
    if (name !== undefined) {
      out.push({ date: current, name });
    }
    current = addDays(current, 1);
  }
}
```

### 1-3. `[...a, ...b]` による配列再生成の使いどころ

**規約**

- `[...a, ...b]` などのスプレッドによる配列再生成は、
  - 「データサイズが小さい」「呼び出し頻度が低い」「可読性を優先したい」箇所で使用してよい
- 一方で、以下のような箇所では使用を控え、必要ならミュータブルなロジックに切り替えること
  - 大きな配列(おおよそ数万要素以上)が対象になり得る
  - 頻繁に呼ばれるホットパス
  - ネストしたループや再帰の中で何度も配列をコピーしている

**理由**

- スプレッドで配列を再生成すると、要素数 n に対して **O(n)** のコピーが発生する
- これをループやネスト内で繰り返すと、容易に **O(n^2)** 以上のコストになり、
  - メモリ使用量増加
  - GC 負荷増大
  - 実行時間の悪化
  を引き起こすため

**例(控えたいパターン)**

```typescript
// NG: ループ内で毎回コピーを作成
function badConcatAll<T>(lists: readonly T[][]): T[] {
  let result: T[] = [];
  for (const list of lists) {
    result = [...result, ...list];
  }
  return result;
}

// OK: push を使用してコピーを避ける
function goodConcatAll<T>(lists: readonly T[][]): T[] {
  const result: T[] = [];
  for (const list of lists) {
    result.push(...list);
  }
  return result;
}
```

## 2. ループと再帰の使用方針

### 2-1. 反復処理は原則 `for` / `while` / `for...of` で書く

**規約**

- 要素列・配列・木構造などの走査は、**原則として**
  `for` / `while` / `for...of` を用いた反復処理で実装すること
- 特に、入力サイズや深さに外部からの制約がないライブラリコードでは、
  再帰のみでループを実現することを原則禁止とする

**理由**

- JavaScript エンジンには末尾再帰最適化(TCO)の保証がなく、
  - 再帰のネストが深くなると、**スタックオーバーフロー (`RangeError`) のリスク** がある
- ライブラリコードは
  - 呼び出し側の入力サイズ・深さを制御できず、
  - 様々な環境(ブラウザ・Node.js)のスタック制限に依存するため、
    安全性の観点から再帰よりもループを優先する

**例**

```typescript
// OK: ループで実装した合計値計算
export function sum(nums: readonly number[]): number {
  let total = 0;
  for (const n of nums) {
    total += n;
  }
  return total;
}
```

### 2-2. 再帰を使ってよいケースとルール

**規約**

- 再帰を使用してよいのは、次の条件をすべて満たす場合とする
  - 再帰の深さに **理論的な上限があり**、それがスタック的に十分浅いと判断できること
  - その上限や前提を、コメント等でコード上にはっきり明示すること
  - ユニットテスト等で、その範囲内で正常に動作することを確認していること
- 上記条件を満たさない一般的な走査・探索処理は、
  - 再帰ではなくループ + 明示的スタック(配列)で実装すること

**理由**

- 再帰呼び出しは毎回コールスタックのフレームを積み増すため、
  - 深さが入力に比例して増える場合、入力次第で容易にスタックオーバーフローする
- 条件を満たす場合のみ、コードの分かりやすさを優先して再帰を許可することで、
  - 安全性と可読性のバランスを取る

**例(許容される再帰: 深さが限定された木構造)**

```typescript
// 深さが最大でも 10 程度に制限された UI ツリーを想定
// NOTE: この関数は UI ツリーの深さが 10 以下であることを前提とする。
//       それ以上の深さになるケースは設計上発生しない。
function renderTree(node: Node): void {
  renderNode(node);
  for (const child of node.children) {
    renderTree(child);
  }
}
```

## 3. このプロジェクトはライブラリである

### 3-1. 基本方針: 可読性の高い表現を優先する

このプロジェクトはライブラリですが、**まずは可読性の高い表現を優先してください**。

**優先して使う表現:**

- `for (const item of items)` — イミュータブルで意図が明確
- `const` による変数宣言 — 再代入がないことが一目で分かる
- `map`, `filter`, `reduce` — 宣言的で処理の意図が明確

**例**

```typescript
// OK: 可読性が高く、意図が明確
export function getHolidayNames(dates: readonly string[]): string[] {
  const names: string[] = [];
  for (const date of dates) {
    const name = getHolidayName(date);
    if (name !== undefined) {
      names.push(name);
    }
  }
  return names;
}
```

### 3-2. パフォーマンスが問題になる場合のみ `while` や `let` を使う

`while` や `let` を使うのは、パフォーマンスに影響する箇所に限定してください。

**`while` や `let` を使ってよいケース:**

- 大きな配列(数万要素以上)を処理する可能性がある
- ホットパスで頻繁に呼ばれる
- ループ内で配列のコピーが発生し、O(n^2) になる

### 3-3. 必ずコメントで理由を記載する

`while` や `let` を使う場合は、**必ず以下をコメントに記載してください**:

1. なぜこの手法を用いるのか
2. どういったケースでパフォーマンスが低下するのを防いでいるか

**例**

```typescript
// パフォーマンス最適化: 大量の祝日データ(数十年分)を処理する可能性があるため、
// ループ内での配列コピー([...result, item])を避け、push を使用している。
// コピーを使うと O(n^2) になり、10年分(約150件)でも顕著な遅延が発生する。
function collectHolidays(start: string, end: string): Holiday[] {
  const result: Holiday[] = [];
  let current = start;
  while (current <= end) {
    const name = getHolidayName(current);
    if (name !== undefined) {
      result.push({ date: current, name });
    }
    current = addDays(current, 1);
  }
  return result;
}
```

**コメントがない場合は NG:**

```typescript
// NG: なぜ while と let を使っているのか分からない
function collectHolidays(start: string, end: string): Holiday[] {
  const result: Holiday[] = [];
  let current = start;
  while (current <= end) {
    // ...
  }
  return result;
}
```

### 3-4. なぜこの基準が必要か

ライブラリはアプリケーションと異なり、利用者の規模・頻度・環境を制御できません。

- **利用者の規模を制御できない**: 数百件のつもりでも、数万件で呼ばれる可能性があります
- **呼び出し頻度を制御できない**: 1 回のつもりでも、ホットパスで何度も呼ばれる可能性があります
- **環境を制御できない**: 様々な環境のスタック制限やメモリ制約に対応する必要があります
- **性能劣化が利用者全体に波及する**: ライブラリの非効率なコードは、それを使う全てのアプリケーションに影響します

だからこそ、**可読性を優先しつつ、必要な箇所では理由を明記してパフォーマンス最適化を行う**という基準が重要です
