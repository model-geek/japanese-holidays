import type { DateInput } from '../types.ts';
import { isBusinessDay } from '../isBusinessDay/index.ts';
import { count } from '../_internal/dateTraversal.ts';
import { toJstDate } from '../_internal/jst.ts';

/**
 * 2つの日付間の営業日数をカウントする
 *
 * start と end の両方を含む範囲でカウントする。
 * start > end の場合は負の値を返す。
 *
 * @param start - 開始日（Date または YYYY-MM-DD 形式の文字列）
 * @param end - 終了日（Date または YYYY-MM-DD 形式の文字列）
 * @returns 営業日数（start > end の場合は負の値）
 *
 * @example
 * ```typescript
 * countBusinessDays('2025-01-06', '2025-01-10');
 * // => 5（月〜金の 5 営業日）
 *
 * countBusinessDays('2025-01-03', '2025-01-06');
 * // => 2（金と月の 2 営業日、土日を除く）
 * ```
 */
export function countBusinessDays(start: DateInput, end: DateInput): number {
  const startDate = toJstDate(start);
  const endDate = toJstDate(end);
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  if (startTime === endTime) {
    return isBusinessDay(startDate) ? 1 : 0;
  }

  const isReversed = startTime > endTime;
  const from = isReversed ? endDate : startDate;
  const to = isReversed ? startDate : endDate;
  const result = count(from, to, isBusinessDay, 0);

  return isReversed ? -result : result;
}
