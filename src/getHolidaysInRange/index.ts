import type { DateInput, Holiday, HolidayNameLookup } from '../types.js';
import { formatDate } from '../_internal/formatDate.js';

/**
 * getHolidaysInRange 関数を生成する
 *
 * @param holidayNames - 祝日名のマップ
 * @returns getHolidaysInRange 関数
 *
 * @example
 * ```typescript
 * const getHolidaysInRange = createGetHolidaysInRange(holidayNames);
 * getHolidaysInRange('2025-01-01', '2025-01-31');
 * // => [{ date: '2025-01-01', name: '元日' }, { date: '2025-01-13', name: '成人の日' }]
 * ```
 */
export function createGetHolidaysInRange(holidayNames: HolidayNameLookup) {
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
  return function getHolidaysInRange(
    start: DateInput,
    end: DateInput,
  ): Holiday[] {
    const startStr = formatDate(start);
    const endStr = formatDate(end);

    const result: Holiday[] = [];
    for (const [date, name] of holidayNames.entries()) {
      if (date >= startStr && date <= endStr) {
        result.push({ date, name });
      }
    }

    return result.sort((a, b) => a.date.localeCompare(b.date));
  };
}
