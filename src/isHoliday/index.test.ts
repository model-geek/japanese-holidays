import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createIsHoliday } from './index.js';
import { toJstDate } from '../_internal/jst.js';

describe('createIsHoliday', () => {
  const mockHolidayDates = new Set(['2025-01-01', '2025-01-13']);
  const isHoliday = createIsHoliday(mockHolidayDates);

  describe('祝日の判定', () => {
    it('祝日の場合 true を返す', () => {
      assert.strictEqual(isHoliday('2025-01-01'), true);
    });

    it('祝日でも土日でもない場合 false を返す', () => {
      assert.strictEqual(isHoliday('2025-01-02'), false);
    });
  });

  describe('土日の判定', () => {
    it('土曜日の場合 true を返す', () => {
      // 2025-01-04 は土曜日
      assert.strictEqual(isHoliday('2025-01-04'), true);
    });

    it('日曜日の場合 true を返す', () => {
      // 2025-01-05 は日曜日
      assert.strictEqual(isHoliday('2025-01-05'), true);
    });
  });

  describe('平日の判定', () => {
    it('月曜日で祝日でない場合 false を返す', () => {
      // 2025-01-06 は月曜日
      assert.strictEqual(isHoliday('2025-01-06'), false);
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで祝日を判定できる', () => {
      assert.strictEqual(isHoliday(toJstDate('2025-01-01')), true);
    });

    it('Date オブジェクトで土曜日を判定できる', () => {
      assert.strictEqual(isHoliday(toJstDate('2025-01-04')), true);
    });

    it('Date オブジェクトで平日を判定できる', () => {
      assert.strictEqual(isHoliday(toJstDate('2025-01-06')), false);
    });
  });

  describe('祝日かつ土日の場合', () => {
    it('祝日が土曜日と重なる場合 true を返す', () => {
      // テスト用のモックデータで土曜日が祝日の場合を想定
      const saturdayHoliday = new Set(['2025-01-04']);
      const isHolidaySat = createIsHoliday(saturdayHoliday);
      assert.strictEqual(isHolidaySat('2025-01-04'), true);
    });
  });

  describe('Map をデータソースとして使用', () => {
    it('Map でも動作する', () => {
      const holidayNames = new Map([
        ['2025-01-01', '元日'],
        ['2025-01-13', '成人の日'],
      ]);
      const isHolidayWithMap = createIsHoliday(holidayNames);
      assert.strictEqual(isHolidayWithMap('2025-01-01'), true);
      assert.strictEqual(isHolidayWithMap('2025-01-02'), false);
    });
  });
});
