import type { DateInput } from './types.js';
import { formatDate } from './formatDate.js';

/**
 * 日付の存在確認が可能なオブジェクト
 */
interface DateLookup {
  has(key: string): boolean;
}

/**
 * 祝日判定関数を生成する
 *
 * @param lookup - 日付の存在確認が可能なオブジェクト（Set または Map）
 * @returns 祝日判定関数
 *
 * @example
 * ```typescript
 * const isHoliday = createIsHoliday(holidayDates);
 * isHoliday('2025-01-01');
 * // => true
 * ```
 */
export function createIsHoliday(lookup: DateLookup) {
  /**
   * 指定した日付が祝日かどうかを判定する
   *
   * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
   * @returns 祝日の場合は true
   */
  return function isHoliday(date: DateInput): boolean {
    return lookup.has(formatDate(date));
  };
}
