import { describe, it } from 'node:test';
import assert from 'node:assert';
import { countBusinessDays } from './index.ts';
import { toJstDate } from '../_internal/jst.ts';

describe('countBusinessDays', () => {
  describe('基本的な営業日カウント', () => {
    it('連続する営業日をカウントする', () => {
      // 2025-01-06（月）〜 2025-01-09（木）= 4 営業日
      assert.strictEqual(countBusinessDays('2025-01-06', '2025-01-09'), 4);
    });

    it('同じ日付の場合は 1 を返す', () => {
      // 2025-01-06（月）= 1 営業日
      assert.strictEqual(countBusinessDays('2025-01-06', '2025-01-06'), 1);
    });

    it('1 週間の営業日をカウントする', () => {
      // 2025-01-06（月）〜 2025-01-10（金）= 5 営業日
      assert.strictEqual(countBusinessDays('2025-01-06', '2025-01-10'), 5);
    });
  });

  describe('週末のスキップ', () => {
    it('土日を除いてカウントする', () => {
      // 2025-01-03（金）〜 2025-01-06（月）
      // 金（営業日）、土（休日）、日（休日）、月（営業日）= 2 営業日
      assert.strictEqual(countBusinessDays('2025-01-03', '2025-01-06'), 2);
    });

    it('土曜日のみの場合は 0 を返す', () => {
      // 2025-01-04（土）= 0 営業日
      assert.strictEqual(countBusinessDays('2025-01-04', '2025-01-04'), 0);
    });

    it('土日のみの場合は 0 を返す', () => {
      // 2025-01-04（土）〜 2025-01-05（日）= 0 営業日
      assert.strictEqual(countBusinessDays('2025-01-04', '2025-01-05'), 0);
    });
  });

  describe('祝日のスキップ', () => {
    it('祝日を除いてカウントする', () => {
      // 2024-12-31（火）〜 2025-01-02（木）
      // 火（営業日）、水・元日（休日）、木（営業日）= 2 営業日
      assert.strictEqual(countBusinessDays('2024-12-31', '2025-01-02'), 2);
    });

    it('祝日のみの場合は 0 を返す', () => {
      // 2025-01-01（元日）= 0 営業日
      assert.strictEqual(countBusinessDays('2025-01-01', '2025-01-01'), 0);
    });
  });

  describe('連続した休日を含む期間', () => {
    it('土日 + 祝日を除いてカウントする', () => {
      // 2025-01-10（金）〜 2025-01-14（火）
      // 金（営業日）、土（休日）、日（休日）、月・成人の日（休日）、火（営業日）= 2 営業日
      assert.strictEqual(countBusinessDays('2025-01-10', '2025-01-14'), 2);
    });
  });

  describe('逆順の日付', () => {
    it('start > end の場合は負の値を返す', () => {
      // 2025-01-09（木）〜 2025-01-06（月）= -4 営業日
      assert.strictEqual(countBusinessDays('2025-01-09', '2025-01-06'), -4);
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで営業日をカウントできる', () => {
      const result = countBusinessDays(toJstDate('2025-01-06'), toJstDate('2025-01-09'));
      assert.strictEqual(result, 4);
    });
  });
});
