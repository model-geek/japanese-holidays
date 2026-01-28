import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createIsNationalHoliday } from './index.js';

describe('createIsNationalHoliday', () => {
  const mockHolidayDates = new Set(['2025-01-01', '2025-01-13']);
  const isNationalHoliday = createIsNationalHoliday(mockHolidayDates);

  describe('文字列入力', () => {
    it('祝日の場合 true を返す', () => {
      assert.strictEqual(isNationalHoliday('2025-01-01'), true);
    });

    it('別の祝日でも true を返す', () => {
      assert.strictEqual(isNationalHoliday('2025-01-13'), true);
    });

    it('祝日でない場合 false を返す', () => {
      assert.strictEqual(isNationalHoliday('2025-01-02'), false);
    });
  });

  describe('Date オブジェクト入力', () => {
    it('祝日の Date オブジェクトを受け付ける', () => {
      // JST 2025-01-01 00:00:00 = UTC 2024-12-31 15:00:00
      const date = new Date('2024-12-31T15:00:00.000Z');
      assert.strictEqual(isNationalHoliday(date), true);
    });

    it('祝日でない Date オブジェクトでは false を返す', () => {
      // JST 2025-01-02 00:00:00 = UTC 2025-01-01 15:00:00
      const date = new Date('2025-01-01T15:00:00.000Z');
      assert.strictEqual(isNationalHoliday(date), false);
    });
  });

  describe('タイムゾーン境界', () => {
    it('UTC で前日でも JST で祝日なら true を返す', () => {
      // UTC 2024-12-31 20:00:00 = JST 2025-01-01 05:00:00（元日）
      const date = new Date('2024-12-31T20:00:00.000Z');
      assert.strictEqual(isNationalHoliday(date), true);
    });

    it('UTC で祝日でも JST で翌日なら false を返す', () => {
      // UTC 2025-01-01 20:00:00 = JST 2025-01-02 05:00:00（祝日ではない）
      const date = new Date('2025-01-01T20:00:00.000Z');
      assert.strictEqual(isNationalHoliday(date), false);
    });
  });

  describe('Map をデータソースとして使用', () => {
    it('Map でも動作する', () => {
      const mockHolidayNames = new Map([
        ['2025-01-01', '元日'],
        ['2025-01-13', '成人の日'],
      ]);
      const isNationalHolidayWithMap = createIsNationalHoliday(mockHolidayNames);
      assert.strictEqual(isNationalHolidayWithMap('2025-01-01'), true);
      assert.strictEqual(isNationalHolidayWithMap('2025-01-02'), false);
    });
  });
});
