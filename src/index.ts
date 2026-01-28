/**
 * full エントリポイント
 * 祝日判定と祝日名の取得が可能。
 */
import { createIsHoliday } from './core.ts';
import { holidayNames } from './data/holiday-names.ts';

export const isHoliday = createIsHoliday(holidayNames);
export type { DateInput } from './types.ts';

// 祝日名取得関数は #9 で実装する
