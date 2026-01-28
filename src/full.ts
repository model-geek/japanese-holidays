/**
 * full エントリポイント
 * 祝日判定と祝日名の取得が可能。
 */
import { holidayNames } from './_data/holidayNames.js';
import { createIsNationalHoliday } from './isNationalHoliday/index.js';
import { createGetHolidayName } from './getHolidayName/index.js';
import { isWeekend } from './isWeekend/index.js';

export const isNationalHoliday = createIsNationalHoliday(holidayNames);
export const getHolidayName = createGetHolidayName(holidayNames);
export { isWeekend };
export type { DateInput } from './_internal/types.js';
