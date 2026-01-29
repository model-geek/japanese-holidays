import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const CSV_URL = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';

/**
 * 祝日データ
 */
interface Holiday {
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
export function formatDate(dateStr: string): string {
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
 * CSV の最終年を取得する
 */
function getLastYear(holidays: Holiday[]): number {
  let maxYear = 0;
  for (const holiday of holidays) {
    const year = parseInt(holiday.date.substring(0, 4), 10);
    if (year > maxYear) {
      maxYear = year;
    }
  }
  return maxYear;
}

/**
 * フィクスチャファイルの内容を生成する
 */
function generateFixtureFile(holidays: Holiday[], lastYear: number): string {
  const holidayEntries = holidays.map(
    (h) => `[${JSON.stringify(h.date)},${JSON.stringify(h.name)}]`
  );

  return `/**
 * このファイルは自動生成されるため、直接編集しないこと
 * 再生成: npm run generate:check-all-test
 * @packageDocumentation
 */

/**
 * 内閣府 CSV から取得した祝日名マップ
 */
export const holidayNames: ReadonlyMap<string, string> = new Map([${holidayEntries.join(',')}]);

/**
 * 内閣府 CSV から取得した祝日日付セット
 */
export const holidaySet: ReadonlySet<string> = new Set(holidayNames.keys());

/**
 * CSV データの最終年
 */
export const lastYear = ${lastYear};
`;
}

/**
 * 内閣府 CSV から祝日データを取得し、フィクスチャファイルを生成する
 */
async function generate(): Promise<void> {
  console.log('Fetching CSV from', CSV_URL);
  const csvText = await fetchCsv(CSV_URL);

  console.log('Parsing CSV...');
  const holidays = parseCsv(csvText);
  const lastYear = getLastYear(holidays);
  console.log(`Parsed ${holidays.length} holidays (until ${lastYear})`);

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const fixtureDir = join(__dirname, '..', 'test', 'fixture');
  const fixtureFile = join(fixtureDir, 'holiday-names.ts');

  await mkdir(fixtureDir, { recursive: true });

  const content = generateFixtureFile(holidays, lastYear);
  await writeFile(fixtureFile, content);

  console.log('Generated:');
  console.log('  - test/fixture/holiday-names.ts');
}

// 直接実行された場合のみ generate() を呼ぶ
if (import.meta.url === `file://${process.argv[1]}`) {
  generate().catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
