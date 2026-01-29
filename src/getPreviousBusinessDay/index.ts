import type { DateInput } from '../types.ts';
import { isBusinessDay } from '../isBusinessDay/index.ts';
import { findPrev } from '../_internal/dateTraversal.ts';
import { addDays } from '../_internal/addDays.ts';
import { toJstDate } from '../_internal/jst.ts';

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
export function getPreviousBusinessDay(date: DateInput): Date {
  return findPrev(addDays(toJstDate(date), -1), isBusinessDay);
}
