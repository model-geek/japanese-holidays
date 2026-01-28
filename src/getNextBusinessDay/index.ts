import type { DateInput, DateLookup } from '../types.js';
import { createIsBusinessDay } from '../isBusinessDay/index.js';
import { addDays } from '../_internal/addDays.js';
import { toJstDate } from '../_internal/jst.js';

/**
 * getNextBusinessDay 関数を生成する
 *
 * @param holidayDates - 祝日の日付セット
 * @returns getNextBusinessDay 関数
 *
 * @example
 * ```typescript
 * const getNextBusinessDay = createGetNextBusinessDay(holidayDates);
 * getNextBusinessDay('2025-01-03');
 * // => Date（2025-01-06）
 * ```
 */
export function createGetNextBusinessDay(holidayDates: DateLookup) {
  const isBusinessDay = createIsBusinessDay(holidayDates);

  const findNext = (current: Date): Date =>
    isBusinessDay(current) ? current : findNext(addDays(current, 1));

  /**
   * 次の営業日を返す（当日が営業日でも翌営業日を返す）
   *
   * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
   * @returns 次の営業日の Date オブジェクト
   *
   * @example
   * ```typescript
   * getNextBusinessDay('2025-01-06');
   * // => Date（2025-01-07）
   *
   * getNextBusinessDay('2025-01-03');
   * // => Date（2025-01-06）（土日をスキップ）
   * ```
   */
  return function getNextBusinessDay(date: DateInput): Date {
    return findNext(addDays(toJstDate(date), 1));
  };
}
