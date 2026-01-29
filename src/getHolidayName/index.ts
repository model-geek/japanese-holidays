import type { DateInput } from '../types.ts';
import { getJstFullYear } from '../_internal/jst.ts';
import { formatDate } from '../_internal/formatDate.ts';
import { getHolidaysForYear, HOLIDAY_LAW_START_YEAR } from '../_data/rules.ts';

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
 * getHolidayName('2025-01-13');
 * // => '成人の日'
 *
 * getHolidayName('2025-02-24');
 * // => '休日'
 *
 * getHolidayName('2025-01-02');
 * // => undefined
 * ```
 */
export function getHolidayName(date: DateInput): string | undefined {
  const year = getJstFullYear(date);
  if (year < HOLIDAY_LAW_START_YEAR) return undefined;

  const holidays = getHolidaysForYear(year);
  return holidays.get(formatDate(date));
}
