import type { DateInput } from '../types.ts';
import { isBusinessDay } from '../isBusinessDay/index.ts';
import { advance } from '../_internal/dateTraversal.ts';
import { toJstDate } from '../_internal/jst.ts';

/**
 * 指定した日付から n 営業日後の日付を返す
 *
 * @param date - 基準日（Date または YYYY-MM-DD 形式の文字列）
 * @param days - 加算する営業日数
 * @returns n 営業日後の Date オブジェクト
 *
 * @example
 * ```typescript
 * addBusinessDays('2025-01-06', 1);
 * // => Date（2025-01-07）
 *
 * addBusinessDays('2025-01-03', 1);
 * // => Date（2025-01-06）（土日をスキップ）
 * ```
 */
export function addBusinessDays(date: DateInput, days: number): Date {
  return advance(toJstDate(date), days, isBusinessDay);
}
