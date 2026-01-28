import type { DateInput, DateLookup } from '../types.js';
import { isWeekend } from '../isWeekend/index.js';
import { createIsNationalHoliday } from '../isNationalHoliday/index.js';

/**
 * isHoliday 関数を生成する
 *
 * @param holidayDates - 祝日の日付セット
 * @returns isHoliday 関数
 *
 * @example
 * ```typescript
 * const isHoliday = createIsHoliday(holidayDates);
 * isHoliday('2025-01-01');
 * // => true（元日）
 * ```
 */
export function createIsHoliday(holidayDates: DateLookup) {
  const isNationalHoliday = createIsNationalHoliday(holidayDates);

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
  return function isHoliday(date: DateInput): boolean {
    return isWeekend(date) || isNationalHoliday(date);
  };
}
