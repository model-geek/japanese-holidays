import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isWeekend } from './index.js';

describe('isWeekend', () => {
  describe('文字列入力', () => {
    it('土曜日の場合 true を返す', () => {
      assert.strictEqual(isWeekend('2025-01-04'), true);
    });

    it('日曜日の場合 true を返す', () => {
      assert.strictEqual(isWeekend('2025-01-05'), true);
    });

    it('月曜日の場合 false を返す', () => {
      assert.strictEqual(isWeekend('2025-01-06'), false);
    });

    it('火曜日の場合 false を返す', () => {
      assert.strictEqual(isWeekend('2025-01-07'), false);
    });

    it('水曜日の場合 false を返す', () => {
      assert.strictEqual(isWeekend('2025-01-08'), false);
    });

    it('木曜日の場合 false を返す', () => {
      assert.strictEqual(isWeekend('2025-01-09'), false);
    });

    it('金曜日の場合 false を返す', () => {
      assert.strictEqual(isWeekend('2025-01-10'), false);
    });
  });

  describe('Date オブジェクト入力', () => {
    it('土曜日の Date オブジェクトを受け付ける', () => {
      // JST 2025-01-04 00:00:00 = UTC 2025-01-03 15:00:00
      const date = new Date('2025-01-03T15:00:00.000Z');
      assert.strictEqual(isWeekend(date), true);
    });

    it('平日の Date オブジェクトを受け付ける', () => {
      // JST 2025-01-06 00:00:00 = UTC 2025-01-05 15:00:00
      const date = new Date('2025-01-05T15:00:00.000Z');
      assert.strictEqual(isWeekend(date), false);
    });
  });

  describe('タイムゾーン境界', () => {
    it('UTC で土曜日でも JST で日曜日なら true を返す', () => {
      // UTC 2025-01-04 23:00:00 = JST 2025-01-05 08:00:00（日曜日）
      const date = new Date('2025-01-04T23:00:00.000Z');
      assert.strictEqual(isWeekend(date), true);
    });

    it('UTC で日曜日でも JST で月曜日なら false を返す', () => {
      // UTC 2025-01-05 23:00:00 = JST 2025-01-06 08:00:00（月曜日）
      const date = new Date('2025-01-05T23:00:00.000Z');
      assert.strictEqual(isWeekend(date), false);
    });
  });
});
