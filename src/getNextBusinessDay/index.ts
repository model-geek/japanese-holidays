import type { DateInput } from '../types.js';
import { isBusinessDay } from '../isBusinessDay/index.js';
import { findNext } from '../_internal/dateTraversal.js';
import { addDays } from '../_internal/addDays.js';
import { toJstDate } from '../_internal/jst.js';

/**
 * 次の営業日を返す（当日が営業日でも翌営業日を返す）
 *
 * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
 * @returns 次の営業日の Date オブジェクト
 *
 * @example
 * ```typescript
 * getNextBusinessDay('2025-01-06');
 * // => Date（2025-01-07）
 *
 * getNextBusinessDay('2025-01-03');
 * // => Date（2025-01-06）（土日をスキップ）
 * ```
 */
export function getNextBusinessDay(date: DateInput): Date {
  return findNext(addDays(toJstDate(date), 1), isBusinessDay);
}
