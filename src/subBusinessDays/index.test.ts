import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createSubBusinessDays } from './index.js';
import { toJstDate } from '../_internal/jst.js';

describe('createSubBusinessDays', () => {
  // 2025-01-01 元日、2025-01-13 成人の日
  const mockHolidayDates = new Set(['2025-01-01', '2025-01-13']);
  const subBusinessDays = createSubBusinessDays(mockHolidayDates);

  describe('基本的な営業日計算', () => {
    it('営業日から 1 営業日前を計算できる', () => {
      // 2025-01-07（火）→ 2025-01-06（月）
      const result = subBusinessDays('2025-01-07', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });

    it('営業日から 3 営業日前を計算できる', () => {
      // 2025-01-09（木）→ 2025-01-06（月）
      const result = subBusinessDays('2025-01-09', 3);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });

    it('days が 0 の場合は当日を返す', () => {
      // 2025-01-06（月）→ 2025-01-06（月）
      const result = subBusinessDays('2025-01-06', 0);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });
  });

  describe('週末のスキップ', () => {
    it('土日をスキップして営業日を計算する', () => {
      // 2025-01-06（月）→ 1 営業日前 → 2025-01-03（金）
      const result = subBusinessDays('2025-01-06', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-03').getTime());
    });

    it('火曜から 5 営業日前は前週月曜になる', () => {
      // 2025-01-14（火）→ 5 営業日前 → 2025-01-06（月）
      // 13（月・成人の日）、12（日）、11（土）をスキップ
      const result = subBusinessDays('2025-01-14', 5);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });
  });

  describe('祝日のスキップ', () => {
    it('祝日をスキップして営業日を計算する', () => {
      // 2025-01-02（木）→ 1 営業日前 → 2024-12-31（火）（元日をスキップ）
      const result = subBusinessDays('2025-01-02', 1);
      assert.strictEqual(result.getTime(), toJstDate('2024-12-31').getTime());
    });

    it('連続する休日（土日+祝日）をスキップする', () => {
      // 2025-01-14（火）→ 1 営業日前 → 2025-01-10（金）
      // 13（月・成人の日）、12（日）、11（土）をスキップ
      const result = subBusinessDays('2025-01-14', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });
  });

  describe('休日からの計算', () => {
    it('土曜日から 1 営業日前を計算できる', () => {
      // 2025-01-04（土）→ 1 営業日前 → 2025-01-03（金）
      const result = subBusinessDays('2025-01-04', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-03').getTime());
    });

    it('祝日から 1 営業日前を計算できる', () => {
      // 2025-01-01（元日）→ 1 営業日前 → 2024-12-31（火）
      const result = subBusinessDays('2025-01-01', 1);
      assert.strictEqual(result.getTime(), toJstDate('2024-12-31').getTime());
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで営業日を計算できる', () => {
      const result = subBusinessDays(toJstDate('2025-01-07'), 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });
  });

  describe('Map をデータソースとして使用', () => {
    it('Map でも動作する', () => {
      const holidayNames = new Map([
        ['2025-01-01', '元日'],
        ['2025-01-13', '成人の日'],
      ]);
      const subBusinessDaysWithMap = createSubBusinessDays(holidayNames);
      const result = subBusinessDaysWithMap('2025-01-07', 1);
      assert.strictEqual(result.getTime(), toJstDate('2025-01-06').getTime());
    });
  });
});
