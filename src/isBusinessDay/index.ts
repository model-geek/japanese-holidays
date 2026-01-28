import type { DateInput, DateLookup } from '../types.js';
import { createIsHoliday } from '../isHoliday/index.js';

/**
 * isBusinessDay 関数を生成する
 *
 * @param holidayDates - 祝日の日付セット
 * @returns isBusinessDay 関数
 *
 * @example
 * ```typescript
 * const isBusinessDay = createIsBusinessDay(holidayDates);
 * isBusinessDay('2025-01-06');
 * // => true（月曜日、祝日でない）
 * ```
 */
export function createIsBusinessDay(holidayDates: DateLookup) {
  const isHoliday = createIsHoliday(holidayDates);

  /**
   * 指定した日付が営業日（祝日でも土日でもない）かどうかを判定する
   *
   * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
   * @returns 営業日の場合は true
   *
   * @example
   * ```typescript
   * isBusinessDay('2025-01-06');
   * // => true（月曜日、祝日でない）
   *
   * isBusinessDay('2025-01-01');
   * // => false（元日）
   *
   * isBusinessDay('2025-01-04');
   * // => false（土曜日）
   * ```
   */
  return function isBusinessDay(date: DateInput): boolean {
    return !isHoliday(date);
  };
}
