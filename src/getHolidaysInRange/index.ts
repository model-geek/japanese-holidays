import type { DateInput, Holiday } from '../types.js';
import { formatDate } from '../_internal/formatDate.js';
import { addDays } from '../_internal/addDays.js';
import { getHolidayName2 } from '../getHolidayName2/index.js';

/**
 * 期間内の祝日一覧を返す
 *
 * @param start - 開始日（Date または YYYY-MM-DD 形式の文字列）
 * @param end - 終了日（Date または YYYY-MM-DD 形式の文字列）
 * @returns 祝日の配列（日付昇順）
 *
 * @example
 * ```typescript
 * getHolidaysInRange('2025-01-01', '2025-01-31');
 * // => [{ date: '2025-01-01', name: '元日' }, { date: '2025-01-13', name: '成人の日' }]
 *
 * getHolidaysInRange(new Date(2025, 0, 1), new Date(2025, 0, 31));
 * // => [{ date: '2025-01-01', name: '元日' }, { date: '2025-01-13', name: '成人の日' }]
 * ```
 */
export function getHolidaysInRange(start: DateInput, end: DateInput): Holiday[] {
  const startStr = formatDate(start);
  const endStr = formatDate(end);

  const result: Holiday[] = [];

  // 開始日から終了日まで走査
  let currentStr = startStr;
  while (currentStr <= endStr) {
    const name = getHolidayName2(currentStr);
    if (name !== undefined) {
      result.push({ date: currentStr, name });
    }
    // 次の日へ
    const nextDate = addDays(currentStr, 1);
    currentStr = formatDate(nextDate);
  }

  return result;
}
