import type { DateInput } from '../_internal/types.js';
import { getJstDay } from '../_internal/jst.js';

/**
 * 指定した日付が土日かどうかを判定する
 *
 * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
 * @returns 土日の場合は true
 *
 * @example
 * ```typescript
 * isWeekend('2025-01-04');
 * // => true（土曜日）
 *
 * isWeekend('2025-01-06');
 * // => false（月曜日）
 * ```
 */
export function isWeekend(date: DateInput): boolean {
  const day = getJstDay(date);
  return day === 0 || day === 6;
}
