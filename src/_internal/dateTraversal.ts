import { addDays } from './addDays.js';

/** 日付が条件を満たすかを判定する関数 */
type DatePredicate = (date: Date) => boolean;

/**
 * 条件を満たす次の日付を探す
 *
 * @param current - 現在の日付
 * @param predicate - 条件を満たすかを判定する関数
 * @returns 条件を満たす次の日付
 */
export const findNext = (current: Date, predicate: DatePredicate): Date => {
  return predicate(current) ? current : findNext(addDays(current, 1), predicate);
};

/**
 * 条件を満たす前の日付を探す
 *
 * @param current - 現在の日付
 * @param predicate - 条件を満たすかを判定する関数
 * @returns 条件を満たす前の日付
 */
export const findPrev = (current: Date, predicate: DatePredicate): Date => {
  return predicate(current) ? current : findPrev(addDays(current, -1), predicate);
};

/**
 * 条件を満たす日付を数えながら前進する
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
  const next = addDays(current, 1);
  return predicate(next)
    ? advance(next, remaining - 1, predicate)
    : advance(next, remaining, predicate);
};

/**
 * 条件を満たす日付を数えながら後退する
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
  const next = addDays(current, -1);
  return predicate(next)
    ? rewind(next, remaining - 1, predicate)
    : rewind(next, remaining, predicate);
};

/**
 * 範囲内で条件を満たす日付をカウントする
 *
 * @param current - 現在の日付
 * @param targetTime - 終了日のタイムスタンプ
 * @param predicate - カウント対象かを判定する関数
 * @param acc - 累積カウント
 * @returns 条件を満たす日付の総数
 */
export const count = (
  current: Date,
  targetTime: number,
  predicate: DatePredicate,
  acc: number = 0
): number => {
  if (current.getTime() > targetTime) return acc;
  const increment = predicate(current) ? 1 : 0;
  return count(addDays(current, 1), targetTime, predicate, acc + increment);
};
