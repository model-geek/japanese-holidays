/**
 * 春分日を計算する
 *
 * 国立天文台の計算式に基づく。1900-2099年の範囲で有効。
 *
 * @param year - 年
 * @returns 春分日（3月の日付）
 *
 * @see https://www.nao.ac.jp/faq/a0301.html
 *
 * @example
 * ```typescript
 * calculateVernalEquinox(2025);
 * // => 20
 *
 * calculateVernalEquinox(2024);
 * // => 20
 * ```
 */
export function calculateVernalEquinox(year: number): number {
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
 * 国立天文台の計算式に基づく。1900-2099年の範囲で有効。
 *
 * @param year - 年
 * @returns 秋分日（9月の日付）
 *
 * @see https://www.nao.ac.jp/faq/a0301.html
 *
 * @example
 * ```typescript
 * calculateAutumnalEquinox(2025);
 * // => 23
 *
 * calculateAutumnalEquinox(2024);
 * // => 22
 * ```
 */
export function calculateAutumnalEquinox(year: number): number {
  if (year < 1900 || year > 2099) {
    // 計算式の適用範囲外
    return 23;
  }

  if (year <= 1979) {
    return Math.floor(23.2588 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  }
  return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}
