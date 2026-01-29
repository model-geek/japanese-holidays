import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getNextBusinessDay } from './index.ts';
import { toJstDate } from '../_internal/jst.ts';

describe('getNextBusinessDay', () => {
  describe('営業日からの次の営業日', () => {
    it('月曜日の次の営業日は火曜日', () => {
      // 2025-01-06（月）→ 2025-01-07（火）
      const result = getNextBusinessDay('2025-01-06');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-07').getTime());
    });

    it('金曜日の次の営業日は翌週月曜日', () => {
      // 2025-01-03（金）→ 2025-01-06（月）
      const result = getNextBusinessDay('2025-01-03');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });
  });

  describe('休日からの次の営業日', () => {
    it('土曜日の次の営業日は月曜日', () => {
      // 2025-01-04（土）→ 2025-01-06（月）
      const result = getNextBusinessDay('2025-01-04');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });

    it('日曜日の次の営業日は月曜日', () => {
      // 2025-01-05（日）→ 2025-01-06（月）
      const result = getNextBusinessDay('2025-01-05');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });

    it('祝日の次の営業日を返す', () => {
      // 2025-01-01（元日）→ 2025-01-02（木）
      const result = getNextBusinessDay('2025-01-01');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-02').getTime());
    });
  });

  describe('連続した休日のスキップ', () => {
    it('祝日前の金曜から連続する休日をスキップする', () => {
      // 2025-01-10（金）→ 2025-01-14（火）
      // 11（土）、12（日）、13（月・成人の日）をスキップ
      const result = getNextBusinessDay('2025-01-10');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-14').getTime());
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで次の営業日を取得できる', () => {
      const result = getNextBusinessDay(toJstDate('2025-01-06'));
      assert.strictEqual(result.getTime(), toJstDate('2025-01-07').getTime());
    });
  });
});
