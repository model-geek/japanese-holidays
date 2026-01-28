/**
 * full エントリポイント
 * 祝日判定と祝日名の取得が可能。
 */
import { holidayNames } from './_data/holidayNames.js';
import { createIsNationalHoliday } from './isNationalHoliday/index.js';
import { createIsHoliday } from './isHoliday/index.js';
import { createIsBusinessDay } from './isBusinessDay/index.js';
import { createGetHolidayName } from './getHolidayName/index.js';
import { createGetHolidaysInRange } from './getHolidaysInRange/index.js';
import { isWeekend } from './isWeekend/index.js';

const isNationalHoliday = createIsNationalHoliday(holidayNames);
const isHoliday = createIsHoliday(holidayNames);
const isBusinessDay = createIsBusinessDay(holidayNames);
const getHolidayName = createGetHolidayName(holidayNames);
const getHolidaysInRange = createGetHolidaysInRange(holidayNames);

export { isNationalHoliday, isWeekend, isHoliday, isBusinessDay, getHolidayName, getHolidaysInRange };
export type { DateInput, Holiday } from './types.js';
