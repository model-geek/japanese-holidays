/**
 * 祝日判定のルール定義
 *
 * 法改正で変わりうるデータを一箇所に集約する
 */

/**
 * 特別な一回限りの祝日（皇室行事等）
 *
 * キー: YYYY-MM-DD 形式の日付
 * 値: 祝日名
 */
export const SPECIAL_HOLIDAYS: ReadonlyMap<string, string> = new Map([
  ['1959-04-10', '結婚の儀'], // 皇太子明仁親王の結婚の儀
  ['1989-02-24', '大喪の礼'], // 昭和天皇の大喪の礼
  ['1990-11-12', '即位礼正殿の儀'], // 即位礼正殿の儀
  ['1993-06-09', '結婚の儀'], // 皇太子徳仁親王の結婚の儀
  ['2019-05-01', '休日（祝日扱い）'], // 天皇の即位の日
  ['2019-10-22', '休日（祝日扱い）'], // 即位礼正殿の儀
]);

/**
 * 祝日法施行年
 */
export const HOLIDAY_LAW_START_YEAR = 1948;

/**
 * 振替休日制度施行日
 */
export const SUBSTITUTE_HOLIDAY_START = {
  year: 1973,
  month: 4,
  day: 12,
} as const;

/**
 * 国民の休日制度施行年
 */
export const CITIZENS_HOLIDAY_START_YEAR = 1986;

/**
 * 祝日の施行年ルール
 */
export const HOLIDAY_START_YEARS = {
  /** 元日 */
  newYearsDay: 1949,
  /** 成人の日 */
  comingOfAgeDay: 1949,
  /** 成人の日ハッピーマンデー適用開始年 */
  comingOfAgeDayHappyMonday: 2000,
  /** 建国記念の日 */
  nationalFoundationDay: 1967,
  /** 天皇誕生日（令和） */
  emperorsBirthdayReiwa: 2020,
  /** 春分の日 */
  vernalEquinoxDay: 1949,
  /** 昭和の日（4/29の名称変更） */
  showaDay: 2007,
  /** みどりの日（4/29）*/
  greenDayApril: 1989,
  /** 天皇誕生日（昭和・4/29） */
  emperorsBirthdayShowa: 1949,
  /** 憲法記念日 */
  constitutionDay: 1949,
  /** みどりの日（5/4） */
  greenDayMay: 2007,
  /** こどもの日 */
  childrensDay: 1949,
  /** 海の日 */
  marineDay: 1996,
  /** 海の日ハッピーマンデー適用開始年 */
  marineDayHappyMonday: 2003,
  /** 山の日 */
  mountainDay: 2016,
  /** 敬老の日 */
  respectForTheAgedDay: 1966,
  /** 敬老の日ハッピーマンデー適用開始年 */
  respectForTheAgedDayHappyMonday: 2003,
  /** 秋分の日 */
  autumnalEquinoxDay: 1948,
  /** 体育の日/スポーツの日 */
  sportsDay: 1966,
  /** 体育の日ハッピーマンデー適用開始年 */
  sportsDayHappyMonday: 2000,
  /** スポーツの日への名称変更年 */
  sportsDayRename: 2020,
  /** 文化の日 */
  cultureDay: 1948,
  /** 勤労感謝の日 */
  laborThanksgivingDay: 1948,
  /** 天皇誕生日（平成・12/23）開始年 */
  emperorsBirthdayHeiseiStart: 1989,
  /** 天皇誕生日（平成・12/23）終了年 */
  emperorsBirthdayHeiseiEnd: 2018,
} as const;

/**
 * オリンピック特例年の祝日移動ルール
 *
 * 2020年・2021年は東京オリンピックに伴い一部祝日が移動
 */
export const OLYMPIC_SPECIAL_YEARS: ReadonlyMap<
  number,
  {
    /** 海の日の日付（月、日） */
    marineDay: readonly [number, number];
    /** スポーツの日の日付（月、日） */
    sportsDay: readonly [number, number];
    /** 山の日の日付（月、日） */
    mountainDay: readonly [number, number];
  }
> = new Map([
  [
    2020,
    {
      marineDay: [7, 23],
      sportsDay: [7, 24],
      mountainDay: [8, 10],
    },
  ],
  [
    2021,
    {
      marineDay: [7, 22],
      sportsDay: [7, 23],
      mountainDay: [8, 8],
    },
  ],
]);

/**
 * 固定日祝日の日付
 */
export const FIXED_HOLIDAY_DATES = {
  /** 元日 */
  newYearsDay: { month: 1, day: 1 },
  /** 成人の日（旧・固定日） */
  comingOfAgeDayFixed: { month: 1, day: 15 },
  /** 建国記念の日 */
  nationalFoundationDay: { month: 2, day: 11 },
  /** 天皇誕生日（令和） */
  emperorsBirthdayReiwa: { month: 2, day: 23 },
  /** 昭和の日/みどりの日（旧）/天皇誕生日（昭和） */
  showaDay: { month: 4, day: 29 },
  /** 憲法記念日 */
  constitutionDay: { month: 5, day: 3 },
  /** みどりの日 */
  greenDay: { month: 5, day: 4 },
  /** こどもの日 */
  childrensDay: { month: 5, day: 5 },
  /** 海の日（旧・固定日） */
  marineDayFixed: { month: 7, day: 20 },
  /** 山の日 */
  mountainDay: { month: 8, day: 11 },
  /** 敬老の日（旧・固定日） */
  respectForTheAgedDayFixed: { month: 9, day: 15 },
  /** 体育の日（旧・固定日） */
  sportsDayFixed: { month: 10, day: 10 },
  /** 文化の日 */
  cultureDay: { month: 11, day: 3 },
  /** 勤労感謝の日 */
  laborThanksgivingDay: { month: 11, day: 23 },
  /** 天皇誕生日（平成） */
  emperorsBirthdayHeisei: { month: 12, day: 23 },
} as const;

/**
 * ハッピーマンデー祝日のルール
 *
 * month: 月
 * weekday: 曜日（0: 日曜, 1: 月曜, ..., 6: 土曜）
 * n: 第何週目か
 */
export const HAPPY_MONDAY_RULES = {
  /** 成人の日: 1月第2月曜 */
  comingOfAgeDay: { month: 1, weekday: 1, n: 2 },
  /** 海の日: 7月第3月曜 */
  marineDay: { month: 7, weekday: 1, n: 3 },
  /** 敬老の日: 9月第3月曜 */
  respectForTheAgedDay: { month: 9, weekday: 1, n: 3 },
  /** 体育の日/スポーツの日: 10月第2月曜 */
  sportsDay: { month: 10, weekday: 1, n: 2 },
} as const;
