import type { DateInput, DateLookup } from '../types.js';
import { createIsBusinessDay } from '../isBusinessDay/index.js';
import { addDays } from '../_internal/addDays.js';
import { toJstDate } from '../_internal/jst.js';

/**
 * addBusinessDays 関数を生成する
 *
 * @param holidayDates - 祝日の日付セット
 * @returns addBusinessDays 関数
 *
 * @example
 * ```typescript
 * const addBusinessDays = createAddBusinessDays(holidayDates);
 * addBusinessDays('2025-01-06', 3);
 * // => Date（2025-01-09）
 * ```
 */
export function createAddBusinessDays(holidayDates: DateLookup) {
  const isBusinessDay = createIsBusinessDay(holidayDates);

  const advance = (current: Date, remaining: number): Date => {
    if (remaining <= 0) return current;
    const next = addDays(current, 1);
    return isBusinessDay(next) ? advance(next, remaining - 1) : advance(next, remaining);
  };

  /**
   * 指定した日付から n 営業日後の日付を返す
   *
   * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
   * @param days - 加算する営業日数
   * @returns n 営業日後の Date オブジェクト
   *
   * @example
   * ```typescript
   * addBusinessDays('2025-01-06', 1);
   * // => Date（2025-01-07）
   *
   * addBusinessDays('2025-01-03', 1);
   * // => Date（2025-01-06）（土日をスキップ）
   * ```
   */
  return function addBusinessDays(date: DateInput, days: number): Date {
    return advance(toJstDate(date), days);
  };
}
