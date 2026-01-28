import { describe, it } from 'node:test';
import assert from 'node:assert';
import { addDays } from './addDays.ts';
import { formatDate } from './formatDate.ts';

describe('addDays', () => {
  describe('日数の加算', () => {
    it('正の日数を加算する', () => {
      const result = addDays('2025-01-01', 5);
      assert.strictEqual(formatDate(result), '2025-01-06');
    });

    it('月をまたぐ加算ができる', () => {
      const result = addDays('2025-01-30', 5);
      assert.strictEqual(formatDate(result), '2025-02-04');
    });

    it('年をまたぐ加算ができる', () => {
      const result = addDays('2025-12-30', 5);
      assert.strictEqual(formatDate(result), '2026-01-04');
    });
  });

  describe('日数の減算', () => {
    it('負の日数で減算する', () => {
      const result = addDays('2025-01-10', -5);
      assert.strictEqual(formatDate(result), '2025-01-05');
    });

    it('月をまたぐ減算ができる', () => {
      const result = addDays('2025-02-03', -5);
      assert.strictEqual(formatDate(result), '2025-01-29');
    });
  });

  describe('入力形式', () => {
    it('Date オブジェクトを受け付ける', () => {
      // UTC の 2024-12-31 15:00:00 = JST の 2025-01-01 00:00:00
      const input = new Date('2024-12-31T15:00:00.000Z');
      const result = addDays(input, 5);
      assert.strictEqual(formatDate(result), '2025-01-06');
    });

    it('0 日を加算すると同じ日付になる', () => {
      const result = addDays('2025-01-15', 0);
      assert.strictEqual(formatDate(result), '2025-01-15');
    });
  });

  describe('戻り値', () => {
    it('JST の 00:00:00 を返す', () => {
      const result = addDays('2025-01-01', 1);
      // JST の 2025-01-02 00:00:00 = UTC の 2025-01-01 15:00:00
      assert.strictEqual(result.toISOString(), '2025-01-01T15:00:00.000Z');
    });
  });
});
