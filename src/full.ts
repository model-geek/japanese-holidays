/**
 * full エントリポイント
 * 祝日判定と祝日名の取得が可能。
 */
import { createIsHoliday } from './_internal/createIsHoliday.js';
import { holidayNames } from './_data/holidayNames.js';

export const isHoliday = createIsHoliday(holidayNames);
export type { DateInput } from './_internal/types.js';

// 祝日名取得関数は #9 で実装する
