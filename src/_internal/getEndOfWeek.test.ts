import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getEndOfWeek } from './getEndOfWeek.ts';

describe('getEndOfWeek', () => {
  describe('金曜日の取得', () => {
    it('月曜日から金曜日を返す', () => {
      // 2025-01-06 は月曜日
      const result = getEndOfWeek('2025-01-06');
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 10); // 金曜日
    });

    it('火曜日から金曜日を返す', () => {
      // 2025-01-07 は火曜日
      const result = getEndOfWeek('2025-01-07');
      assert.strictEqual(result.getDate(), 10);
    });

    it('水曜日から金曜日を返す', () => {
      // 2025-01-08 は水曜日
      const result = getEndOfWeek('2025-01-08');
      assert.strictEqual(result.getDate(), 10);
    });

    it('木曜日から金曜日を返す', () => {
      // 2025-01-09 は木曜日
      const result = getEndOfWeek('2025-01-09');
      assert.strictEqual(result.getDate(), 10);
    });

    it('金曜日から同じ金曜日を返す', () => {
      // 2025-01-10 は金曜日
      const result = getEndOfWeek('2025-01-10');
      assert.strictEqual(result.getDate(), 10);
    });

    it('土曜日から前の金曜日を返す', () => {
      // 2025-01-11 は土曜日
      const result = getEndOfWeek('2025-01-11');
      assert.strictEqual(result.getDate(), 10);
    });

    it('日曜日から次の金曜日を返す', () => {
      // 2025-01-12 は日曜日
      const result = getEndOfWeek('2025-01-12');
      assert.strictEqual(result.getDate(), 17);
    });
  });

  describe('月をまたぐ場合', () => {
    it('月をまたいで金曜日を返す', () => {
      // 2025-01-27 は月曜日、金曜日は 2025-01-31
      const result = getEndOfWeek('2025-01-27');
      assert.strictEqual(result.getFullYear(), 2025);
      assert.strictEqual(result.getMonth(), 0);
      assert.strictEqual(result.getDate(), 31);
    });
  });

  describe('入力形式', () => {
    it('Date オブジェクトを受け付ける', () => {
      const result = getEndOfWeek(new Date(2025, 0, 6));
      assert.strictEqual(result.getDate(), 10);
    });
  });

  describe('戻り値', () => {
    it('時刻は 00:00:00 になる', () => {
      const result = getEndOfWeek(new Date(2025, 0, 6, 14, 30, 45));
      assert.strictEqual(result.getHours(), 0);
      assert.strictEqual(result.getMinutes(), 0);
      assert.strictEqual(result.getSeconds(), 0);
    });
  });
});
