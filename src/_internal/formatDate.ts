import type { DateInput } from './types.js';
import { toJstDate } from './toJstDate.js';

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
  const d = toJstDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
