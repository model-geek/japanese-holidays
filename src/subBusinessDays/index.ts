import type { DateInput } from '../types.ts';
import { isBusinessDay } from '../isBusinessDay/index.ts';
import { rewind } from '../_internal/dateTraversal.ts';
import { toJstDate } from '../_internal/jst.ts';

/**
 * 指定した日付から n 営業日前の日付を返す
 *
 * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
 * @param days - 減算する営業日数
 * @returns n 営業日前の Date オブジェクト
 *
 * @example
 * ```typescript
 * subBusinessDays('2025-01-07', 1);
 * // => Date（2025-01-06）
 *
 * subBusinessDays('2025-01-06', 1);
 * // => Date（2025-01-03）（土日をスキップ）
 * ```
 */
export function subBusinessDays(date: DateInput, days: number): Date {
  return rewind(toJstDate(date), days, isBusinessDay);
}
