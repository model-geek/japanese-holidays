import type { DateInput } from './types.js';
import { toJstDate } from './toJstDate.js';

/** JST のオフセット（ミリ秒） */
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換する
 *
 * Date オブジェクトの場合、JST での日付を返す。
 *
 * @param date - 変換する日付
 * @returns YYYY-MM-DD 形式の文字列
 *
 * @example
 * ```typescript
 * formatDate(new Date('2024-12-31T15:00:00.000Z'));
 * // => '2025-01-01'（JST での日付）
 *
 * formatDate('2025-01-01');
 * // => '2025-01-01'
 * ```
 */
export function formatDate(date: DateInput): string {
  if (typeof date === 'string') {
    return date;
  }
  // toJstDate は JST の 00:00:00 を表す Date を返す
  // その Date に 9 時間を足すと UTC の 00:00:00 になる
  const d = toJstDate(date);
  const utcMidnight = new Date(d.getTime() + JST_OFFSET_MS);
  const year = utcMidnight.getUTCFullYear();
  const month = String(utcMidnight.getUTCMonth() + 1).padStart(2, '0');
  const day = String(utcMidnight.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
