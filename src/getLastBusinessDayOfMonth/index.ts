import type { DateInput } from '../types.ts';
import { isBusinessDay } from '../isBusinessDay/index.ts';
import { getPreviousBusinessDay } from '../getPreviousBusinessDay/index.ts';
import { getEndOfMonth } from '../_internal/getEndOfMonth.ts';

/**
 * 指定した日付の月の最終営業日を返す
 *
 * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
 * @returns 月の最終営業日の Date オブジェクト
 *
 * @example
 * ```typescript
 * getLastBusinessDayOfMonth('2025-01-15');
 * // => Date（2025-01-31）（金曜日）
 *
 * getLastBusinessDayOfMonth('2025-05-15');
 * // => Date（2025-05-30）（土曜なので前日の金曜）
 * ```
 */
export function getLastBusinessDayOfMonth(date: DateInput): Date {
  const endOfMonth = getEndOfMonth(date);
  if (isBusinessDay(endOfMonth)) {
    return endOfMonth;
  }
  return getPreviousBusinessDay(endOfMonth);
}
