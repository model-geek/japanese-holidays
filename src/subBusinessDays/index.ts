import type { DateInput, DateLookup } from '../types.js';
import { createIsBusinessDay } from '../isBusinessDay/index.js';
import { addDays } from '../_internal/addDays.js';
import { toJstDate } from '../_internal/jst.js';

/**
 * subBusinessDays 関数を生成する
 *
 * @param holidayDates - 祝日の日付セット
 * @returns subBusinessDays 関数
 *
 * @example
 * ```typescript
 * const subBusinessDays = createSubBusinessDays(holidayDates);
 * subBusinessDays('2025-01-09', 3);
 * // => Date（2025-01-06）
 * ```
 */
export function createSubBusinessDays(holidayDates: DateLookup) {
  const isBusinessDay = createIsBusinessDay(holidayDates);

  const rewind = (current: Date, remaining: number): Date => {
    if (remaining <= 0) return current;
    const prev = addDays(current, -1);
    return isBusinessDay(prev) ? rewind(prev, remaining - 1) : rewind(prev, remaining);
  };

  /**
   * 指定した日付から n 営業日前の日付を返す
   *
   * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
   * @param days - 減算する営業日数
   * @returns n 営業日前の Date オブジェクト
   *
   * @example
   * ```typescript
   * subBusinessDays('2025-01-07', 1);
   * // => Date（2025-01-06）
   *
   * subBusinessDays('2025-01-06', 1);
   * // => Date（2025-01-03）（土日をスキップ）
   * ```
   */
  return function subBusinessDays(date: DateInput, days: number): Date {
    return rewind(toJstDate(date), days);
  };
}
