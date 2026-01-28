import type { DateInput, DateLookup } from '../types.js';
import { formatDate } from '../_internal/formatDate.js';

/**
 * isNationalHoliday 関数を生成する
 *
 * @param holidayDates - 祝日の日付セット
 * @returns isNationalHoliday 関数
 *
 * @example
 * ```typescript
 * const isNationalHoliday = createIsNationalHoliday(holidayDates);
 * isNationalHoliday('2025-01-01');
 * // => true（元日）
 * ```
 */
export function createIsNationalHoliday(holidayDates: DateLookup) {
  /**
   * 指定した日付が祝日（国民の祝日・振替休日）かどうかを判定する
   *
   * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
   * @returns 祝日の場合は true
   *
   * @example
   * ```typescript
   * isNationalHoliday('2025-01-01');
   * // => true（元日）
   *
   * isNationalHoliday('2025-01-02');
   * // => false
   * ```
   */
  return function isNationalHoliday(date: DateInput): boolean {
    return holidayDates.has(formatDate(date));
  };
}
