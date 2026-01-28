import type { DateInput } from './types.js';

/** JST のオフセット（ミリ秒） */
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * DateInput を JST の Date オブジェクトに変換する
 *
 * 返される Date オブジェクトは、JST でその日の 00:00:00 を表す。
 * `.toISOString()` で確認すると、UTC では前日の 15:00:00 になる。
 *
 * @param date - 変換する日付
 * @returns JST でその日の 00:00:00 を表す Date オブジェクト
 *
 * @example
 * ```typescript
 * toJstDate('2025-01-01').toISOString();
 * // => '2024-12-31T15:00:00.000Z'（JST の 2025-01-01 00:00:00）
 * ```
 */
export function toJstDate(date: DateInput): Date {
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number);
    // JST の YYYY-MM-DD 00:00:00 は UTC の前日 15:00:00
    return new Date(Date.UTC(year, month - 1, day) - JST_OFFSET_MS);
  }
  // Date オブジェクトの場合、その瞬間の JST での日付を取得
  const jstTime = date.getTime() + JST_OFFSET_MS;
  const jstDate = new Date(jstTime);
  const year = jstDate.getUTCFullYear();
  const month = jstDate.getUTCMonth();
  const day = jstDate.getUTCDate();
  return new Date(Date.UTC(year, month, day) - JST_OFFSET_MS);
}
