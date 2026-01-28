/**
 * デフォルトエントリポイント
 * 祝日判定のみ。祝日名のデータを含まない。
 */
import { holidayDates } from './_data/holidayDates.js';
import { createIsNationalHoliday } from './isNationalHoliday/index.js';
import { isWeekend } from './isWeekend/index.js';

export const isNationalHoliday = createIsNationalHoliday(holidayDates);
export { isWeekend };
export type { DateInput } from './_internal/types.js';
