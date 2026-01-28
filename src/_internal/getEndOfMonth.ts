import type { DateInput } from './types.js';
import { toJstDate } from './toJstDate.js';

/**
 * 指定した日付の月末日を返す
 *
 * @param date - 基準日
 * @returns 月末日の Date オブジェクト
 *
 * @example
 * ```typescript
 * getEndOfMonth('2025-01-15');
 * // => Date(2025, 0, 31)
 *
 * getEndOfMonth('2025-02-10');
 * // => Date(2025, 1, 28)
 * ```
 */
export function getEndOfMonth(date: DateInput): Date {
  const d = toJstDate(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
