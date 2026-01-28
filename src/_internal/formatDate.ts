import type { DateInput } from '../types.js';
import { getJstFullYear, getJstMonth, getJstDate } from './jst.js';

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換する
 *
 * Date オブジェクトの場合、JST での日付を返す。
 *
 * @param date - 変換する日付
 * @returns YYYY-MM-DD 形式の文字列
 *
 * @example
 * ```typescript
 * formatDate(new Date('2024-12-31T15:00:00.000Z'));
 * // => '2025-01-01'（JST での日付）
 *
 * formatDate('2025-01-01');
 * // => '2025-01-01'
 * ```
 */
export function formatDate(date: DateInput): string {
  if (typeof date === 'string') {
    return date;
  }
  const year = getJstFullYear(date);
  const month = String(getJstMonth(date) + 1).padStart(2, '0');
  const day = String(getJstDate(date)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
