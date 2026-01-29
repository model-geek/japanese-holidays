/**
 * full エントリポイント
 * 祝日判定と祝日名の取得が可能。
 */
import { holidayNames } from './_data/holidayNames.js';
import { isNationalHoliday2 as isNationalHoliday } from './isNationalHoliday2/index.js';
import { isHoliday } from './isHoliday/index.js';
import { isBusinessDay } from './isBusinessDay/index.js';
import { addBusinessDays } from './addBusinessDays/index.js';
import { subBusinessDays } from './subBusinessDays/index.js';
import { getNextBusinessDay } from './getNextBusinessDay/index.js';
import { getPreviousBusinessDay } from './getPreviousBusinessDay/index.js';
import { countBusinessDays } from './countBusinessDays/index.js';
import { getLastBusinessDayOfMonth } from './getLastBusinessDayOfMonth/index.js';
import { getLastBusinessDayOfWeek } from './getLastBusinessDayOfWeek/index.js';
import { createGetHolidayName } from './getHolidayName/index.js';
import { createGetHolidaysInRange } from './getHolidaysInRange/index.js';
import { isWeekend } from './isWeekend/index.js';

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
