/**
 * 祝日判定のルール定義
 *
 * 法改正の履歴を年ごとの差分で記述し、指定年のルールセットを計算する
 */

// ============================================================================
// 型定義
// ============================================================================

/**
 * 固定日祝日（毎年同じ日付）
 */
interface FixedHolidayRule {
  type: 'fixed';
  month: number;
  day: number;
  name: string;
}

/**
 * ハッピーマンデー祝日（第n月曜日）
 */
interface HappyMondayRule {
  type: 'happyMonday';
  month: number;
  weekday: number;
  n: number;
  name: string;
}

/**
 * 春分・秋分の日（天文計算で決定）
 */
interface EquinoxRule {
  type: 'equinox';
  kind: 'vernal' | 'autumnal';
  name: string;
}

/**
 * 祝日ルール
 */
export type HolidayRule = FixedHolidayRule | HappyMondayRule | EquinoxRule;

/**
 * 一回限りの特別祝日
 */
interface SpecialHoliday {
  date: string;
  name: string;
}

/**
 * オリンピック特例で移動された祝日
 */
interface MovedHoliday {
  name: string;
  month: number;
  day: number;
}

/**
 * オリンピック特例（祝日の日付移動）
 */
type OlympicException = readonly MovedHoliday[];

/**
 * 年ごとの法改正
 */
interface YearlyChange {
  year: number;
  description: string;
  add?: HolidayRule[];
  remove?: string[];
  modify?: HolidayRule[];
  special?: SpecialHoliday[];
  substituteHolidayStart?: { month: number; day: number };
  citizensHolidayStart?: boolean;
  olympicException?: OlympicException;
}

/**
 * ある年のルールセット
 */
export interface Ruleset {
  rules: HolidayRule[];
  specials: Map<string, string>;
  substituteHolidayStart: { year: number; month: number; day: number } | null;
  citizensHolidayEnabled: boolean;
  olympicException: OlympicException | null;
}

// ============================================================================
// 法改正の年表
// ============================================================================

/**
 * 祝日法施行年（これより前は祝日なし）
 */
export const HOLIDAY_LAW_START_YEAR = 1948;

/**
 * 年ごとの法改正履歴
 *
 * 各エントリは施行年と変更内容を記述する。
 * add: 新規追加されたルール
 * remove: 廃止されたルールの名前
 * modify: 変更されたルール（同名のルールを上書き）
 * special: 一回限りの特別祝日
 */
