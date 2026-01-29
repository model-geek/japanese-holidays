/**
 * 祝日判定のルール定義
 *
 * 法改正の履歴を年ごとの差分で記述し、指定年の祝日データを計算する
 */

import {
  createJstDate,
  getJstDay,
  getJstFullYear,
  getJstMonth,
  getJstDate,
  getNthWeekday,
} from '../_internal/jst.ts';
import { addDays } from '../_internal/addDays.ts';
import {
  calculateVernalEquinox,
  calculateAutumnalEquinox,
} from '../_internal/equinox.ts';

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
 * 一回限りの特別祝日
 */
interface SpecialRule {
  type: 'special';
  year: number;
  month: number;
  day: number;
  name: string;
}

/**
 * 祝日ルール
 */
type HolidayRule = FixedHolidayRule | HappyMondayRule | EquinoxRule | SpecialRule;

/**
 * オリンピック特例で移動された祝日
 */
interface MovedHoliday {
  name: string;
  month: number;
  day: number;
}

/**
 * 年ごとの法改正
 */
interface YearlyChange {
  year: number;
  description: string;
  add?: HolidayRule[];
  remove?: string[];
  modify?: HolidayRule[];
  substituteHolidayStart?: { month: number; day: number };
  citizensHolidayStart?: boolean;
  olympicException?: readonly MovedHoliday[];
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
 */
const YEARLY_CHANGES: readonly YearlyChange[] = [
  // ------------------------------------------------------------------------
  // 1948年: 祝日法施行
  // ------------------------------------------------------------------------
  {
    year: 1948,
    description: '国民の祝日に関する法律（祝日法）施行',
    add: [
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
    add: [{ type: 'special', year: 1959, month: 4, day: 10, name: '結婚の儀' }],
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
    add: [{ type: 'special', year: 1989, month: 2, day: 24, name: '大喪の礼' }],
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
    add: [{ type: 'special', year: 1990, month: 11, day: 12, name: '即位礼正殿の儀' }],
  },
  // ------------------------------------------------------------------------
  // 1993年: 皇太子徳仁親王の結婚の儀
  // ------------------------------------------------------------------------
  {
    year: 1993,
    description: '皇太子徳仁親王の結婚の儀',
    add: [{ type: 'special', year: 1993, month: 6, day: 9, name: '結婚の儀' }],
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
    remove: ['天皇誕生日', '体育の日'],
    add: [
      { type: 'happyMonday', month: 10, weekday: 1, n: 2, name: '体育の日（スポーツの日）' },
      { type: 'special', year: 2019, month: 5, day: 1, name: '休日（祝日扱い）' },
      { type: 'special', year: 2019, month: 10, day: 22, name: '休日（祝日扱い）' },
    ],
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
// 内部ヘルパー関数
// ============================================================================

/**
 * 日付を YYYY-MM-DD 形式にフォーマット
 */
function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * ルールから祝日の日付を計算
 */
function computeHolidayDate(
  rule: HolidayRule,
  year: number
): { month: number; day: number } | null {
  switch (rule.type) {
    case 'fixed':
      return { month: rule.month, day: rule.day };
    case 'happyMonday': {
      const day = getNthWeekday(year, rule.month, rule.weekday, rule.n);
      return { month: rule.month, day };
    }
    case 'equinox':
      if (rule.kind === 'vernal') {
        return { month: 3, day: calculateVernalEquinox(year) };
      } else {
        return { month: 9, day: calculateAutumnalEquinox(year) };
      }
    case 'special':
      return rule.year === year ? { month: rule.month, day: rule.day } : null;
  }
}

/**
 * 指定した日付が祝日かどうか判定（振替休日・国民の休日を除く）
 */
function isDefinedHoliday(
  holidays: ReadonlyMap<string, string>,
  year: number,
  month: number,
  day: number
): boolean {
  const dateStr = formatDateStr(year, month, day);
  const name = holidays.get(dateStr);
  return name !== undefined && name !== '休日';
}

/**
 * 祝日リストから定義された祝日（休日を除く）の日付を抽出
 */
function extractDefinedHolidays(
  holidays: ReadonlyMap<string, string>,
  year: number
): { month: number; day: number }[] {
  const result: { month: number; day: number }[] = [];
  for (const [dateStr, name] of holidays) {
    if (name === '休日') continue;
    const [y, m, d] = dateStr.split('-').map(Number);
    if (y === year) {
      result.push({ month: m, day: d });
    }
  }
  return result;
}

/**
 * 振替休日を計算
 */
function computeSubstituteHolidays(
  holidays: ReadonlyMap<string, string>,
  year: number,
  substituteStart: { year: number; month: number; day: number } | null
): [string, string][] {
  if (!substituteStart) return [];
  if (year < substituteStart.year) return [];

  const result: [string, string][] = [];
  const definedHolidays = extractDefinedHolidays(holidays, year);

  for (const { month, day } of definedHolidays) {
    // 振替休日制度施行日より前はスキップ
    if (
      year === substituteStart.year &&
      (month < substituteStart.month ||
        (month === substituteStart.month && day < substituteStart.day))
    ) {
      continue;
    }

    const date = createJstDate(year, month - 1, day);
    if (getJstDay(date) !== 0) continue; // 日曜日でなければスキップ

    // 翌日以降で最初の平日（祝日でない日）を探す
    let checkDate = addDays(date, 1);
    while (true) {
      const checkYear = getJstFullYear(checkDate);
      const checkMonth = getJstMonth(checkDate) + 1;
      const checkDay = getJstDate(checkDate);
      const checkDateStr = formatDateStr(checkYear, checkMonth, checkDay);

      // 既存の祝日にも、これまでに追加した振替休日にもない場合
      if (!holidays.has(checkDateStr) && !result.some(([d]) => d === checkDateStr)) {
        result.push([checkDateStr, '休日']);
        break;
      }
      checkDate = addDays(checkDate, 1);
    }
  }

  return result;
}

/**
 * 国民の休日を計算
 */
function computeCitizensHolidays(
  holidays: ReadonlyMap<string, string>,
  year: number,
  citizensHolidayEnabled: boolean
): [string, string][] {
  if (!citizensHolidayEnabled) return [];

  const result: [string, string][] = [];
  const definedHolidays = extractDefinedHolidays(holidays, year);

  for (const { month, day } of definedHolidays) {
    const date = createJstDate(year, month - 1, day);
    const nextDate = addDays(date, 2); // 2日後
    const betweenDate = addDays(date, 1); // 間の日

    const nextYear = getJstFullYear(nextDate);
    const nextMonth = getJstMonth(nextDate) + 1;
    const nextDay = getJstDate(nextDate);

    const betweenYear = getJstFullYear(betweenDate);
    const betweenMonth = getJstMonth(betweenDate) + 1;
    const betweenDay = getJstDate(betweenDate);

    // 翌々日が祝日か確認
    if (!isDefinedHoliday(holidays, nextYear, nextMonth, nextDay)) continue;

    // 間の日がすでに祝日・休日でないか確認
    const betweenDateStr = formatDateStr(betweenYear, betweenMonth, betweenDay);
    if (holidays.has(betweenDateStr)) continue;

    // 間の日が日曜日でないか確認（日曜日なら振替休日の対象）
    if (getJstDay(betweenDate) === 0) continue;

    result.push([betweenDateStr, '休日']);
  }

  return result;
}

// ============================================================================
// 公開 API
// ============================================================================

/**
 * 指定年の定義された祝日と設定を計算
 */
interface ComputedHolidays {
  definedHolidays: readonly [string, string][];
  substituteHolidayStart: { year: number; month: number; day: number } | null;
  citizensHolidayEnabled: boolean;
}

/**
 * ルールのキーを取得（special ルールは日付ベース）
 */
function getRuleKey(rule: HolidayRule): string {
  return rule.type === 'special'
    ? formatDateStr(rule.year, rule.month, rule.day)
    : rule.name;
}

/**
 * YEARLY_CHANGES から指定年の祝日を計算
 */
function computeDefinedHolidays(year: number): ComputedHolidays {
  // 中間状態の型
  interface IntermediateState {
    rules: ReadonlyMap<string, HolidayRule>;
    olympicHolidays: readonly [string, string][];
    substituteHolidayStart: { year: number; month: number; day: number } | null;
    citizensHolidayEnabled: boolean;
  }

  const initialState: IntermediateState = {
    rules: new Map(),
    olympicHolidays: [],
    substituteHolidayStart: null,
    citizensHolidayEnabled: false,
  };

  const { rules, olympicHolidays, substituteHolidayStart, citizensHolidayEnabled } =
    YEARLY_CHANGES.filter((change) => change.year <= year).reduce(
      (state, change): IntermediateState => {
        // ルールの追加・削除・変更
        const rules = new Map(state.rules);
        for (const rule of change.add ?? []) {
          rules.set(getRuleKey(rule), rule);
        }
        for (const name of change.remove ?? []) {
          rules.delete(name);
        }
        for (const rule of change.modify ?? []) {
          rules.set(getRuleKey(rule), rule);
        }

        // オリンピック特例（その年のみ）→ 移動対象のルールを削除
        if (change.year === year && change.olympicException) {
          for (const moved of change.olympicException) {
            rules.delete(moved.name);
          }
        }

        // オリンピック特例で移動された祝日
        const newOlympicHolidays: [string, string][] =
          change.year === year && change.olympicException
            ? change.olympicException.map(
                (m): [string, string] => [formatDateStr(year, m.month, m.day), m.name]
              )
            : [];

        // 振替休日制度
        const substituteHolidayStart = change.substituteHolidayStart
          ? {
              year: change.year,
              month: change.substituteHolidayStart.month,
              day: change.substituteHolidayStart.day,
            }
          : state.substituteHolidayStart;

        // 国民の休日制度
        const citizensHolidayEnabled = state.citizensHolidayEnabled || change.citizensHolidayStart === true;

        return {
          rules,
          olympicHolidays: [...state.olympicHolidays, ...newOlympicHolidays],
          substituteHolidayStart,
          citizensHolidayEnabled,
        };
      },
      initialState
    );

  // ルールから祝日を計算
  const ruleBasedHolidays: [string, string][] = [...rules.values()]
    .map((rule) => {
      const date = computeHolidayDate(rule, year);
      return date ? ([formatDateStr(year, date.month, date.day), rule.name] as [string, string]) : null;
    })
    .filter((entry): entry is [string, string] => entry !== null);

  return {
    definedHolidays: [...olympicHolidays, ...ruleBasedHolidays],
    substituteHolidayStart,
    citizensHolidayEnabled,
  };
}

/**
 * キャッシュ: 年 → (日付 → 祝日名)
 */
const holidayCache = new Map<number, ReadonlyMap<string, string>>();

/**
 * 指定年の全祝日データを返す
 *
 * @param year - 対象年
 * @returns 日付（YYYY-MM-DD）→ 祝日名 の Map
 *
 * @example
 * ```typescript
 * const holidays = getHolidaysForYear(2025);
 * holidays.get('2025-01-01'); // => '元日'
 * holidays.get('2025-01-13'); // => '成人の日'
 * ```
 */
export function getHolidaysForYear(year: number): ReadonlyMap<string, string> {
  const cached = holidayCache.get(year);
  if (cached) {
    return cached;
  }

  const { definedHolidays, substituteHolidayStart, citizensHolidayEnabled } =
    computeDefinedHolidays(year);

  // 1. 定義された祝日の Map を作成
  const definedHolidaysMap = new Map(definedHolidays);

  // 2. 振替休日を計算
  const substituteHolidays = computeSubstituteHolidays(definedHolidaysMap, year, substituteHolidayStart);

  // 3. 振替休日を含めた Map を作成（国民の休日の計算に必要）
  const withSubstitute = new Map([...definedHolidays, ...substituteHolidays]);

  // 4. 国民の休日を計算
  const citizensHolidays = computeCitizensHolidays(withSubstitute, year, citizensHolidayEnabled);

  // 5. 全ての祝日を含む Map を作成
  const holidays = new Map([...definedHolidays, ...substituteHolidays, ...citizensHolidays]);

  holidayCache.set(year, holidays);
  return holidays;
}
