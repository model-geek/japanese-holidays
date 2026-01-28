import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const CSV_URL = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';

/**
 * 祝日データ
 */
export interface Holiday {
  /**
   * 日付（YYYY-MM-DD 形式）
   */
  date: string;

  /**
   * 祝日名
   */
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
  // CRLF を LF に正規化
  const normalized = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.trim().split('\n');
  return lines
    .slice(1) // ヘッダーをスキップ
    .filter((line) => line.trim() !== '') // 空行をスキップ
    .map((line) => {
      const [dateStr, name] = line.split(',');
      return { date: formatDate(dateStr), name };
    });
}

/**
 * 祝日日付の TypeScript ファイル内容を生成する
 *
 * @param holidays - 祝日データの配列
 * @returns TypeScript ファイルの内容
 *
 * @example
 * ```typescript
 * generateHolidayDatesTs([
 *   { date: '2025-01-01', name: '元日' },
 *   { date: '2025-01-13', name: '成人の日' },
 * ]);
 * // => 'const dates: string[] = ["2025-01-01","2025-01-13"];\n\nexport const holidayDates...'
 * ```
 */
export function generateHolidayDatesTs(holidays: Holiday[]): string {
  const dates = holidays.map((h) => JSON.stringify(h.date));
  return `/**
 * このファイルは自動生成されるため、直接編集しないこと
 * 再生成: npm run generate
 * @packageDocumentation
 */

/**
 * 祝日の日付配列（YYYY-MM-DD 形式）
 */
const dates: string[] = [${dates.join(',')}];

/**
 * 祝日の日付セット（デフォルトエントリポイント用）
 * 日付は JST の YYYY-MM-DD 形式
 */
export const holidayDates: ReadonlySet<string> = new Set(dates);
`;
}

/**
 * 祝日名マップの TypeScript ファイル内容を生成する
 *
 * @param holidays - 祝日データの配列
 * @returns TypeScript ファイルの内容
 *
 * @example
 * ```typescript
 * generateHolidayNamesTs([
 *   { date: '2025-01-01', name: '元日' },
 *   { date: '2025-01-13', name: '成人の日' },
 * ]);
 * // => 'const entries: [string, string][] = [["2025-01-01","元日"],...];\n\nexport const holidayNames...'
 * ```
 */
export function generateHolidayNamesTs(holidays: Holiday[]): string {
  const entries = holidays.map((h) => `[${JSON.stringify(h.date)},${JSON.stringify(h.name)}]`);
  return `/**
 * このファイルは自動生成されるため、直接編集しないこと
 * 再生成: npm run generate
 * @packageDocumentation
 */

/**
 * 祝日の日付と名前のペア配列（[YYYY-MM-DD, 祝日名] 形式）
 */
const entries: [string, string][] = [${entries.join(',')}];

/**
 * 祝日の日付と名前のマップ（full エントリポイント用）
 * 日付は JST の YYYY-MM-DD 形式
 */
export const holidayNames: ReadonlyMap<string, string> = new Map(entries);
`;
}

/**
 * 指定 URL から CSV を取得し、Shift_JIS から UTF-8 に変換して返す
 *
 * @param url - CSV の URL
 * @returns UTF-8 に変換された CSV テキスト
 * @throws HTTP エラーの場合
 *
 * @example
 * ```typescript
 * const csvText = await fetchCsv('https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv');
 * ```
 */
export async function fetchCsv(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch CSV: ${response.status} ${response.statusText}`
    );
  }
  const buffer = await response.arrayBuffer();
  return new TextDecoder('shift_jis').decode(buffer);
}

/**
 * 内閣府 CSV から祝日データを取得し、TypeScript ファイルを生成する
 *
 * 以下のファイルを出力する:
 * - `src/_data/holidayDates.ts` — 祝日日付の Set
 * - `src/_data/holidayNames.ts` — 日付をキー、祝日名を値とする Map
 */
async function generate(): Promise<void> {
  console.log('Fetching CSV from', CSV_URL);
  const csvText = await fetchCsv(CSV_URL);

  console.log('Parsing CSV...');
  const holidays = parseCsv(csvText);
  console.log(`Parsed ${holidays.length} holidays`);

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const dataDir = join(__dirname, '..', 'src', '_data');

  const datesTs = generateHolidayDatesTs(holidays);
  const namesTs = generateHolidayNamesTs(holidays);

  await writeFile(join(dataDir, 'holidayDates.ts'), datesTs);
  await writeFile(join(dataDir, 'holidayNames.ts'), namesTs);

  console.log('Generated:');
  console.log('  - src/_data/holidayDates.ts');
  console.log('  - src/_data/holidayNames.ts');
}

// 直接実行された場合のみ generate() を呼ぶ
if (import.meta.url === `file://${process.argv[1]}`) {
  generate().catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
