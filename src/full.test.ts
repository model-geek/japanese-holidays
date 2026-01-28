import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isNationalHoliday,
  isWeekend,
  isHoliday,
  isBusinessDay,
  getHolidayName,
  getHolidaysInRange,
} from './full.ts';

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

describe('full: isHoliday', () => {
  it('祝日の場合 true を返す', () => {
    assert.strictEqual(isHoliday('2026-01-01'), true);
  });

  it('土曜日の場合 true を返す', () => {
    assert.strictEqual(isHoliday('2026-01-03'), true);
  });

  it('日曜日の場合 true を返す', () => {
    assert.strictEqual(isHoliday('2026-01-04'), true);
  });

  it('祝日でも土日でもない場合 false を返す', () => {
    assert.strictEqual(isHoliday('2026-01-02'), false);
  });

  it('Date オブジェクトを受け付ける', () => {
    const date = new Date(2026, 0, 1); // 2026-01-01
    assert.strictEqual(isHoliday(date), true);
  });
});

describe('full: isBusinessDay', () => {
  it('営業日の場合 true を返す', () => {
    // 2026-01-02 は金曜日、祝日でない
    assert.strictEqual(isBusinessDay('2026-01-02'), true);
  });

  it('土曜日の場合 false を返す', () => {
    assert.strictEqual(isBusinessDay('2026-01-03'), false);
  });

  it('日曜日の場合 false を返す', () => {
    assert.strictEqual(isBusinessDay('2026-01-04'), false);
  });

  it('祝日の場合 false を返す', () => {
    assert.strictEqual(isBusinessDay('2026-01-01'), false);
  });

  it('Date オブジェクトを受け付ける', () => {
    const date = new Date(2026, 0, 2); // 2026-01-02 金曜日
    assert.strictEqual(isBusinessDay(date), true);
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

describe('full: getHolidaysInRange', () => {
  it('範囲内の祝日を返す', () => {
    const holidays = getHolidaysInRange('2026-01-01', '2026-01-31');
    assert.ok(holidays.length > 0);
    assert.strictEqual(holidays[0].date, '2026-01-01');
    assert.strictEqual(holidays[0].name, '元日');
  });

  it('祝日がない範囲では空配列を返す', () => {
    const holidays = getHolidaysInRange('2026-06-01', '2026-06-15');
    assert.deepStrictEqual(holidays, []);
  });

  it('Date オブジェクトを受け付ける', () => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 0, 31);
    const holidays = getHolidaysInRange(start, end);
    assert.ok(holidays.length > 0);
    assert.strictEqual(holidays[0].date, '2026-01-01');
  });
});
