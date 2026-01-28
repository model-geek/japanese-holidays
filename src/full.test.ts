import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isNationalHoliday, isWeekend, getHolidayName } from './full.ts';

describe('full: isNationalHoliday', () => {
  it('祝日の場合 true を返す', () => {
    assert.strictEqual(isNationalHoliday('2026-01-01'), true);
  });

  it('祝日でない場合 false を返す', () => {
    assert.strictEqual(isNationalHoliday('2026-01-02'), false);
  });

  it('Date オブジェクトを受け付ける', () => {
    const date = new Date(2026, 0, 1); // 2026-01-01
    assert.strictEqual(isNationalHoliday(date), true);
  });
});

describe('full: isWeekend', () => {
  it('土曜日の場合 true を返す', () => {
    assert.strictEqual(isWeekend('2026-01-03'), true);
  });

  it('日曜日の場合 true を返す', () => {
    assert.strictEqual(isWeekend('2026-01-04'), true);
  });

  it('平日の場合 false を返す', () => {
    assert.strictEqual(isWeekend('2026-01-05'), false);
  });
});

describe('full: getHolidayName', () => {
  it('祝日の場合は祝日名を返す', () => {
    assert.strictEqual(getHolidayName('2026-01-01'), '元日');
  });

  it('祝日でない場合は undefined を返す', () => {
    assert.strictEqual(getHolidayName('2026-01-02'), undefined);
  });

  it('Date オブジェクトを受け付ける', () => {
    const date = new Date(2026, 0, 1); // 2026-01-01
    assert.strictEqual(getHolidayName(date), '元日');
  });
});
