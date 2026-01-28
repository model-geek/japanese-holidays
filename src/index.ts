/**
 * デフォルトエントリポイント
 * 祝日判定のみ。祝日名のデータを含まない。
 */
import { holidayDates } from './_data/holidayDates.js';
import { createIsNationalHoliday } from './isNationalHoliday/index.js';
import { createIsHoliday } from './isHoliday/index.js';
import { createIsBusinessDay } from './isBusinessDay/index.js';
import { isWeekend } from './isWeekend/index.js';

const isNationalHoliday = createIsNationalHoliday(holidayDates);
const isHoliday = createIsHoliday(holidayDates);
const isBusinessDay = createIsBusinessDay(holidayDates);

export { isNationalHoliday, isWeekend, isHoliday, isBusinessDay };
export type { DateInput } from './types.js';