export const YEARLY_CHANGES: readonly YearlyChange[] = [
  // ------------------------------------------------------------------------
  // 1948年: 祝日法施行
  // ------------------------------------------------------------------------
  {
    year: 1948,
    description: '国民の祝日に関する法律（祝日法）施行',
    add: [
      // 注: 1948年施行だが、元日・成人の日等は1949年から適用
      { type: 'equinox', kind: 'autumnal', name: '秋分の日' },
      { type: 'fixed', month: 11, day: 3, name: '文化の日' },
      { type: 'fixed', month: 11, day: 23, name: '勤労感謝の日' },
    ],
  },
  // ------------------------------------------------------------------------
  // 1949年: 主要祝日の適用開始
  // ------------------------------------------------------------------------
  {
    year: 1949,
    description: '元日、成人の日、春分の日、天皇誕生日、憲法記念日、こどもの日の適用開始',
    add: [
      { type: 'fixed', month: 1, day: 1, name: '元日' },
      { type: 'fixed', month: 1, day: 15, name: '成人の日' },
      { type: 'equinox', kind: 'vernal', name: '春分の日' },
      { type: 'fixed', month: 4, day: 29, name: '天皇誕生日' },
      { type: 'fixed', month: 5, day: 3, name: '憲法記念日' },
      { type: 'fixed', month: 5, day: 5, name: 'こどもの日' },
    ],
  },
  // ------------------------------------------------------------------------
  // 1959年: 皇太子明仁親王の結婚の儀
  // ------------------------------------------------------------------------
  {
    year: 1959,
    description: '皇太子明仁親王の結婚の儀',
    special: [{ date: '1959-04-10', name: '結婚の儀' }],
  },
  // ------------------------------------------------------------------------
  // 1966年: 敬老の日・体育の日の追加
  // ------------------------------------------------------------------------
  {
    year: 1966,
    description: '敬老の日・体育の日の追加',
    add: [
      { type: 'fixed', month: 9, day: 15, name: '敬老の日' },
      { type: 'fixed', month: 10, day: 10, name: '体育の日' },
    ],
  },
  // ------------------------------------------------------------------------
  // 1967年: 建国記念の日の施行
  // ------------------------------------------------------------------------
  {
    year: 1967,
    description: '建国記念の日の施行',
    add: [{ type: 'fixed', month: 2, day: 11, name: '建国記念の日' }],
  },
  // ------------------------------------------------------------------------
  // 1973年: 振替休日制度の施行（4月12日から）
  // ------------------------------------------------------------------------
  {
    year: 1973,
    description: '振替休日制度の施行（4月12日から）',
    substituteHolidayStart: { month: 4, day: 12 },
  },
  // ------------------------------------------------------------------------
  // 1986年: 国民の休日制度の施行
  // ------------------------------------------------------------------------
  {
    year: 1986,
    description: '国民の休日制度の施行',
    citizensHolidayStart: true,
  },
  // ------------------------------------------------------------------------
  // 1989年: 昭和天皇崩御に伴う変更
  // ------------------------------------------------------------------------
  {
    year: 1989,
    description: '昭和天皇崩御、天皇誕生日を12/23に変更、4/29をみどりの日に',
    special: [{ date: '1989-02-24', name: '大喪の礼' }],
    modify: [
      { type: 'fixed', month: 4, day: 29, name: 'みどりの日' },
      { type: 'fixed', month: 12, day: 23, name: '天皇誕生日' },
    ],
  },
  // ------------------------------------------------------------------------
  // 1990年: 即位礼正殿の儀
  // ------------------------------------------------------------------------
  {
    year: 1990,
    description: '即位礼正殿の儀',
    special: [{ date: '1990-11-12', name: '即位礼正殿の儀' }],
  },
  // ------------------------------------------------------------------------
  // 1993年: 皇太子徳仁親王の結婚の儀
  // ------------------------------------------------------------------------
  {
    year: 1993,
    description: '皇太子徳仁親王の結婚の儀',
    special: [{ date: '1993-06-09', name: '結婚の儀' }],
  },
  // ------------------------------------------------------------------------
  // 1996年: 海の日の新設
  // ------------------------------------------------------------------------
  {
    year: 1996,
    description: '海の日の新設',
    add: [{ type: 'fixed', month: 7, day: 20, name: '海の日' }],
  },
  // ------------------------------------------------------------------------
  // 2000年: ハッピーマンデー制度第1弾（成人の日・体育の日）
  // ------------------------------------------------------------------------
  {
    year: 2000,
    description: 'ハッピーマンデー制度第1弾（成人の日・体育の日）',
    modify: [
      { type: 'happyMonday', month: 1, weekday: 1, n: 2, name: '成人の日' },
      { type: 'happyMonday', month: 10, weekday: 1, n: 2, name: '体育の日' },
    ],
  },
  // ------------------------------------------------------------------------
  // 2003年: ハッピーマンデー制度第2弾（海の日・敬老の日）
  // ------------------------------------------------------------------------
  {
    year: 2003,
    description: 'ハッピーマンデー制度第2弾（海の日・敬老の日）',
    modify: [
      { type: 'happyMonday', month: 7, weekday: 1, n: 3, name: '海の日' },
      { type: 'happyMonday', month: 9, weekday: 1, n: 3, name: '敬老の日' },
    ],
  },
  // ------------------------------------------------------------------------
  // 2007年: 昭和の日の新設、みどりの日を5/4に移動
  // ------------------------------------------------------------------------
  {
    year: 2007,
    description: '昭和の日の新設、みどりの日を5/4に移動',
    modify: [{ type: 'fixed', month: 4, day: 29, name: '昭和の日' }],
    add: [{ type: 'fixed', month: 5, day: 4, name: 'みどりの日' }],
  },
  // ------------------------------------------------------------------------
  // 2016年: 山の日の新設
  // ------------------------------------------------------------------------
  {
    year: 2016,
    description: '山の日の新設',
    add: [{ type: 'fixed', month: 8, day: 11, name: '山の日' }],
  },
  // ------------------------------------------------------------------------
  // 2019年: 天皇の退位・即位関連、天皇誕生日廃止、体育の日名称変更準備
  // ------------------------------------------------------------------------
  {
    year: 2019,
    description: '天皇の退位・即位関連の特別祝日、天皇誕生日（12/23）廃止、体育の日名称変更準備',
    special: [
      { date: '2019-05-01', name: '休日（祝日扱い）' },
      { date: '2019-10-22', name: '休日（祝日扱い）' },
    ],
    remove: ['天皇誕生日', '体育の日'],
    add: [{ type: 'happyMonday', month: 10, weekday: 1, n: 2, name: '体育の日（スポーツの日）' }],
  },
  // ------------------------------------------------------------------------
  // 2020年: 新天皇誕生日、スポーツの日への改称、オリンピック特例
  // ------------------------------------------------------------------------
  {
    year: 2020,
    description: '天皇誕生日を2/23に新設、体育の日をスポーツの日に正式改称、オリンピック特例',
    add: [{ type: 'fixed', month: 2, day: 23, name: '天皇誕生日' }],
    remove: ['体育の日（スポーツの日）'],
    modify: [{ type: 'happyMonday', month: 10, weekday: 1, n: 2, name: 'スポーツの日' }],
    olympicException: [
      { name: '海の日', month: 7, day: 23 },
      { name: 'スポーツの日', month: 7, day: 24 },
      { name: '山の日', month: 8, day: 10 },
    ],
  },
  // ------------------------------------------------------------------------
  // 2021年: オリンピック延期に伴う特例（継続）
  // ------------------------------------------------------------------------
  {
    year: 2021,
    description: 'オリンピック延期に伴う祝日移動',
    olympicException: [
      { name: '海の日', month: 7, day: 22 },
      { name: 'スポーツの日', month: 7, day: 23 },
      { name: '山の日', month: 8, day: 8 },
    ],
  },
];

