import type { DateInput } from '../types.ts';
import { isHoliday } from '../isHoliday/index.ts';

/**
 * 指定した日付が営業日（祝日でも土日でもない）かどうかを判定する
 *
 * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
 * @returns 営業日の場合は true
 *
 * @example
 * ```typescript
 * isBusinessDay('2025-01-06');
 * // => true（月曜日、祝日でない）
 *
 * isBusinessDay('2025-01-01');
 * // => false（元日）
 *
 * isBusinessDay('2025-01-04');
 * // => false（土曜日）
 * ```
 */
export function isBusinessDay(date: DateInput): boolean {
  return !isHoliday(date);
}
