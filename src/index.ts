/**
 * デフォルトエントリポイント
 * 祝日判定のみ。祝日名のデータを含まない。
 */
import { createIsHoliday } from './_internal/createIsHoliday.js';
import { holidayDates } from './_data/holidayDates.js';

export const isHoliday = createIsHoliday(holidayDates);
export type { DateInput } from './_internal/types.js';
