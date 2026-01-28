import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getEndOfWeek } from './getEndOfWeek.ts';
import { formatDate } from './formatDate.ts';

describe('getEndOfWeek', () => {
  describe('金曜日の取得', () => {
    it('月曜日から金曜日を返す', () => {
      // 2025-01-06 は月曜日
      const result = getEndOfWeek('2025-01-06');
      assert.strictEqual(formatDate(result), '2025-01-10');
    });

    it('火曜日から金曜日を返す', () => {
      // 2025-01-07 は火曜日
      const result = getEndOfWeek('2025-01-07');
      assert.strictEqual(formatDate(result), '2025-01-10');
    });

    it('水曜日から金曜日を返す', () => {
      // 2025-01-08 は水曜日
      const result = getEndOfWeek('2025-01-08');
      assert.strictEqual(formatDate(result), '2025-01-10');
    });

    it('木曜日から金曜日を返す', () => {
      // 2025-01-09 は木曜日
      const result = getEndOfWeek('2025-01-09');
      assert.strictEqual(formatDate(result), '2025-01-10');
    });

    it('金曜日から同じ金曜日を返す', () => {
      // 2025-01-10 は金曜日
      const result = getEndOfWeek('2025-01-10');
      assert.strictEqual(formatDate(result), '2025-01-10');
    });

    it('土曜日から前の金曜日を返す', () => {
      // 2025-01-11 は土曜日
      const result = getEndOfWeek('2025-01-11');
      assert.strictEqual(formatDate(result), '2025-01-10');
    });

    it('日曜日から次の金曜日を返す', () => {
      // 2025-01-12 は日曜日
      const result = getEndOfWeek('2025-01-12');
      assert.strictEqual(formatDate(result), '2025-01-17');
    });
  });

  describe('月をまたぐ場合', () => {
    it('月をまたいで金曜日を返す', () => {
      // 2025-01-27 は月曜日、金曜日は 2025-01-31
      const result = getEndOfWeek('2025-01-27');
      assert.strictEqual(formatDate(result), '2025-01-31');
    });
  });

  describe('入力形式', () => {
    it('Date オブジェクトを受け付ける', () => {
      // UTC の 2025-01-05 15:00:00 = JST の 2025-01-06 00:00:00（月曜日）
      const input = new Date('2025-01-05T15:00:00.000Z');
      const result = getEndOfWeek(input);
      assert.strictEqual(formatDate(result), '2025-01-10');
    });
  });

  describe('戻り値', () => {
    it('JST の 00:00:00 を返す', () => {
      const result = getEndOfWeek('2025-01-06');
      // JST の 2025-01-10 00:00:00 = UTC の 2025-01-09 15:00:00
      assert.strictEqual(result.toISOString(), '2025-01-09T15:00:00.000Z');
    });
  });
});
