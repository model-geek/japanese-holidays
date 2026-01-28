import type { DateInput } from './types.js';
import { getJstFullYear, getJstMonth } from './jstGetters.js';

/** JST のオフセット（ミリ秒） */
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * 指定した日付の月末日を返す
 *
 * @param date - 基準日
 * @returns 月末日の Date オブジェクト（JST の 00:00:00）
 *
 * @example
 * ```typescript
 * getEndOfMonth('2025-01-15');
 * // => JST の 2025-01-31 00:00:00
 *
 * getEndOfMonth('2025-02-10');
 * // => JST の 2025-02-28 00:00:00
 * ```
 */
export function getEndOfMonth(date: DateInput): Date {
  const year = getJstFullYear(date);
  const month = getJstMonth(date);
  // 翌月の 0 日 = 当月の末日（UTC で計算し、JST に戻す）
  return new Date(Date.UTC(year, month + 1, 0) - JST_OFFSET_MS);
}
