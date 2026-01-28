import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createGetHolidaysInRange } from './index.js';

describe('createGetHolidaysInRange', () => {
  const mockHolidayNames = new Map([
    ['2025-01-01', '元日'],
    ['2025-01-13', '成人の日'],
    ['2025-02-11', '建国記念の日'],
    ['2025-02-23', '天皇誕生日'],
    ['2025-02-24', '振替休日'],
  ]);
  const getHolidaysInRange = createGetHolidaysInRange(mockHolidayNames);

  describe('基本的な範囲検索', () => {
    it('範囲内の祝日を返す', () => {
      const holidays = getHolidaysInRange('2025-01-01', '2025-01-31');
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
      ]);
    });

    it('祝日がない範囲では空配列を返す', () => {
      const holidays = getHolidaysInRange('2025-03-01', '2025-03-31');
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
        { date: '2025-02-24', name: '振替休日' },
      ]);
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('開始日に Date オブジェクトを受け付ける', () => {
      const start = new Date(2025, 0, 1);
      const holidays = getHolidaysInRange(start, '2025-01-31');
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
      ]);
    });

    it('終了日に Date オブジェクトを受け付ける', () => {
      const end = new Date(2025, 0, 31);
      const holidays = getHolidaysInRange('2025-01-01', end);
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
      ]);
    });

    it('両方に Date オブジェクトを受け付ける', () => {
      const start = new Date(2025, 0, 1);
      const end = new Date(2025, 0, 31);
      const holidays = getHolidaysInRange(start, end);
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
      ]);
    });
  });

  describe('ソート順', () => {
    it('データの登録順に関係なく日付順で返す', () => {
      // 登録順を逆にしたデータ
      const unorderedData = new Map([
        ['2025-02-11', '建国記念の日'],
        ['2025-01-13', '成人の日'],
        ['2025-01-01', '元日'],
      ]);
      const getHolidaysUnordered = createGetHolidaysInRange(unorderedData);
      const holidays = getHolidaysUnordered('2025-01-01', '2025-02-28');
      assert.deepStrictEqual(holidays, [
        { date: '2025-01-01', name: '元日' },
        { date: '2025-01-13', name: '成人の日' },
        { date: '2025-02-11', name: '建国記念の日' },
      ]);
    });
  });
});
