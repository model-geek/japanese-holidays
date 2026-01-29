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
  SPECIAL_HOLIDAYS,
  HOLIDAY_LAW_START_YEAR,
  SUBSTITUTE_HOLIDAY_START,
  CITIZENS_HOLIDAY_START_YEAR,
  HOLIDAY_START_YEARS,
  OLYMPIC_SPECIAL_YEARS,
  FIXED_HOLIDAY_DATES,
  HAPPY_MONDAY_RULES,
} from '../_data/rules.ts';

/**
 * 指定した日付の「国民の祝日」名（振替休日・国民の休日を除く）を返す
 */
function getDefinedHolidayName(year: number, month: number, day: number): string | undefined {
  // 特別な一回限りの祝日
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const specialHoliday = SPECIAL_HOLIDAYS.get(dateStr);
  if (specialHoliday) {
    return specialHoliday;
  }

  // オリンピック特例年の処理
  const olympicRules = OLYMPIC_SPECIAL_YEARS.get(year);
  if (olympicRules) {
    if (month === olympicRules.marineDay[0] && day === olympicRules.marineDay[1]) return '海の日';
    if (month === olympicRules.sportsDay[0] && day === olympicRules.sportsDay[1]) return 'スポーツの日';
    if (month === olympicRules.mountainDay[0] && day === olympicRules.mountainDay[1]) return '山の日';
  }

  switch (month) {
    case 1:
      // 元日: 1月1日
      if (
        day === FIXED_HOLIDAY_DATES.newYearsDay.day &&
        year >= HOLIDAY_START_YEARS.newYearsDay
      ) {
        return '元日';
      }
      // 成人の日: 1月15日 (1949-1999), 第2月曜 (2000-)
      if (year >= HOLIDAY_START_YEARS.comingOfAgeDayHappyMonday) {
        const rule = HAPPY_MONDAY_RULES.comingOfAgeDay;
        if (day === getNthWeekday(year, rule.month, rule.weekday, rule.n)) return '成人の日';
      } else if (year >= HOLIDAY_START_YEARS.comingOfAgeDay) {
        if (day === FIXED_HOLIDAY_DATES.comingOfAgeDayFixed.day) return '成人の日';
      }
      break;

    case 2:
      // 建国記念の日: 2月11日 (1967-)
      if (
        day === FIXED_HOLIDAY_DATES.nationalFoundationDay.day &&
        year >= HOLIDAY_START_YEARS.nationalFoundationDay
      ) {
        return '建国記念の日';
      }
      // 天皇誕生日: 2月23日 (2020-)
      if (
        day === FIXED_HOLIDAY_DATES.emperorsBirthdayReiwa.day &&
        year >= HOLIDAY_START_YEARS.emperorsBirthdayReiwa
      ) {
        return '天皇誕生日';
      }
      break;

    case 3:
      // 春分の日
      if (day === calculateVernalEquinox(year) && year >= HOLIDAY_START_YEARS.vernalEquinoxDay) {
        return '春分の日';
      }
      break;

    case 4:
      // 天皇誕生日: 4月29日 (1949-1988)
      // みどりの日: 4月29日 (1989-2006)
      // 昭和の日: 4月29日 (2007-)
      if (day === FIXED_HOLIDAY_DATES.showaDay.day) {
        if (year >= HOLIDAY_START_YEARS.showaDay) return '昭和の日';
        if (year >= HOLIDAY_START_YEARS.greenDayApril) return 'みどりの日';
        if (year >= HOLIDAY_START_YEARS.emperorsBirthdayShowa) return '天皇誕生日';
      }
      break;

    case 5:
      // 憲法記念日: 5月3日
      if (
        day === FIXED_HOLIDAY_DATES.constitutionDay.day &&
        year >= HOLIDAY_START_YEARS.constitutionDay
      ) {
        return '憲法記念日';
      }
      // みどりの日: 5月4日 (2007-)
      // 1986-2006 は国民の休日として扱われる
      if (
        day === FIXED_HOLIDAY_DATES.greenDay.day &&
        year >= HOLIDAY_START_YEARS.greenDayMay
      ) {
        return 'みどりの日';
      }
      // こどもの日: 5月5日
      if (
        day === FIXED_HOLIDAY_DATES.childrensDay.day &&
        year >= HOLIDAY_START_YEARS.childrensDay
      ) {
        return 'こどもの日';
      }
      break;

    case 7:
      // オリンピック特例年は上で処理済み
      if (olympicRules) break;
      // 海の日: 7月20日 (1996-2002), 第3月曜 (2003-)
      if (year >= HOLIDAY_START_YEARS.marineDayHappyMonday) {
        const rule = HAPPY_MONDAY_RULES.marineDay;
        if (day === getNthWeekday(year, rule.month, rule.weekday, rule.n)) return '海の日';
      } else if (year >= HOLIDAY_START_YEARS.marineDay) {
        if (day === FIXED_HOLIDAY_DATES.marineDayFixed.day) return '海の日';
      }
      break;

    case 8:
      // オリンピック特例年は上で処理済み
      if (olympicRules) break;
      // 山の日: 8月11日 (2016-)
      if (
        day === FIXED_HOLIDAY_DATES.mountainDay.day &&
        year >= HOLIDAY_START_YEARS.mountainDay
      ) {
        return '山の日';
      }
      break;

    case 9:
      // 敬老の日: 9月15日 (1966-2002), 第3月曜 (2003-)
      if (year >= HOLIDAY_START_YEARS.respectForTheAgedDayHappyMonday) {
        const rule = HAPPY_MONDAY_RULES.respectForTheAgedDay;
        if (day === getNthWeekday(year, rule.month, rule.weekday, rule.n)) return '敬老の日';
      } else if (year >= HOLIDAY_START_YEARS.respectForTheAgedDay) {
        if (day === FIXED_HOLIDAY_DATES.respectForTheAgedDayFixed.day) return '敬老の日';
      }
      // 秋分の日
      if (day === calculateAutumnalEquinox(year) && year >= HOLIDAY_START_YEARS.autumnalEquinoxDay) {
        return '秋分の日';
      }
      break;

    case 10:
      // オリンピック特例年は7月に移動済み
      if (olympicRules) break;
      // 体育の日/スポーツの日: 10月10日 (1966-1999), 第2月曜 (2000-)
      if (year >= HOLIDAY_START_YEARS.sportsDayRename) {
        const rule = HAPPY_MONDAY_RULES.sportsDay;
        if (day === getNthWeekday(year, rule.month, rule.weekday, rule.n)) return 'スポーツの日';
      } else if (year === 2019) {
        // 2019年は名称変更直前で「体育の日（スポーツの日）」と記載
        const rule = HAPPY_MONDAY_RULES.sportsDay;
        if (day === getNthWeekday(year, rule.month, rule.weekday, rule.n)) return '体育の日（スポーツの日）';
      } else if (year >= HOLIDAY_START_YEARS.sportsDayHappyMonday) {
        const rule = HAPPY_MONDAY_RULES.sportsDay;
        if (day === getNthWeekday(year, rule.month, rule.weekday, rule.n)) return '体育の日';
      } else if (year >= HOLIDAY_START_YEARS.sportsDay) {
        if (day === FIXED_HOLIDAY_DATES.sportsDayFixed.day) return '体育の日';
      }
      break;

    case 11:
      // 文化の日: 11月3日
      if (
        day === FIXED_HOLIDAY_DATES.cultureDay.day &&
        year >= HOLIDAY_START_YEARS.cultureDay
      ) {
        return '文化の日';
      }
      // 勤労感謝の日: 11月23日
      if (
        day === FIXED_HOLIDAY_DATES.laborThanksgivingDay.day &&
        year >= HOLIDAY_START_YEARS.laborThanksgivingDay
      ) {
        return '勤労感謝の日';
      }
      break;

    case 12:
      // 天皇誕生日: 12月23日 (1989-2018)
      if (
        day === FIXED_HOLIDAY_DATES.emperorsBirthdayHeisei.day &&
        year >= HOLIDAY_START_YEARS.emperorsBirthdayHeiseiStart &&
        year <= HOLIDAY_START_YEARS.emperorsBirthdayHeiseiEnd
      ) {
        return '天皇誕生日';
      }
      break;
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
  // 振替休日制度は1973年4月12日施行
  if (year < SUBSTITUTE_HOLIDAY_START.year) return false;
  if (
    year === SUBSTITUTE_HOLIDAY_START.year &&
    (month < SUBSTITUTE_HOLIDAY_START.month ||
      (month === SUBSTITUTE_HOLIDAY_START.month && day < SUBSTITUTE_HOLIDAY_START.day))
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
  if (year < CITIZENS_HOLIDAY_START_YEAR) return false;

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
