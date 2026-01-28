import { holidayDates } from './data/holiday-dates.js';
import type { DateInput } from './types.js';

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換する
 */
function formatDate(date: DateInput): string {
  if (typeof date === 'string') {
    return date;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 指定した日付が祝日かどうかを判定する
 */
export function isHoliday(date: DateInput): boolean {
  return holidayDates.has(formatDate(date));
}
