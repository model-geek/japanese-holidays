/**
 * デフォルトエントリポイント
 * 祝日判定のみ。祝日名のデータを含まない。
 */
import { holidayDates } from './_data/holidayDates.js';
import { createIsNationalHoliday } from './isNationalHoliday/index.js';
import { isWeekend } from './isWeekend/index.js';
import { createIsHoliday } from './isHoliday/index.js';

const isNationalHoliday = createIsNationalHoliday(holidayDates);
const isHoliday = createIsHoliday(isWeekend, isNationalHoliday);

export { isNationalHoliday, isWeekend, isHoliday };
export type { DateInput } from './_internal/types.js';
