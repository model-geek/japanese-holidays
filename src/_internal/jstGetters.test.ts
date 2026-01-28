import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getJstFullYear,
  getJstMonth,
  getJstDate,
  getJstDay,
} from './jstGetters.ts';

describe('getJstFullYear', () => {
  it('文字列から JST の年を取得する', () => {
    assert.strictEqual(getJstFullYear('2025-01-01'), 2025);
  });

  it('Date オブジェクトから JST の年を取得する', () => {
    // UTC の 2024-12-31 15:00:00 = JST の 2025-01-01 00:00:00
    const date = new Date('2024-12-31T15:00:00.000Z');
    assert.strictEqual(getJstFullYear(date), 2025);
  });

  it('年末の境界を正しく扱う', () => {
    // UTC の 2025-12-31 14:59:59 = JST の 2025-12-31 23:59:59
    const beforeMidnight = new Date('2025-12-31T14:59:59.000Z');
    assert.strictEqual(getJstFullYear(beforeMidnight), 2025);

    // UTC の 2025-12-31 15:00:00 = JST の 2026-01-01 00:00:00
    const afterMidnight = new Date('2025-12-31T15:00:00.000Z');
    assert.strictEqual(getJstFullYear(afterMidnight), 2026);
  });
});

describe('getJstMonth', () => {
  it('文字列から JST の月を取得する（0-indexed）', () => {
    assert.strictEqual(getJstMonth('2025-01-15'), 0);
    assert.strictEqual(getJstMonth('2025-12-15'), 11);
  });

  it('Date オブジェクトから JST の月を取得する', () => {
    // UTC の 2024-12-31 15:00:00 = JST の 2025-01-01 00:00:00
    const date = new Date('2024-12-31T15:00:00.000Z');
    assert.strictEqual(getJstMonth(date), 0);
  });

  it('月末の境界を正しく扱う', () => {
    // UTC の 2025-01-31 14:59:59 = JST の 2025-01-31 23:59:59
    const beforeMidnight = new Date('2025-01-31T14:59:59.000Z');
    assert.strictEqual(getJstMonth(beforeMidnight), 0);

    // UTC の 2025-01-31 15:00:00 = JST の 2025-02-01 00:00:00
    const afterMidnight = new Date('2025-01-31T15:00:00.000Z');
    assert.strictEqual(getJstMonth(afterMidnight), 1);
  });
});

describe('getJstDate', () => {
  it('文字列から JST の日を取得する', () => {
    assert.strictEqual(getJstDate('2025-01-15'), 15);
    assert.strictEqual(getJstDate('2025-01-01'), 1);
    assert.strictEqual(getJstDate('2025-01-31'), 31);
  });

  it('Date オブジェクトから JST の日を取得する', () => {
    // UTC の 2024-12-31 15:00:00 = JST の 2025-01-01 00:00:00
    const date = new Date('2024-12-31T15:00:00.000Z');
    assert.strictEqual(getJstDate(date), 1);
  });

  it('日付の境界を正しく扱う', () => {
    // UTC の 2025-01-14 14:59:59 = JST の 2025-01-14 23:59:59
    const beforeMidnight = new Date('2025-01-14T14:59:59.000Z');
    assert.strictEqual(getJstDate(beforeMidnight), 14);

    // UTC の 2025-01-14 15:00:00 = JST の 2025-01-15 00:00:00
    const afterMidnight = new Date('2025-01-14T15:00:00.000Z');
    assert.strictEqual(getJstDate(afterMidnight), 15);
  });
});

describe('getJstDay', () => {
  it('文字列から JST の曜日を取得する', () => {
    // 2025-01-05 は日曜日
    assert.strictEqual(getJstDay('2025-01-05'), 0);
    // 2025-01-06 は月曜日
    assert.strictEqual(getJstDay('2025-01-06'), 1);
    // 2025-01-11 は土曜日
    assert.strictEqual(getJstDay('2025-01-11'), 6);
  });

  it('Date オブジェクトから JST の曜日を取得する', () => {
    // UTC の 2025-01-05 15:00:00 = JST の 2025-01-06 00:00:00（月曜日）
    const date = new Date('2025-01-05T15:00:00.000Z');
    assert.strictEqual(getJstDay(date), 1);
  });

  it('曜日の境界を正しく扱う', () => {
    // UTC の 2025-01-05 14:59:59 = JST の 2025-01-05 23:59:59（日曜日）
    const beforeMidnight = new Date('2025-01-05T14:59:59.000Z');
    assert.strictEqual(getJstDay(beforeMidnight), 0);

    // UTC の 2025-01-05 15:00:00 = JST の 2025-01-06 00:00:00（月曜日）
    const afterMidnight = new Date('2025-01-05T15:00:00.000Z');
    assert.strictEqual(getJstDay(afterMidnight), 1);
  });
});
