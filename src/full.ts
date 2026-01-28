/**
 * full エントリポイント
 * 祝日判定と祝日名の取得が可能。
 */
import { holidayNames } from './_data/holidayNames.js';
import { createIsNationalHoliday } from './isNationalHoliday/index.js';
import { createIsHoliday } from './isHoliday/index.js';
import { createIsBusinessDay } from './isBusinessDay/index.js';
import { createAddBusinessDays } from './addBusinessDays/index.js';
import { createSubBusinessDays } from './subBusinessDays/index.js';
import { createGetNextBusinessDay } from './getNextBusinessDay/index.js';
import { createGetPreviousBusinessDay } from './getPreviousBusinessDay/index.js';
import { createCountBusinessDays } from './countBusinessDays/index.js';
import { createGetLastBusinessDayOfMonth } from './getLastBusinessDayOfMonth/index.js';
import { createGetLastBusinessDayOfWeek } from './getLastBusinessDayOfWeek/index.js';
import { createGetHolidayName } from './getHolidayName/index.js';
import { createGetHolidaysInRange } from './getHolidaysInRange/index.js';
import { isWeekend } from './isWeekend/index.js';

const isNationalHoliday = createIsNationalHoliday(holidayNames);
const isHoliday = createIsHoliday(holidayNames);
const isBusinessDay = createIsBusinessDay(holidayNames);
const addBusinessDays = createAddBusinessDays(holidayNames);
const subBusinessDays = createSubBusinessDays(holidayNames);
const getNextBusinessDay = createGetNextBusinessDay(holidayNames);
const getPreviousBusinessDay = createGetPreviousBusinessDay(holidayNames);
const countBusinessDays = createCountBusinessDays(holidayNames);
const getLastBusinessDayOfMonth = createGetLastBusinessDayOfMonth(holidayNames);
const getLastBusinessDayOfWeek = createGetLastBusinessDayOfWeek(holidayNames);
const getHolidayName = createGetHolidayName(holidayNames);
const getHolidaysInRange = createGetHolidaysInRange(holidayNames);

export {
  isNationalHoliday,
  isWeekend,
  isHoliday,
  isBusinessDay,
  addBusinessDays,
  subBusinessDays,
  getNextBusinessDay,
  getPreviousBusinessDay,
  countBusinessDays,
  getLastBusinessDayOfMonth,
  getLastBusinessDayOfWeek,
  getHolidayName,
  getHolidaysInRange,
};
export type { DateInput, Holiday } from './types.js';
