import type { DateInput, DateLookup } from '../types.js';
import { createIsBusinessDay } from '../isBusinessDay/index.js';
import { addDays } from '../_internal/addDays.js';
import { toJstDate } from '../_internal/jst.js';

/**
 * getPreviousBusinessDay 関数を生成する
 *
 * @param holidayDates - 祝日の日付セット
 * @returns getPreviousBusinessDay 関数
 *
 * @example
 * ```typescript
 * const getPreviousBusinessDay = createGetPreviousBusinessDay(holidayDates);
 * getPreviousBusinessDay('2025-01-06');
 * // => Date（2025-01-03）
 * ```
 */
export function createGetPreviousBusinessDay(holidayDates: DateLookup) {
  const isBusinessDay = createIsBusinessDay(holidayDates);

  /**
   * 営業日が見つかるまで後退する再帰ヘルパー
   *
   * @param current - 現在の日付
   * @returns current が営業日ならそのまま、そうでなければ前の営業日
   */
  const findPrev = (current: Date): Date =>
    isBusinessDay(current) ? current : findPrev(addDays(current, -1));

  /**
   * 前の営業日を返す（当日が営業日でも前営業日を返す）
   *
   * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
   * @returns 前の営業日の Date オブジェクト
   *
   * @example
   * ```typescript
   * getPreviousBusinessDay('2025-01-07');
   * // => Date（2025-01-06）
   *
   * getPreviousBusinessDay('2025-01-06');
   * // => Date（2025-01-03）（土日をスキップ）
   * ```
   */
  return function getPreviousBusinessDay(date: DateInput): Date {
    return findPrev(addDays(toJstDate(date), -1));
  };
}
