import type { DateInput } from '../types.ts';

/** JST のオフセット（ミリ秒） */
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * 年月日から JST の Date オブジェクトを作成する
 *
 * Date.UTC と同様に月は 0-indexed（0 = 1月）。
 * 日に 0 を指定すると前月の末日になる。
 *
 * @param year - 年
 * @param month - 月（0-11）
 * @param day - 日（1-31、0 で前月末日）
 * @returns JST でその日の 00:00:00 を表す Date オブジェクト
 *
 * @example
 * ```typescript
 * createJstDate(2025, 0, 1).toISOString();
 * // => '2024-12-31T15:00:00.000Z'（JST の 2025-01-01 00:00:00）
 *
 * createJstDate(2025, 1, 0).toISOString();
 * // => '2025-01-30T15:00:00.000Z'（JST の 2025-01-31 00:00:00、1月の末日）
 * ```
 */
export function createJstDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day) - JST_OFFSET_MS);
}

/**
 * DateInput を JST の Date オブジェクトに変換する
 *
 * 返される Date オブジェクトは、JST でその日の 00:00:00 を表す。
 * `.toISOString()` で確認すると、UTC では前日の 15:00:00 になる。
 *
 * @param date - 変換する日付
 * @returns JST でその日の 00:00:00 を表す Date オブジェクト
 *
 * @example
 * ```typescript
 * toJstDate('2025-01-01').toISOString();
 * // => '2024-12-31T15:00:00.000Z'（JST の 2025-01-01 00:00:00）
 * ```
 */
export function toJstDate(date: DateInput): Date {
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number);
    return createJstDate(year, month - 1, day);
  }
  // Date オブジェクトの場合、その瞬間の JST での日付を取得
  const jstTime = date.getTime() + JST_OFFSET_MS;
  const jstDate = new Date(jstTime);
  return createJstDate(
    jstDate.getUTCFullYear(),
    jstDate.getUTCMonth(),
    jstDate.getUTCDate()
  );
}

/**
 * Date を JST での UTC 0:00 に変換する（内部ヘルパー）
 */
function toJstUtcMidnight(date: DateInput): Date {
  const d = toJstDate(date);
  return new Date(d.getTime() + JST_OFFSET_MS);
}

/**
 * JST での年を取得する
 *
 * @param date - 対象の日付
 * @returns JST での年（例: 2025）
 *
 * @example
 * ```typescript
 * getJstFullYear('2025-01-01');
 * // => 2025
 * ```
 */
export function getJstFullYear(date: DateInput): number {
  return toJstUtcMidnight(date).getUTCFullYear();
}

/**
 * JST での月を取得する（0-indexed）
 *
 * @param date - 対象の日付
 * @returns JST での月（0-11）
 *
 * @example
 * ```typescript
 * getJstMonth('2025-01-01');
 * // => 0（1月）
 * ```
 */
export function getJstMonth(date: DateInput): number {
  return toJstUtcMidnight(date).getUTCMonth();
}

/**
 * JST での日を取得する
 *
 * @param date - 対象の日付
 * @returns JST での日（1-31）
 *
 * @example
 * ```typescript
 * getJstDate('2025-01-15');
 * // => 15
 * ```
 */
export function getJstDate(date: DateInput): number {
  return toJstUtcMidnight(date).getUTCDate();
}

/**
 * JST での曜日を取得する
 *
 * @param date - 対象の日付
 * @returns JST での曜日（0: 日曜, 1: 月曜, ..., 6: 土曜）
 *
 * @example
 * ```typescript
 * getJstDay('2025-01-06'); // 月曜日
 * // => 1
 * ```
 */
export function getJstDay(date: DateInput): number {
  return toJstUtcMidnight(date).getUTCDay();
}
