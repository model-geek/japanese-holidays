import type { DateInput } from '../types.ts';
import { isWeekend } from '../isWeekend/index.ts';
import { isNationalHoliday } from '../isNationalHoliday/index.ts';

/**
 * 指定した日付が休日（祝日または土日）かどうかを判定する
 *
 * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
 * @returns 休日の場合は true
 *
 * @example
 * ```typescript
 * isHoliday('2025-01-01');
 * // => true（元日）
 *
 * isHoliday('2025-01-04');
 * // => true（土曜日）
 *
 * isHoliday('2025-01-06');
 * // => false（月曜日、祝日でない）
 * ```
 */
export function isHoliday(date: DateInput): boolean {
  return isWeekend(date) || isNationalHoliday(date);
}
