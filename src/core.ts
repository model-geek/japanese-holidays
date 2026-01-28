import type { DateInput } from './types.ts';

/**
 * 日付の存在確認が可能なオブジェクト
 */
interface DateLookup {
  has(key: string): boolean;
}

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換する
 *
 * @param date - 変換する日付
 * @returns YYYY-MM-DD 形式の文字列
 *
 * @example
 * ```typescript
 * formatDate(new Date('2025-01-01'));
 * // => '2025-01-01'
 *
 * formatDate('2025-01-01');
 * // => '2025-01-01'
 * ```
 */
export function formatDate(date: DateInput): string {
  if (typeof date === 'string') {
    return date;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
