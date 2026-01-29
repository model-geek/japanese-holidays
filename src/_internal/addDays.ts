import type { DateInput } from '../types.ts';
import { toJstDate } from './jst.ts';

/**
 * 日付に n 日加算する
 *
 * @param date - 基準日
 * @param days - 加算する日数（負の値で減算）
 * @returns 加算後の Date オブジェクト
 *
 * @example
 * ```typescript
 * addDays('2025-01-01', 5);
 * // => Date(2025, 0, 6)
 *
 * addDays('2025-01-10', -3);
 * // => Date(2025, 0, 7)
 * ```
 */
export function addDays(date: DateInput, days: number): Date {
  const d = toJstDate(date);
  d.setDate(d.getDate() + days);
  return d;
}
