import type { DateInput } from '../types.ts';
import {
  getJstFullYear,
  getJstMonth,
  getJstDate,
  getJstDay,
  createJstDate,
  getNthWeekday,
} from '../_internal/jst.ts';
import { addDays } from '../_internal/addDays.ts';
import {
  calculateVernalEquinox,
  calculateAutumnalEquinox,
} from '../_internal/equinox.ts';
import {
  HOLIDAY_LAW_START_YEAR,
  getRulesetForYear,
  type HolidayRule,
} from '../_data/rules.ts';

/**
 * 指定した日付の「国民の祝日」名（振替休日・国民の休日を除く）を返す
 */
function getDefinedHolidayName(year: number, month: number, day: number): string | undefined {
  const ruleset = getRulesetForYear(year);

  // 特別な一回限りの祝日
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const specialHoliday = ruleset.specials.get(dateStr);
  if (specialHoliday) {
    return specialHoliday;
  }

  // オリンピック特例年の処理
  const olympicException = ruleset.olympicException;
  if (olympicException) {
    for (const moved of olympicException) {
      if (month === moved.month && day === moved.day) {
        return moved.name;
      }
    }
  }

  // ルールセットから該当する祝日を検索
  for (const rule of ruleset.rules) {
    const name = matchRule(rule, year, month, day, olympicException);
    if (name) {
      return name;
    }
  }

  return undefined;
}

/**
 * オリンピック特例で移動された祝日か判定する
 */
function isMovedByOlympicException(
  name: string,
  olympicException: readonly { name: string; month: number; day: number }[] | null
): boolean {
  if (!olympicException) return false;
  return olympicException.some((moved) => moved.name === name);
}

/**
 * ルールが指定した日付に一致するか判定し、一致すれば祝日名を返す
 */
function matchRule(
  rule: HolidayRule,
  year: number,
  month: number,
  day: number,
  olympicException: readonly { name: string; month: number; day: number }[] | null
): string | undefined {
  // オリンピック特例で移動された祝日は通常ルールをスキップ
  if (isMovedByOlympicException(rule.name, olympicException)) {
    return undefined;
  }

  switch (rule.type) {
    case 'fixed': {
      if (rule.month === month && rule.day === day) {
        return rule.name;
      }
      break;
    }
    case 'happyMonday': {
      if (rule.month === month) {
        const nthDay = getNthWeekday(year, rule.month, rule.weekday, rule.n);
        if (day === nthDay) {
          return rule.name;
        }
      }
      break;
    }
    case 'equinox': {
      if (rule.kind === 'vernal' && month === 3) {
        if (day === calculateVernalEquinox(year)) {
          return rule.name;
        }
      } else if (rule.kind === 'autumnal' && month === 9) {
        if (day === calculateAutumnalEquinox(year)) {
          return rule.name;
        }
      }
      break;
    }
  }
  return undefined;
}

/**
 * 指定した日付が「国民の祝日」（振替休日・国民の休日を除く）かどうかを判定する
 */
function isDefinedHoliday(year: number, month: number, day: number): boolean {
  return getDefinedHolidayName(year, month, day) !== undefined;
}

/**
 * 指定した日付が振替休日かどうかを判定する
 *
 * 振替休日: 祝日が日曜日に当たるとき、その日以降の最初の平日を休日とする
 * （1973年4月12日施行）
 */
function isSubstituteHoliday(year: number, month: number, day: number): boolean {
  const ruleset = getRulesetForYear(year);
  const substituteStart = ruleset.substituteHolidayStart;

  // 振替休日制度施行前
  if (!substituteStart) return false;
  if (year < substituteStart.year) return false;
  if (
    year === substituteStart.year &&
    (month < substituteStart.month ||
      (month === substituteStart.month && day < substituteStart.day))
  ) {
    return false;
  }

  const date = createJstDate(year, month - 1, day);
  const weekday = getJstDay(date);

  // 振替休日は月曜日以降（日曜日ではない）
  if (weekday === 0) return false;

  // 前日から遡って日曜日の祝日を探す
  let checkDate = addDays(date, -1);
  while (getJstDay(checkDate) !== 0) {
    // 遡った日が祝日でなければ振替休日ではない
    const checkYear = getJstFullYear(checkDate);
    const checkMonth = getJstMonth(checkDate) + 1;
    const checkDay = getJstDate(checkDate);

    if (!isDefinedHoliday(checkYear, checkMonth, checkDay)) {
      return false;
    }

    checkDate = addDays(checkDate, -1);
  }

  // 日曜日まで遡れた場合、その日曜日が祝日かどうか確認
  const sundayYear = getJstFullYear(checkDate);
  const sundayMonth = getJstMonth(checkDate) + 1;
  const sundayDay = getJstDate(checkDate);

  return isDefinedHoliday(sundayYear, sundayMonth, sundayDay);
}

/**
 * 指定した日付が国民の休日かどうかを判定する
 *
 * 国民の休日: 祝日と祝日に挟まれた平日（1986年施行）
 */
function isCitizensHoliday(year: number, month: number, day: number): boolean {
  const ruleset = getRulesetForYear(year);

  if (!ruleset.citizensHolidayEnabled) return false;

  const date = createJstDate(year, month - 1, day);
  const weekday = getJstDay(date);

  // 日曜日は国民の休日にならない（振替休日の対象になる）
  if (weekday === 0) return false;

  // 当日が祝日の場合は国民の休日ではない
  if (isDefinedHoliday(year, month, day)) return false;

  // 前日と翌日が祝日かどうか確認
  const prevDate = addDays(date, -1);
  const nextDate = addDays(date, 1);

  const prevYear = getJstFullYear(prevDate);
  const prevMonth = getJstMonth(prevDate) + 1;
  const prevDay = getJstDate(prevDate);

  const nextYear = getJstFullYear(nextDate);
  const nextMonth = getJstMonth(nextDate) + 1;
  const nextDay = getJstDate(nextDate);

  const prevIsHoliday = isDefinedHoliday(prevYear, prevMonth, prevDay);
  const nextIsHoliday = isDefinedHoliday(nextYear, nextMonth, nextDay);

  return prevIsHoliday && nextIsHoliday;
}

/**
 * 指定した日付の祝日名を返す
 *
 * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
 * @returns 祝日名（祝日でない場合は undefined）
 *
 * @example
 * ```typescript
 * getHolidayName('2025-01-01');
 * // => '元日'
 *
 * getHolidayName('2025-01-13');
 * // => '成人の日'
 *
 * getHolidayName('2025-02-24');
 * // => '休日'
 *
 * getHolidayName('2025-01-02');
 * // => undefined
 * ```
 */
export function getHolidayName(date: DateInput): string | undefined {
  const year = getJstFullYear(date);
  const month = getJstMonth(date) + 1;
  const day = getJstDate(date);

  // 祝日法施行前（1948年以前）は祝日なし
  if (year < HOLIDAY_LAW_START_YEAR) return undefined;

  // 国民の祝日
  const holidayName = getDefinedHolidayName(year, month, day);
  if (holidayName) return holidayName;

  // 振替休日・国民の休日（内閣府データでは両方とも「休日」）
  if (isSubstituteHoliday(year, month, day)) return '休日';
  if (isCitizensHoliday(year, month, day)) return '休日';

  return undefined;
}
