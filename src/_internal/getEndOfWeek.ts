import type { DateInput } from '../types.ts';
import { addDays } from './addDays.ts';
import { getJstDay } from './jst.ts';

/**
 * 指定した日付の週の金曜日を返す
 *
 * 週は月曜始まりとして扱い、金曜日を週末日とする。
 * - 月〜金曜日: その週の金曜日を返す
 * - 土曜日: 前の金曜日を返す
 * - 日曜日: 次の金曜日を返す
 *
 * @param date - 基準日
 * @returns 金曜日の Date オブジェクト（JST の 00:00:00）
 *
 * @example
 * ```typescript
 * getEndOfWeek('2025-01-06'); // 月曜日
 * // => JST の 2025-01-10 00:00:00（金曜日）
 *
 * getEndOfWeek('2025-01-11'); // 土曜日
 * // => JST の 2025-01-10 00:00:00（前の金曜日）
 * ```
 */
export function getEndOfWeek(date: DateInput): Date {
  const day = getJstDay(date);
  // 日曜(0)→+5, 月曜(1)→+4, 火曜(2)→+3, 水曜(3)→+2, 木曜(4)→+1, 金曜(5)→0, 土曜(6)→-1
  const daysUntilFriday = day === 0 ? 5 : 5 - day;
  return addDays(date, daysUntilFriday);
}
