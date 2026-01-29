import type { DateInput } from '../types.ts';
import { formatDate } from '../_internal/formatDate.ts';
import {
  getJstFullYear,
  getJstMonth,
  getJstDate,
  getJstDay,
  createJstDate,
} from '../_internal/jst.ts';
import { addDays } from '../_internal/addDays.ts';

/**
 * 特別な一回限りの祝日
 */
const SPECIAL_HOLIDAYS: ReadonlySet<string> = new Set([
  '1959-04-10', // 皇太子明仁親王の結婚の儀
  '1989-02-24', // 昭和天皇の大喪の礼
  '1990-11-12', // 即位礼正殿の儀
  '1993-06-09', // 皇太子徳仁親王の結婚の儀
  '2019-05-01', // 天皇の即位の日
  '2019-10-22', // 即位礼正殿の儀
]);

/**
 * 指定した月の第 n 週目の特定曜日の日付を取得する
 *
 * @param year - 年
 * @param month - 月（1-12）
 * @param weekday - 曜日（0: 日曜, 1: 月曜, ..., 6: 土曜）
 * @param n - 第何週目か（1-5）
 * @returns 日付（1-31）
 */
function getNthWeekday(
  year: number,
  month: number,
  weekday: number,
  n: number
): number {
  const firstDay = createJstDate(year, month - 1, 1);
  const firstWeekday = getJstDay(firstDay);

  // 最初の該当曜日までの日数
  let daysUntilFirst = weekday - firstWeekday;
  if (daysUntilFirst < 0) {
    daysUntilFirst += 7;
  }

  // 第 n 週目の該当曜日
  return 1 + daysUntilFirst + (n - 1) * 7;
}

/**
 * 春分日を計算する
 *
 * @param year - 年
 * @returns 春分日（3月の日付）
 *
 * @see https://www.nao.ac.jp/faq/a0301.html
 */
