import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getEndOfMonth } from './getEndOfMonth.ts';
import { formatDate } from './formatDate.ts';

describe('getEndOfMonth', () => {
  describe('月末日の取得', () => {
    it('31 日の月の月末を返す', () => {
      const result = getEndOfMonth('2025-01-15');
      assert.strictEqual(formatDate(result), '2025-01-31');
    });

    it('30 日の月の月末を返す', () => {
      const result = getEndOfMonth('2025-04-10');
      assert.strictEqual(formatDate(result), '2025-04-30');
    });

    it('2 月（平年）の月末を返す', () => {
      const result = getEndOfMonth('2025-02-10');
      assert.strictEqual(formatDate(result), '2025-02-28');
    });

    it('2 月（うるう年）の月末を返す', () => {
      const result = getEndOfMonth('2024-02-10');
      assert.strictEqual(formatDate(result), '2024-02-29');
    });
  });

  describe('入力形式', () => {
    it('Date オブジェクトを受け付ける', () => {
      // UTC の 2024-12-31 15:00:00 = JST の 2025-01-01 00:00:00
      const input = new Date('2024-12-31T15:00:00.000Z');
      const result = getEndOfMonth(input);
      assert.strictEqual(formatDate(result), '2025-01-31');
    });

    it('月末日を渡しても同じ日付を返す', () => {
      const result = getEndOfMonth('2025-01-31');
      assert.strictEqual(formatDate(result), '2025-01-31');
    });

    it('月初日を渡しても月末を返す', () => {
      const result = getEndOfMonth('2025-01-01');
      assert.strictEqual(formatDate(result), '2025-01-31');
    });
  });

  describe('戻り値', () => {
    it('JST の 00:00:00 を返す', () => {
      const result = getEndOfMonth('2025-01-15');
      // JST の 2025-01-31 00:00:00 = UTC の 2025-01-30 15:00:00
      assert.strictEqual(result.toISOString(), '2025-01-30T15:00:00.000Z');
    });
  });
});