// ============================================================================
// ルールセット計算
// ============================================================================

/**
 * キャッシュ
 */
const rulesetCache = new Map<number, Ruleset>();

/**
 * 指定年のルールセットを計算する
 *
 * @param year - 対象年
 * @returns その年に適用されるルールセット
 */
export function getRulesetForYear(year: number): Ruleset {
  const cached = rulesetCache.get(year);
  if (cached) {
    return cached;
  }

  const rules = new Map<string, HolidayRule>();
  const specials = new Map<string, string>();
  let substituteHolidayStart: { year: number; month: number; day: number } | null = null;
  let citizensHolidayEnabled = false;
  let olympicException: OlympicException | null = null;

  for (const change of YEARLY_CHANGES) {
    if (change.year > year) break;

    // 祝日ルールの追加
    if (change.add) {
      for (const rule of change.add) {
        rules.set(rule.name, rule);
      }
    }

    // 祝日ルールの削除
    if (change.remove) {
      for (const name of change.remove) {
        rules.delete(name);
      }
    }

    // 祝日ルールの変更
    if (change.modify) {
      for (const rule of change.modify) {
        rules.set(rule.name, rule);
      }
    }

    // 特別祝日
    if (change.special) {
      for (const s of change.special) {
        specials.set(s.date, s.name);
      }
    }

    // 振替休日制度の開始
    if (change.substituteHolidayStart) {
      substituteHolidayStart = {
        year: change.year,
        month: change.substituteHolidayStart.month,
        day: change.substituteHolidayStart.day,
      };
    }

    // 国民の休日制度の開始
    if (change.citizensHolidayStart) {
      citizensHolidayEnabled = true;
    }

    // オリンピック特例（その年のみ適用）
    if (change.year === year && change.olympicException) {
      olympicException = change.olympicException;
    }
  }

  const ruleset: Ruleset = {
    rules: Array.from(rules.values()),
    specials,
    substituteHolidayStart,
    citizensHolidayEnabled,
    olympicException,
  };

  rulesetCache.set(year, ruleset);
  return ruleset;
}