function calculateVernalEquinox(year: number): number {
  if (year < 1900 || year > 2099) {
    // 計算式の適用範囲外
    return 21;
  }

  if (year <= 1979) {
    return Math.floor(20.8357 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  }
  return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

/**
 * 秋分日を計算する
 *
 * @param year - 年
 * @returns 秋分日（9月の日付）
 *
 * @see https://www.nao.ac.jp/faq/a0301.html
 */
function calculateAutumnalEquinox(year: number): number {
  if (year < 1900 || year > 2099) {
    // 計算式の適用範囲外
    return 23;
  }

  if (year <= 1979) {
    return Math.floor(23.2588 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  }
  return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

/**
 * 指定した日付が「国民の祝日」（振替休日・国民の休日を除く）かどうかを判定する
 */
function isDefinedHoliday(year: number, month: number, day: number): boolean {
  // 特別な一回限りの祝日
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  if (SPECIAL_HOLIDAYS.has(dateStr)) {
    return true;
  }

  switch (month) {
    case 1:
      // 元日: 1月1日
      if (day === 1 && year >= 1949) return true;
      // 成人の日: 1月15日 (1949-1999), 第2月曜 (2000-)
      if (year >= 2000) {
        if (day === getNthWeekday(year, 1, 1, 2)) return true;
      } else if (year >= 1949) {
        if (day === 15) return true;
      }
      break;

    case 2:
      // 建国記念の日: 2月11日 (1967-)
      if (day === 11 && year >= 1967) return true;
      // 天皇誕生日: 2月23日 (2020-)
      if (day === 23 && year >= 2020) return true;
      break;

    case 3:
      // 春分の日
      if (day === calculateVernalEquinox(year) && year >= 1949) return true;
      break;

    case 4:
      // 天皇誕生日: 4月29日 (1949-1988)
      // みどりの日: 4月29日 (1989-2006)
      // 昭和の日: 4月29日 (2007-)
      if (day === 29 && year >= 1949) return true;
      break;

    case 5:
      // 憲法記念日: 5月3日
      if (day === 3 && year >= 1949) return true;
      // みどりの日: 5月4日 (2007-)
      if (day === 4 && year >= 2007) return true;
      // こどもの日: 5月5日
      if (day === 5 && year >= 1949) return true;
      break;

    case 7:
      // 海の日: 7月20日 (1996-2002), 第3月曜 (2003-)
      // スポーツの日: 2020年・2021年は特例で7月に移動
      if (year === 2020) {
        if (day === 23) return true; // 海の日
        if (day === 24) return true; // スポーツの日
      } else if (year === 2021) {
        if (day === 22) return true; // 海の日
        if (day === 23) return true; // スポーツの日
      } else if (year >= 2003) {
        if (day === getNthWeekday(year, 7, 1, 3)) return true;
      } else if (year >= 1996) {
        if (day === 20) return true;
      }
      break;

    case 8:
      // 山の日: 8月11日 (2016-)
      // 2020年・2021年は特例で移動
      if (year === 2020) {
        if (day === 10) return true;
      } else if (year === 2021) {
        if (day === 8) return true;
      } else if (year >= 2016) {
        if (day === 11) return true;
      }
      break;

    case 9:
      // 敬老の日: 9月15日 (1966-2002), 第3月曜 (2003-)
      if (year >= 2003) {
        if (day === getNthWeekday(year, 9, 1, 3)) return true;
      } else if (year >= 1966) {
        if (day === 15) return true;
      }
      // 秋分の日
      if (day === calculateAutumnalEquinox(year) && year >= 1948) return true;
      break;

    case 10:
      // 体育の日/スポーツの日: 10月10日 (1966-1999), 第2月曜 (2000-)
      // 2020年・2021年は特例で7月に移動
      if (year === 2020 || year === 2021) {
        // 7月に移動済み
      } else if (year >= 2000) {
        if (day === getNthWeekday(year, 10, 1, 2)) return true;
      } else if (year >= 1966) {
        if (day === 10) return true;
      }
      break;

    case 11:
      // 文化の日: 11月3日
      if (day === 3 && year >= 1948) return true;
      // 勤労感謝の日: 11月23日
      if (day === 23 && year >= 1948) return true;
      break;

    case 12:
      // 天皇誕生日: 12月23日 (1989-2018)
      if (day === 23 && year >= 1989 && year <= 2018) return true;
      break;
  }

  return false;
}

/**
 * 指定した日付が振替休日かどうかを判定する
 *
 * 振替休日: 祝日が日曜日に当たるとき、その日以降の最初の平日を休日とする
 * （1973年4月12日施行）
 */
function isSubstituteHoliday(year: number, month: number, day: number): boolean {
  // 振替休日制度は1973年4月12日施行
  if (year < 1973) return false;
  if (year === 1973 && (month < 4 || (month === 4 && day < 12))) return false;

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
  if (year < 1986) return false;

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
 * 指定した日付が祝日（国民の祝日・振替休日・国民の休日）かどうかを判定する
 *
 * @param date - 判定する日付（Date または YYYY-MM-DD 形式の文字列）
 * @returns 祝日の場合は true
 *
 * @example
 * ```typescript
 * isNationalHoliday('2025-01-01');
 * // => true（元日）
 *
 * isNationalHoliday('2025-01-13');
 * // => true（成人の日）
 *
 * isNationalHoliday('2025-01-02');
 * // => false
 * ```
 */
export function isNationalHoliday(date: DateInput): boolean {
  const year = getJstFullYear(date);
  const month = getJstMonth(date) + 1;
  const day = getJstDate(date);

  // 祝日法施行前（1948年以前）は祝日なし
  if (year < 1948) return false;

  // 国民の祝日
  if (isDefinedHoliday(year, month, day)) return true;

  // 振替休日
  if (isSubstituteHoliday(year, month, day)) return true;

  // 国民の休日
  if (isCitizensHoliday(year, month, day)) return true;

  return false;
}
