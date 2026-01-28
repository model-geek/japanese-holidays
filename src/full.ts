/**
 * full エントリポイント
 * 祝日判定と祝日名の取得が可能。
 */
import { holidayNames } from './_data/holidayNames.js';
import { createIsNationalHoliday } from './isNationalHoliday/index.js';
import { createGetHolidayName } from './getHolidayName/index.js';
import { isWeekend } from './isWeekend/index.js';
import { createIsHoliday } from './isHoliday/index.js';
import { createGetHolidaysInRange } from './getHolidaysInRange/index.js';

const isNationalHoliday = createIsNationalHoliday(holidayNames);
const isHoliday = createIsHoliday(isWeekend, isNationalHoliday);
const getHolidayName = createGetHolidayName(holidayNames);
const getHolidaysInRange = createGetHolidaysInRange(holidayNames);

export { isNationalHoliday, isWeekend, isHoliday, getHolidayName, getHolidaysInRange };
export type { DateInput } from './_internal/types.js';
export type { Holiday } from './getHolidaysInRange/index.js';
