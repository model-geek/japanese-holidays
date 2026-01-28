import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createGetPreviousBusinessDay } from './index.js';
import { toJstDate } from '../_internal/jst.js';

describe('createGetPreviousBusinessDay', () => {
  // 2025-01-01 元日、2025-01-13 成人の日
  const mockHolidayDates = new Set(['2025-01-01', '2025-01-13']);
  const getPreviousBusinessDay = createGetPreviousBusinessDay(mockHolidayDates);

  describe('営業日からの前の営業日', () => {
    it('火曜日の前の営業日は月曜日', () => {
      // 2025-01-07（火）→ 2025-01-06（月）
      const result = getPreviousBusinessDay('2025-01-07');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });

    it('月曜日の前の営業日は前週金曜日', () => {
      // 2025-01-06（月）→ 2025-01-03（金）
      const result = getPreviousBusinessDay('2025-01-06');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-03').getTime());
    });
  });

  describe('休日からの前の営業日', () => {
    it('土曜日の前の営業日は金曜日', () => {
      // 2025-01-04（土）→ 2025-01-03（金）
      const result = getPreviousBusinessDay('2025-01-04');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-03').getTime());
    });

    it('日曜日の前の営業日は金曜日', () => {
      // 2025-01-05（日）→ 2025-01-03（金）
      const result = getPreviousBusinessDay('2025-01-05');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-03').getTime());
    });

    it('祝日の前の営業日を返す', () => {
      // 2025-01-01（元日）→ 2024-12-31（火）
      const result = getPreviousBusinessDay('2025-01-01');
      assert.strictEqual(result.getTime(), toJstDate('2024-12-31').getTime());
    });
  });

  describe('連続した休日のスキップ', () => {
    it('祝日の翌日から連続する休日をスキップする', () => {
      // 2025-01-14（火）→ 2025-01-10（金）
      // 13（月・成人の日）、12（日）、11（土）をスキップ
      const result = getPreviousBusinessDay('2025-01-14');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで前の営業日を取得できる', () => {
      const result = getPreviousBusinessDay(toJstDate('2025-01-07'));
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });
  });

  describe('Map をデータソースとして使用', () => {
    it('Map でも動作する', () => {
      const holidayNames = new Map([
        ['2025-01-01', '元日'],
        ['2025-01-13', '成人の日'],
      ]);
      const getPreviousBusinessDayWithMap = createGetPreviousBusinessDay(holidayNames);
      const result = getPreviousBusinessDayWithMap('2025-01-07');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });
  });
});
