import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isNationalHoliday, getHolidayName } from '../src/index.js';
import { holidaySet, holidayNames, lastYear } from './fixture/holiday-names.js';

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換する
 */
function formatDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
  it(`1955-01-01 から ${lastYear}-12-31 まで全日付の判定が正しい`, () => {
    const errors: string[] = [];

    for (const date of generateDateRange(1955, 1, 1, lastYear, 12, 31)) {
      const expected = holidaySet.has(date);
      const actual = isNationalHoliday(date);

      if (actual !== expected) {
        errors.push(`${date}: expected ${expected}, got ${actual}`);
      }
    }

    assert.strictEqual(
      errors.length,
      0,
      `${errors.length} 件の日付で判定が一致しません:\n${errors.slice(0, 20).join('\n')}`
    );
  });
});

describe('getHolidayName 全祝日チェック', () => {
  it('全ての祝日の名前が正しい', () => {
    const errors: string[] = [];

    for (const [date, expectedName] of holidayNames) {
      const actualName = getHolidayName(date);

      if (actualName !== expectedName) {
        errors.push(`${date}: expected "${expectedName}", got "${actualName}"`);
      }
    }

    assert.strictEqual(
      errors.length,
      0,
      `${errors.length} 件の祝日で名前が一致しません:\n${errors.slice(0, 20).join('\n')}`
    );
  });

  it('祝日でない日は undefined を返す', () => {
    const errors: string[] = [];

    for (const date of generateDateRange(1955, 1, 1, lastYear, 12, 31)) {
      if (holidaySet.has(date)) continue;

      const actual = getHolidayName(date);
      if (actual !== undefined) {
        errors.push(`${date}: expected undefined, got "${actual}"`);
      }
    }

    assert.strictEqual(
      errors.length,
      0,
      `${errors.length} 件の非祝日で undefined 以外が返されました:\n${errors.slice(0, 20).join('\n')}`
    );
  });
});
