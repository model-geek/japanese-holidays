import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createGetHolidayName } from './index.js';

describe('createGetHolidayName', () => {
  const mockHolidayNames = new Map([
    ['2025-01-01', '元日'],
    ['2025-01-13', '成人の日'],
    ['2025-02-11', '建国記念の日'],
  ]);
  const getHolidayName = createGetHolidayName(mockHolidayNames);

  describe('文字列入力', () => {
    it('祝日の場合は祝日名を返す', () => {
      assert.strictEqual(getHolidayName('2025-01-01'), '元日');
    });

    it('別の祝日でも祝日名を返す', () => {
      assert.strictEqual(getHolidayName('2025-01-13'), '成人の日');
    });

    it('祝日でない場合は undefined を返す', () => {
      assert.strictEqual(getHolidayName('2025-01-02'), undefined);
    });
  });

  describe('Date オブジェクト入力', () => {
    it('祝日の Date オブジェクトを受け付ける', () => {
      // JST 2025-01-01 00:00:00 = UTC 2024-12-31 15:00:00
      const date = new Date('2024-12-31T15:00:00.000Z');
      assert.strictEqual(getHolidayName(date), '元日');
    });

    it('祝日でない Date オブジェクトでは undefined を返す', () => {
      // JST 2025-01-02 00:00:00 = UTC 2025-01-01 15:00:00
      const date = new Date('2025-01-01T15:00:00.000Z');
      assert.strictEqual(getHolidayName(date), undefined);
    });
  });

  describe('タイムゾーン境界', () => {
    it('UTC で前日でも JST で祝日なら祝日名を返す', () => {
      // UTC 2024-12-31 20:00:00 = JST 2025-01-01 05:00:00（元日）
      const date = new Date('2024-12-31T20:00:00.000Z');
      assert.strictEqual(getHolidayName(date), '元日');
    });

    it('UTC で祝日でも JST で翌日なら undefined を返す', () => {
      // UTC 2025-01-01 20:00:00 = JST 2025-01-02 05:00:00（祝日ではない）
      const date = new Date('2025-01-01T20:00:00.000Z');
      assert.strictEqual(getHolidayName(date), undefined);
    });
  });
});
