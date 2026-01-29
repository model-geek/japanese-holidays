import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getHolidaysInRange } from './index.ts';
import { toJstDate } from '../_internal/jst.ts';

describe('getHolidaysInRange', () => {
  describe('基本的な範囲検索', () => {
    it('範囲内の祝日を返す', () => {
      const holidays = getHolidaysInRange('2025-01-01', '2025-01-31');
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
      ]);
    });

    it('祝日がない範囲では空配列を返す', () => {
      const holidays = getHolidaysInRange('2025-06-01', '2025-06-15');
      assert.deepStrictEqual(holidays, []);
    });

    it('範囲の境界を含む', () => {
      const holidays = getHolidaysInRange('2025-01-01', '2025-01-01');
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
      ]);
    });
  });

  describe('複数月にまたがる範囲', () => {
    it('2ヶ月にまたがる祝日を返す', () => {
      const holidays = getHolidaysInRange('2025-01-10', '2025-02-15');
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-13', name: '成人の日' },
        { date: '2025-02-11', name: '建国記念の日' },
      ]);
    });

    it('全期間の祝日を日付順で返す', () => {
      const holidays = getHolidaysInRange('2025-01-01', '2025-02-28');
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
        { date: '2025-02-11', name: '建国記念の日' },
        { date: '2025-02-23', name: '天皇誕生日' },
        { date: '2025-02-24', name: '休日' },
      ]);
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('開始日に Date オブジェクトを受け付ける', () => {
      const holidays = getHolidaysInRange(toJstDate('2025-01-01'), '2025-01-31');
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
      ]);
    });

    it('終了日に Date オブジェクトを受け付ける', () => {
      const holidays = getHolidaysInRange('2025-01-01', toJstDate('2025-01-31'));
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
      ]);
    });

    it('両方に Date オブジェクトを受け付ける', () => {
      const holidays = getHolidaysInRange(
        toJstDate('2025-01-01'),
        toJstDate('2025-01-31'),
      );
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
      ]);
    });
  });

  describe('祝日名の確認', () => {
    it('振替休日は「休日」として返す', () => {
      // 2025-02-23 (日) の振替休日
      const holidays = getHolidaysInRange('2025-02-24', '2025-02-24');
      assert.deepStrictEqual(holidays, [
        { date: '2025-02-24', name: '休日' },
      ]);
    });

    it('国民の休日は「休日」として返す', () => {
      // 2009-09-22 は敬老の日と秋分の日に挟まれた国民の休日
      const holidays = getHolidaysInRange('2009-09-21', '2009-09-23');
      assert.deepStrictEqual(holidays, [
        { date: '2009-09-21', name: '敬老の日' },
        { date: '2009-09-22', name: '休日' },
        { date: '2009-09-23', name: '秋分の日' },
      ]);
    });
  });
});
