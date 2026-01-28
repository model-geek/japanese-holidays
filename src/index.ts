/**
 * デフォルトエントリポイント
 * 祝日判定のみ。祝日名のデータを含まない。
 */
import { holidayDates } from './_data/holidayDates.js';
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
import { isWeekend } from './isWeekend/index.js';

const isNationalHoliday = createIsNationalHoliday(holidayDates);
const isHoliday = createIsHoliday(holidayDates);
const isBusinessDay = createIsBusinessDay(holidayDates);
const addBusinessDays = createAddBusinessDays(holidayDates);
const subBusinessDays = createSubBusinessDays(holidayDates);
const getNextBusinessDay = createGetNextBusinessDay(holidayDates);
const getPreviousBusinessDay = createGetPreviousBusinessDay(holidayDates);
const countBusinessDays = createCountBusinessDays(holidayDates);
const getLastBusinessDayOfMonth = createGetLastBusinessDayOfMonth(holidayDates);
const getLastBusinessDayOfWeek = createGetLastBusinessDayOfWeek(holidayDates);

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
};
export type { DateInput } from './types.js';
