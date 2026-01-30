import { addDays } from './addDays.ts';

/** 日付が条件を満たすかを判定する関数 */
type DatePredicate = (date: Date) => boolean;

/**
 * 条件を満たす次の日付を探す
 *
 * 営業日計算などホットパスで頻繁に呼ばれるため、while ループで実装している。
 * また、走査の深さに上限がないため、再帰ではスタックオーバーフローのリスクがある。
 *
 * @param current - 現在の日付
 * @param predicate - 条件を満たすかを判定する関数
 * @returns 条件を満たす次の日付
 */
export const findNext = (current: Date, predicate: DatePredicate): Date => {
  let date = current;
  while (!predicate(date)) {
    date = addDays(date, 1);
  }
  return date;
};

/**
 * 条件を満たす前の日付を探す
 *
 * 営業日計算などホットパスで頻繁に呼ばれるため、while ループで実装している。
 * また、走査の深さに上限がないため、再帰ではスタックオーバーフローのリスクがある。
 *
 * @param current - 現在の日付
 * @param predicate - 条件を満たすかを判定する関数
 * @returns 条件を満たす前の日付
 */
export const findPrev = (current: Date, predicate: DatePredicate): Date => {
  let date = current;
  while (!predicate(date)) {
    date = addDays(date, -1);
  }
  return date;
};

/**
 * 条件を満たす日付を数えながら前進する
 *
 * 営業日計算などホットパスで頻繁に呼ばれるため、while ループで実装している。
 * また、走査の深さに上限がないため、再帰ではスタックオーバーフローのリスクがある。
 *
 * @param current - 現在の日付
 * @param remaining - 残りのカウント数
 * @param predicate - カウント対象かを判定する関数
 * @returns remaining 回条件を満たした後の日付
 */
export const advance = (
  current: Date,
  remaining: number,
  predicate: DatePredicate
): Date => {
  if (remaining <= 0) return current;
  let date = current;
  let count = remaining;
  while (count > 0) {
    date = addDays(date, 1);
    if (predicate(date)) {
      count--;
    }
  }
  return date;
};

/**
 * 条件を満たす日付を数えながら後退する
 *
 * 営業日計算などホットパスで頻繁に呼ばれるため、while ループで実装している。
 * また、走査の深さに上限がないため、再帰ではスタックオーバーフローのリスクがある。
 *
 * @param current - 現在の日付
 * @param remaining - 残りのカウント数
 * @param predicate - カウント対象かを判定する関数
 * @returns remaining 回条件を満たした後の日付
 */
export const rewind = (
  current: Date,
  remaining: number,
  predicate: DatePredicate
): Date => {
  if (remaining <= 0) return current;
  let date = current;
  let count = remaining;
  while (count > 0) {
    date = addDays(date, -1);
    if (predicate(date)) {
      count--;
    }
  }
  return date;
};

/**
 * 範囲内で条件を満たす日付をカウントする
 *
 * 日付範囲が数十年に及ぶ可能性があるため、while ループで実装している。
 * 再帰では走査の深さに上限がなく、スタックオーバーフローのリスクがある。
 *
 * @param current - 現在の日付
 * @param target - 終了日
 * @param predicate - カウント対象かを判定する関数
 * @param acc - 累積カウント
 * @returns 条件を満たす日付の総数
 */
export const count = (
  current: Date,
  target: Date,
  predicate: DatePredicate,
  acc: number = 0
): number => {
  let date = current;
  let total = acc;
  const targetTime = target.getTime();
  while (date.getTime() <= targetTime) {
    if (predicate(date)) {
      total++;
    }
    date = addDays(date, 1);
  }
  return total;
};

/**
 * 範囲内の日付を変換し、undefined でないものを収集する
 *
 * 日付範囲が数十年に及ぶ可能性があるため、while ループで実装している。
 * 再帰では走査の深さに上限がなく、スタックオーバーフローのリスクがある。
 * また、ループ内での配列コピー([...result, item])を避け、push を使用している。
 *
 * @param current - 現在の日付
 * @param target - 終了日
 * @param mapper - 日付を変換する関数（undefined を返すとスキップ）
 * @param acc - 累積結果
 * @returns 変換結果の配列
 */
export const collect = <T>(
  current: Date,
  target: Date,
  mapper: (date: Date) => T | undefined,
  acc: T[] = []
): T[] => {
  // 性能のため、内部ではミュータブルな配列操作を使用
  const result = [...acc];
  let date = current;
  const targetTime = target.getTime();
  while (date.getTime() <= targetTime) {
    const mapped = mapper(date);
    if (mapped !== undefined) {
      result.push(mapped);
    }
    date = addDays(date, 1);
  }
  return result;
};
