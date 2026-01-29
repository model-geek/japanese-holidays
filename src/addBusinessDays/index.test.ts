import { describe, it } from 'node:test';
import assert from 'node:assert';
import { addBusinessDays } from './index.js';
import { toJstDate } from '../_internal/jst.js';

describe('addBusinessDays', () => {
  describe('基本的な営業日計算', () => {
    it('営業日から 1 営業日後を計算できる', () => {
      // 2025-01-06（月）→ 2025-01-07（火）
      const result = addBusinessDays('2025-01-06', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-07').getTime());
    });

    it('営業日から 3 営業日後を計算できる', () => {
      // 2025-01-06（月）→ 2025-01-09（木）
      const result = addBusinessDays('2025-01-06', 3);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-09').getTime());
    });

    it('days が 0 の場合は当日を返す', () => {
      // 2025-01-06（月）→ 2025-01-06（月）
      const result = addBusinessDays('2025-01-06', 0);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });
  });

  describe('週末のスキップ', () => {
    it('土日をスキップして営業日を計算する', () => {
      // 2025-01-03（金）→ 1 営業日後 → 2025-01-06（月）
      const result = addBusinessDays('2025-01-03', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });

    it('金曜から 5 営業日後は翌週金曜になる', () => {
      // 2025-01-03（金）→ 5 営業日後 → 2025-01-10（金）
      const result = addBusinessDays('2025-01-03', 5);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });
  });

  describe('祝日のスキップ', () => {
    it('祝日をスキップして営業日を計算する', () => {
      // 2024-12-31（火）→ 1 営業日後 → 2025-01-02（木）（元日をスキップ）
      const result = addBusinessDays('2024-12-31', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-02').getTime());
    });

    it('連続する休日（祝日+土日）をスキップする', () => {
      // 2025-01-10（金）→ 1 営業日後 → 2025-01-14（火）
      // 11（土）、12（日）、13（月・成人の日）をスキップ
      const result = addBusinessDays('2025-01-10', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-14').getTime());
    });
  });

  describe('休日からの計算', () => {
    it('土曜日から 1 営業日後を計算できる', () => {
      // 2025-01-04（土）→ 1 営業日後 → 2025-01-06（月）
      const result = addBusinessDays('2025-01-04', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });

    it('祝日から 1 営業日後を計算できる', () => {
      // 2025-01-01（元日）→ 1 営業日後 → 2025-01-02（木）
      const result = addBusinessDays('2025-01-01', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-02').getTime());
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで営業日を計算できる', () => {
      const result = addBusinessDays(toJstDate('2025-01-06'), 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-07').getTime());
    });
  });
});
