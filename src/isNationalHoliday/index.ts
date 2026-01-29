import type { DateInput } from '../types.ts';
import { getHolidayName } from '../getHolidayName/index.ts';

/**
 * 指定した日付が祝日（国民の祝日・振替休日・国民の休日）かどうかを判定する
 *
 * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
 * @returns 祝日の場合は true
 *
 * @example
 * ```typescript
 * isNationalHoliday('2025-01-01');
 * // => true（元日）
 *
 * isNationalHoliday('2025-01-13');
 * // => true（成人の日）
 *
 * isNationalHoliday('2025-01-02');
 * // => false
 * ```
 */
export function isNationalHoliday(date: DateInput): boolean {
  return getHolidayName(date) !== undefined;
}
