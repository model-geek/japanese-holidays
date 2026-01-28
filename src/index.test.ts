import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isNationalHoliday, isWeekend, isHoliday, isBusinessDay } from './index.ts';

describe('default: isNationalHoliday', () => {
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

describe('default: isWeekend', () => {
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

describe('default: isHoliday', () => {
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

describe('default: isBusinessDay', () => {
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
