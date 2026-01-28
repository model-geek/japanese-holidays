/**
 * light エントリポイント
 * 祝日判定のみ。祝日名のデータを含まない。
 */
import { createIsHoliday } from './core.ts';
import { holidayDates } from './data/holiday-dates.ts';

export const isHoliday = createIsHoliday(holidayDates);
export type { DateInput } from './types.ts';
