import { writeFile } from 'node:fs/promises';
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
 * テストファイルの内容を生成する
 */
function generateTestFile(holidays: Holiday[], lastYear: number): string {
  const holidayDates = holidays.map((h) => JSON.stringify(h.date));

  return `/**
 * このファイルは自動生成されるため、直接編集しないこと
 * 再生成: npm run generate:check-all-test
 * @packageDocumentation
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isNationalHoliday } from '../src/index.js';

/**
 * 内閣府 CSV から取得した祝日日付セット
 */
const holidaySet: ReadonlySet<string> = new Set([${holidayDates.join(',')}]);

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換する
 */
function formatDateString(year: number, month: number, day: number): string {
  return \`\${year}-\${String(month).padStart(2, '0')}-\${String(day).padStart(2, '0')}\`;
}

/**
 * 指定した年月の日数を返す
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 開始日から終了日までの全日付を生成する
 */
function* generateDateRange(
  startYear: number,
  startMonth: number,
  startDay: number,
  endYear: number,
  endMonth: number,
  endDay: number
): Generator<string> {
  let year = startYear;
  let month = startMonth;
  let day = startDay;

  while (
    year < endYear ||
    (year === endYear && month < endMonth) ||
    (year === endYear && month === endMonth && day <= endDay)
  ) {
    yield formatDateString(year, month, day);

    day++;
    if (day > getDaysInMonth(year, month)) {
      day = 1;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  }
}

describe('isNationalHoliday 全日付チェック', () => {
  it('1955-01-01 から ${lastYear}-12-31 まで全日付の判定が正しい', () => {
    const errors: string[] = [];

    for (const date of generateDateRange(1955, 1, 1, ${lastYear}, 12, 31)) {
      const expected = holidaySet.has(date);
      const actual = isNationalHoliday(date);

      if (actual !== expected) {
        errors.push(\`\${date}: expected \${expected}, got \${actual}\`);
      }
    }

    assert.strictEqual(
      errors.length,
      0,
      \`\${errors.length} 件の日付で判定が一致しません:\\n\${errors.slice(0, 20).join('\\n')}\`
    );
  });
});
`;
}

/**
 * 内閣府 CSV から祝日データを取得し、テストファイルを生成する
 */
async function generate(): Promise<void> {
  console.log('Fetching CSV from', CSV_URL);
  const csvText = await fetchCsv(CSV_URL);

  console.log('Parsing CSV...');
  const holidays = parseCsv(csvText);
  const lastYear = getLastYear(holidays);
  console.log(`Parsed ${holidays.length} holidays (until ${lastYear})`);

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const testDir = join(__dirname, '..', 'test');
  const testFile = join(testDir, 'check-all.test.ts');

  const content = generateTestFile(holidays, lastYear);
  await writeFile(testFile, content);

  console.log('Generated:');
  console.log('  - test/check-all.test.ts');
}

// 直接実行された場合のみ generate() を呼ぶ
if (import.meta.url === `file://${process.argv[1]}`) {
  generate().catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
