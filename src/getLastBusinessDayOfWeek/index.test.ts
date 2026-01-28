import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createGetLastBusinessDayOfWeek } from './index.js';
import { toJstDate } from '../_internal/jst.js';

describe('createGetLastBusinessDayOfWeek', () => {
  // 2025-01-01 元日、2025-01-13 成人の日
  const mockHolidayDates = new Set(['2025-01-01', '2025-01-13']);
  const getLastBusinessDayOfWeek = createGetLastBusinessDayOfWeek(mockHolidayDates);

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

  describe('金曜日が祝日の場合', () => {
    it('前の営業日（木曜日）を返す', () => {
      // 2025-01-03（金）を祝日に設定
      const holidaysWithFriday = new Set(['2025-01-03']);
      const getLastBusinessDayOfWeekWithHoliday =
        createGetLastBusinessDayOfWeek(holidaysWithFriday);
      // 2025-01-06（月）の週の金曜は祝日 → 2025-01-02（木）
      // 注: getEndOfWeek は月曜始まりなので 2025-01-06 から見ると 2025-01-10
      // 2025-01-03（金）を祝日にしたので、2024-12-30（月）からの週を使う
      const result = getLastBusinessDayOfWeekWithHoliday('2024-12-30');
      // 2024-12-30（月）→ 金曜日は 2025-01-03（祝日）→ 2025-01-02（木）
      assert.strictEqual(result.getTime(), toJstDate('2025-01-02').getTime());
    });
  });

  describe('金曜日と木曜日が連続して祝日の場合', () => {
    it('水曜日を返す', () => {
      // 2025-01-09（木）、2025-01-10（金）を祝日に設定
      const holidaysWithThursFri = new Set(['2025-01-09', '2025-01-10']);
      const getLastBusinessDayOfWeekWithHolidays =
        createGetLastBusinessDayOfWeek(holidaysWithThursFri);
      // 2025-01-06（月）→ 金曜 2025-01-10（祝日）→ 木曜 2025-01-09（祝日）→ 2025-01-08（水）
      const result = getLastBusinessDayOfWeekWithHolidays('2025-01-06');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-08').getTime());
    });
  });

  describe('Date オブジェクトの受け付け', () => {
    it('Date オブジェクトで週の最終営業日を取得できる', () => {
      const result = getLastBusinessDayOfWeek(toJstDate('2025-01-06'));
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });
  });

  describe('Map をデータソースとして使用', () => {
    it('Map でも動作する', () => {
      const holidayNames = new Map([
        ['2025-01-01', '元日'],
        ['2025-01-13', '成人の日'],
      ]);
      const getLastBusinessDayOfWeekWithMap =
        createGetLastBusinessDayOfWeek(holidayNames);
      const result = getLastBusinessDayOfWeekWithMap('2025-01-06');
      assert.strictEqual(result.getTime(), toJstDate('2025-01-10').getTime());
    });
  });
});
