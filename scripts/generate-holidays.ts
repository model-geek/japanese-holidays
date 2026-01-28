/**
 * 祝日データ
 */
export interface Holiday {
  /** 日付（YYYY-MM-DD 形式） */
  date: string;
  /** 祝日名 */
  name: string;
}

/**
 * 内閣府 CSV の日付形式（YYYY/M/D）を YYYY-MM-DD に変換する
 */
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * 内閣府 CSV テキストをパースして Holiday 配列を返す
 *
 * @param csvText - CSV テキスト（UTF-8）
 * @returns 祝日データの配列
 *
 * @example
 * ```typescript
 * parseCsv('国民の祝日・休日月日,国民の祝日・休日名称\n2025/1/1,元日');
 * // => [{ date: '2025-01-01', name: '元日' }]
 * ```
 */
export function parseCsv(csvText: string): Holiday[] {
  const lines = csvText.trim().split('\n');
  return lines
    .slice(1) // ヘッダーをスキップ
    .filter((line) => line.trim() !== '') // 空行をスキップ
    .map((line) => {
      const [dateStr, name] = line.split(',');
      return { date: formatDate(dateStr), name };
    });
}
