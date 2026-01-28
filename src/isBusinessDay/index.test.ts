import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createIsBusinessDay } from './index.js';
import { toJstDate } from '../_internal/jst.js';

describe('createIsBusinessDay', () => {
  const mockHolidayDates = new Set(['2025-01-01', '2025-01-13']);
  const isBusinessDay = createIsBusinessDay(mockHolidayDates);

  describe('営業日の判定', () => {
    it('平日かつ祝日でない場合 true を返す', () => {
      // 2025-01-06 は月曜日、祝日でない
      assert.strictEqual(isBusinessDay('2025-01-06'), true);
    });

    it('火曜日で祝日でない場合 true を返す', () => {
      // 2025-01-07 は火曜日
      assert.strictEqual(isBusinessDay('2025-01-07'), true);
    });
  });

  describe('土日の判定', () => {
    it('土曜日の場合 false を返す', () => {
      // 2025-01-04 は土曜日
      assert.strictEqual(isBusinessDay('2025-01-04'), false);
    });

    it('日曜日の場合 false を返す', () => {
      // 2025-01-05 は日曜日
      assert.strictEqual(isBusinessDay('2025-01-05'), false);
    });
  });

  describe('祝日の判定', () => {
    it('祝日の場合 false を返す', () => {
      assert.strictEqual(isBusinessDay('2025-01-01'), false);
    });

    it('成人の日の場合 false を返す', () => {
      assert.strictEqual(isBusinessDay('2025-01-13'), false);
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで営業日を判定できる', () => {
      assert.strictEqual(isBusinessDay(toJstDate('2025-01-06')), true);
    });

    it('Date オブジェクトで土曜日を判定できる', () => {
      assert.strictEqual(isBusinessDay(toJstDate('2025-01-04')), false);
    });

    it('Date オブジェクトで祝日を判定できる', () => {
      assert.strictEqual(isBusinessDay(toJstDate('2025-01-01')), false);
    });
  });

  describe('Map をデータソースとして使用', () => {
    it('Map でも動作する', () => {
      const holidayNames = new Map([
        ['2025-01-01', '元日'],
        ['2025-01-13', '成人の日'],
      ]);
      const isBusinessDayWithMap = createIsBusinessDay(holidayNames);
      assert.strictEqual(isBusinessDayWithMap('2025-01-06'), true);
      assert.strictEqual(isBusinessDayWithMap('2025-01-01'), false);
    });
  });
});
