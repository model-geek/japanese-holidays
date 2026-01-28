import type { DateInput, DateLookup } from '../types.js';
import { createIsBusinessDay } from '../isBusinessDay/index.js';
import { createGetPreviousBusinessDay } from '../getPreviousBusinessDay/index.js';
import { getEndOfMonth } from '../_internal/getEndOfMonth.js';

/**
 * getLastBusinessDayOfMonth 関数を生成する
 *
 * @param holidayDates - 祝日の日付セット
 * @returns getLastBusinessDayOfMonth 関数
 *
 * @example
 * ```typescript
 * const getLastBusinessDayOfMonth = createGetLastBusinessDayOfMonth(holidayDates);
 * getLastBusinessDayOfMonth('2025-01-15');
 * // => Date（2025-01-31）
 * ```
 */
export function createGetLastBusinessDayOfMonth(holidayDates: DateLookup) {
  const isBusinessDay = createIsBusinessDay(holidayDates);
  const getPreviousBusinessDay = createGetPreviousBusinessDay(holidayDates);

  /**
   * 指定した日付の月の最終営業日を返す
   *
   * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
   * @returns 月の最終営業日の Date オブジェクト
   *
   * @example
   * ```typescript
   * getLastBusinessDayOfMonth('2025-01-15');
   * // => Date（2025-01-31）（金曜日）
   *
   * getLastBusinessDayOfMonth('2025-05-15');
   * // => Date（2025-05-30）（土曜なので前日の金曜）
   * ```
   */
  return function getLastBusinessDayOfMonth(date: DateInput): Date {
    const endOfMonth = getEndOfMonth(date);
    if (isBusinessDay(endOfMonth)) {
      return endOfMonth;
    }
    return getPreviousBusinessDay(endOfMonth);
  };
}
