import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getLastBusinessDayOfWeek } from './index.js';
import { toJstDate } from '../_internal/jst.js';

describe('getLastBusinessDayOfWeek', () => {
  describe('金曜日が営業日の場合', () => {
    it('月曜日からその週の金曜日を返す', () => {
      // 2025-01-06（月）→ 2025-01-10（金）
      const result = getLastBusinessDayOfWeek('2025-01-06');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });

    it('水曜日からその週の金曜日を返す', () => {
      // 2025-01-08（水）→ 2025-01-10（金）
      const result = getLastBusinessDayOfWeek('2025-01-08');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });

    it('金曜日からその週の金曜日を返す', () => {
      // 2025-01-10（金）→ 2025-01-10（金）
      const result = getLastBusinessDayOfWeek('2025-01-10');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });
  });

  describe('土日からの取得', () => {
    it('土曜日から前の金曜日を返す', () => {
      // 2025-01-11（土）→ 2025-01-10（金）
      const result = getLastBusinessDayOfWeek('2025-01-11');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });

    it('日曜日から次の金曜日を返す', () => {
      // 2025-01-12（日）→ 2025-01-17（金）
      const result = getLastBusinessDayOfWeek('2025-01-12');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-17').getTime());
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで週の最終営業日を取得できる', () => {
      const result = getLastBusinessDayOfWeek(toJstDate('2025-01-06'));
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });
  });
});
