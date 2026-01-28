import { describe, it } from 'node:test';
import assert from 'node:assert';
import { addDays } from './addDays.ts';

describe('addDays', () => {
  describe('日数の加算', () => {
    it('正の日数を加算する', () => {
      const result = addDays('2025-01-01', 5);
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 6);
    });

    it('月をまたぐ加算ができる', () => {
      const result = addDays('2025-01-30', 5);
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 1);
      assert.strictEqual(result.getDate(), 4);
    });

    it('年をまたぐ加算ができる', () => {
      const result = addDays('2025-12-30', 5);
      assert.strictEqual(result.getFullYear(), 2026);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 4);
    });
  });

  describe('日数の減算', () => {
    it('負の日数で減算する', () => {
      const result = addDays('2025-01-10', -5);
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 5);
    });

    it('月をまたぐ減算ができる', () => {
      const result = addDays('2025-02-03', -5);
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 29);
    });
  });

  describe('入力形式', () => {
    it('Date オブジェクトを受け付ける', () => {
      const result = addDays(new Date(2025, 0, 1), 5);
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 6);
    });

    it('0 日を加算すると同じ日付になる', () => {
      const result = addDays('2025-01-15', 0);
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 15);
    });
  });

  describe('戻り値', () => {
    it('時刻は 00:00:00 になる', () => {
      const result = addDays(new Date(2025, 0, 1, 14, 30, 45), 1);
      assert.strictEqual(result.getHours(), 0);
      assert.strictEqual(result.getMinutes(), 0);
      assert.strictEqual(result.getSeconds(), 0);
    });
  });
});
