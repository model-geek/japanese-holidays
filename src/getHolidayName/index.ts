import type { DateInput, HolidayNameLookup } from '../types.js';
import { formatDate } from '../_internal/formatDate.js';

/**
 * createGetHolidayName 関数を生成する
 *
 * @param holidayNames - 祝日名のマップ
 * @returns getHolidayName 関数
 *
 * @example
 * ```typescript
 * const getHolidayName = createGetHolidayName(holidayNames);
 * getHolidayName('2025-01-01');
 * // => '元日'
 * ```
 */
export function createGetHolidayName(holidayNames: HolidayNameLookup) {
  /**
   * 指定した日付の祝日名を返す
   *
   * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
   * @returns 祝日名（祝日でない場合は undefined）
   *
   * @example
   * ```typescript
   * getHolidayName('2025-01-01');
   * // => '元日'
   *
   * getHolidayName('2025-01-02');
   * // => undefined
   * ```
   */
  return function getHolidayName(date: DateInput): string | undefined {
    return holidayNames.get(formatDate(date));
  };
}
