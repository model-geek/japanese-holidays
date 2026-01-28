import type { DateInput, DateLookup } from '../types.js';
import { createIsBusinessDay } from '../isBusinessDay/index.js';
import { createGetPreviousBusinessDay } from '../getPreviousBusinessDay/index.js';
import { getEndOfWeek } from '../_internal/getEndOfWeek.js';

/**
 * getLastBusinessDayOfWeek 関数を生成する
 *
 * @param holidayDates - 祝日の日付セット
 * @returns getLastBusinessDayOfWeek 関数
 *
 * @example
 * ```typescript
 * const getLastBusinessDayOfWeek = createGetLastBusinessDayOfWeek(holidayDates);
 * getLastBusinessDayOfWeek('2025-01-06');
 * // => Date（2025-01-10）
 * ```
 */
export function createGetLastBusinessDayOfWeek(holidayDates: DateLookup) {
  const isBusinessDay = createIsBusinessDay(holidayDates);
  const getPreviousBusinessDay = createGetPreviousBusinessDay(holidayDates);

  /**
   * 指定した日付の週の最終営業日を返す（月〜金の範囲で）
   *
   * 週は月曜始まりとして扱い、金曜日を週末日とする。
   * 金曜日が営業日でない場合は、前の営業日を返す。
   *
   * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
   * @returns 週の最終営業日の Date オブジェクト
   *
   * @example
   * ```typescript
   * getLastBusinessDayOfWeek('2025-01-06');
   * // => Date（2025-01-10）（金曜日）
   *
   * // 金曜日が祝日の場合
   * getLastBusinessDayOfWeek('2024-12-30');
   * // => Date（2025-01-02）（金曜が祝日なので木曜）
   * ```
   */
  return function getLastBusinessDayOfWeek(date: DateInput): Date {
    const endOfWeek = getEndOfWeek(date);
    if (isBusinessDay(endOfWeek)) {
      return endOfWeek;
    }
    return getPreviousBusinessDay(endOfWeek);
  };
}
