import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { fetchCsv, parseCsv, type Holiday } from './generate-holidays.js';

const CSV_URL = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';

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
