import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getLastBusinessDayOfMonth } from './index.ts';
import { toJstDate } from '../_internal/jst.ts';

describe('getLastBusinessDayOfMonth', () => {
  describe('月末が営業日の場合', () => {
    it('月末をそのまま返す', () => {
      // 2025-01-31（金）は営業日
      const result = getLastBusinessDayOfMonth('2025-01-15');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-31').getTime());
    });
  });

  describe('月末が土曜日の場合', () => {
    it('前の営業日（金曜日）を返す', () => {
      // 2025-05-31（土）→ 2025-05-30（金）
      const result = getLastBusinessDayOfMonth('2025-05-15');
      assert.strictEqual(result.getTime(), toJstDate('2025-05-30').getTime());
    });
  });

  describe('月末が日曜日の場合', () => {
    it('前の営業日（金曜日）を返す', () => {
      // 2025-08-31（日）→ 2025-08-29（金）
      const result = getLastBusinessDayOfMonth('2025-08-15');
      assert.strictEqual(result.getTime(), toJstDate('2025-08-29').getTime());
    });
  });

  describe('月初から取得', () => {
    it('月初からでも月末の最終営業日を返す', () => {
      // 2025-01-01 から 2025-01-31（金）を返す
      const result = getLastBusinessDayOfMonth('2025-01-01');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-31').getTime());
    });
  });

  describe('月末から取得', () => {
    it('月末からでも正しく動作する', () => {
      // 2025-01-31 から 2025-01-31 を返す
      const result = getLastBusinessDayOfMonth('2025-01-31');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-31').getTime());
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで月末の最終営業日を取得できる', () => {
      const result = getLastBusinessDayOfMonth(toJstDate('2025-01-15'));
      assert.strictEqual(result.getTime(), toJstDate('2025-01-31').getTime());
    });
  });
});
