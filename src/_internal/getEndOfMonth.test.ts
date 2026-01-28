import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getEndOfMonth } from './getEndOfMonth.ts';

describe('getEndOfMonth', () => {
  describe('月末日の取得', () => {
    it('31 日の月の月末を返す', () => {
      const result = getEndOfMonth('2025-01-15');
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 31);
    });

    it('30 日の月の月末を返す', () => {
      const result = getEndOfMonth('2025-04-10');
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 3);
      assert.strictEqual(result.getDate(), 30);
    });

    it('2 月（平年）の月末を返す', () => {
      const result = getEndOfMonth('2025-02-10');
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 1);
      assert.strictEqual(result.getDate(), 28);
    });

    it('2 月（うるう年）の月末を返す', () => {
      const result = getEndOfMonth('2024-02-10');
      assert.strictEqual(result.getFullYear(), 2024);
      assert.strictEqual(result.getMonth(), 1);
      assert.strictEqual(result.getDate(), 29);
    });
  });

  describe('入力形式', () => {
    it('Date オブジェクトを受け付ける', () => {
      const result = getEndOfMonth(new Date(2025, 0, 15));
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 31);
    });

    it('月末日を渡しても同じ日付を返す', () => {
      const result = getEndOfMonth('2025-01-31');
      assert.strictEqual(result.getDate(), 31);
    });

    it('月初日を渡しても月末を返す', () => {
      const result = getEndOfMonth('2025-01-01');
      assert.strictEqual(result.getDate(), 31);
    });
  });

  describe('戻り値', () => {
    it('時刻は 00:00:00 になる', () => {
      const result = getEndOfMonth(new Date(2025, 0, 15, 14, 30, 45));
      assert.strictEqual(result.getHours(), 0);
      assert.strictEqual(result.getMinutes(), 0);
      assert.strictEqual(result.getSeconds(), 0);
    });
  });
});
