import { describe, it } from 'node:test';
import assert from 'node:assert';
import { toJstDate } from './toJstDate.ts';

describe('toJstDate', () => {
  describe('文字列入力', () => {
    it('YYYY-MM-DD 形式の文字列を JST の日付として解釈する', () => {
      const result = toJstDate('2025-01-01');
      // JST の 2025-01-01 00:00:00 は UTC の 2024-12-31 15:00:00
      assert.strictEqual(result.toISOString(), '2024-12-31T15:00:00.000Z');
    });

    it('年末の日付を正しく変換する', () => {
      const result = toJstDate('2025-12-31');
      // JST の 2025-12-31 00:00:00 は UTC の 2025-12-30 15:00:00
      assert.strictEqual(result.toISOString(), '2025-12-30T15:00:00.000Z');
    });
  });

  describe('Date 入力', () => {
    it('Date オブジェクトの JST での日付部分を抽出する', () => {
      // UTC の 2025-01-01 00:00:00 は JST の 2025-01-01 09:00:00
      const input = new Date('2025-01-01T00:00:00.000Z');
      const result = toJstDate(input);
      // JST の 2025-01-01 00:00:00 を返す
      assert.strictEqual(result.toISOString(), '2024-12-31T15:00:00.000Z');
    });

    it('JST で日付が変わる境界を正しく扱う', () => {
      // UTC の 2025-01-01 14:59:59 は JST の 2025-01-01 23:59:59
      const beforeMidnight = new Date('2025-01-01T14:59:59.000Z');
      const result1 = toJstDate(beforeMidnight);
      assert.strictEqual(result1.toISOString(), '2024-12-31T15:00:00.000Z');

      // UTC の 2025-01-01 15:00:00 は JST の 2025-01-02 00:00:00
      const afterMidnight = new Date('2025-01-01T15:00:00.000Z');
      const result2 = toJstDate(afterMidnight);
      assert.strictEqual(result2.toISOString(), '2025-01-01T15:00:00.000Z');
    });
  });
});
