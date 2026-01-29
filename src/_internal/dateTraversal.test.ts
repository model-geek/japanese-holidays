import { describe, it } from 'node:test';
import assert from 'node:assert';
import { findNext, findPrev, advance, rewind, count, collect } from './dateTraversal.ts';
import { toJstDate, getJstDay, getJstDate } from './jst.ts';
import { formatDate } from './formatDate.ts';

/** 平日かどうかを判定する（土日以外、JST ベース） */
const isWeekday = (date: Date): boolean => {
  const day = getJstDay(date);
  return day !== 0 && day !== 6;
};

/** 週末かどうかを判定する（土日、JST ベース） */
const isWeekend = (date: Date): boolean => {
  const day = getJstDay(date);
  return day === 0 || day === 6;
};

/** 偶数日かどうかを判定する（JST ベース） */
const isEvenDay = (date: Date): boolean => getJstDate(date) % 2 === 0;

describe('dateTraversal', () => {
  describe('findNext', () => {
    it('現在の日付が条件を満たす場合、その日付を返す', () => {
      const monday = toJstDate('2025-01-06'); // 月曜日
      const result = findNext(monday, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-06');
    });

    it('現在の日付が条件を満たさない場合、次の条件を満たす日付を返す', () => {
      const saturday = toJstDate('2025-01-04'); // 土曜日
      const result = findNext(saturday, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-06'); // 次の月曜日
    });

    it('日曜日から次の平日を探す', () => {
      const sunday = toJstDate('2025-01-05'); // 日曜日
      const result = findNext(sunday, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-06'); // 月曜日
    });

    it('金曜日から次の週末を探す', () => {
      const friday = toJstDate('2025-01-03'); // 金曜日
      const result = findNext(friday, isWeekend);
      assert.strictEqual(formatDate(result), '2025-01-04'); // 土曜日
    });
  });

  describe('findPrev', () => {
    it('現在の日付が条件を満たす場合、その日付を返す', () => {
      const monday = toJstDate('2025-01-06'); // 月曜日
      const result = findPrev(monday, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-06');
    });

    it('現在の日付が条件を満たさない場合、前の条件を満たす日付を返す', () => {
      const sunday = toJstDate('2025-01-05'); // 日曜日
      const result = findPrev(sunday, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-03'); // 前の金曜日
    });

    it('土曜日から前の平日を探す', () => {
      const saturday = toJstDate('2025-01-04'); // 土曜日
      const result = findPrev(saturday, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-03'); // 金曜日
    });

    it('月曜日から前の週末を探す', () => {
      const monday = toJstDate('2025-01-06'); // 月曜日
      const result = findPrev(monday, isWeekend);
      assert.strictEqual(formatDate(result), '2025-01-05'); // 日曜日
    });
  });

  describe('advance', () => {
    it('remaining が 0 以下の場合、現在の日付を返す', () => {
      const date = toJstDate('2025-01-01');
      const result = advance(date, 0, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-01');
    });

    it('remaining が負の場合、現在の日付を返す', () => {
      const date = toJstDate('2025-01-01');
      const result = advance(date, -1, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-01');
    });

    it('平日を 1 日進める', () => {
      const monday = toJstDate('2025-01-06'); // 月曜日
      const result = advance(monday, 1, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-07'); // 火曜日
    });

    it('平日を 5 日進める（週末をスキップ）', () => {
      const monday = toJstDate('2025-01-06'); // 月曜日
      const result = advance(monday, 5, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-13'); // 次週の月曜日
    });

    it('金曜日から平日を 1 日進める（週末をスキップ）', () => {
      const friday = toJstDate('2025-01-03'); // 金曜日
      const result = advance(friday, 1, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-06'); // 月曜日
    });

    it('週末を 2 日進める', () => {
      const saturday = toJstDate('2025-01-04'); // 土曜日
      const result = advance(saturday, 2, isWeekend);
      // 01-04 (土) から進める → 01-05 (日) が 1 日目 → 01-11 (土) が 2 日目
      assert.strictEqual(formatDate(result), '2025-01-11');
    });
  });

  describe('rewind', () => {
    it('remaining が 0 以下の場合、現在の日付を返す', () => {
      const date = toJstDate('2025-01-10');
      const result = rewind(date, 0, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-10');
    });

    it('remaining が負の場合、現在の日付を返す', () => {
      const date = toJstDate('2025-01-10');
      const result = rewind(date, -1, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-10');
    });

    it('平日を 1 日戻る', () => {
      const tuesday = toJstDate('2025-01-07'); // 火曜日
      const result = rewind(tuesday, 1, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-06'); // 月曜日
    });

    it('平日を 5 日戻る（週末をスキップ）', () => {
      const friday = toJstDate('2025-01-10'); // 金曜日
      const result = rewind(friday, 5, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-03'); // 前週の金曜日
    });

    it('月曜日から平日を 1 日戻る（週末をスキップ）', () => {
      const monday = toJstDate('2025-01-06'); // 月曜日
      const result = rewind(monday, 1, isWeekday);
      assert.strictEqual(formatDate(result), '2025-01-03'); // 金曜日
    });

    it('週末を 2 日戻る', () => {
      const sunday = toJstDate('2025-01-12'); // 日曜日
      const result = rewind(sunday, 2, isWeekend);
      assert.strictEqual(formatDate(result), '2025-01-05'); // 前週の日曜日
    });
  });

  describe('count', () => {
    it('範囲内の条件を満たす日数をカウントする', () => {
      const start = toJstDate('2025-01-06'); // 月曜日
      const end = toJstDate('2025-01-12'); // 日曜日
      const result = count(start, end, isWeekday);
      assert.strictEqual(result, 5); // 月〜金
    });

    it('範囲が逆の場合は 0 を返す', () => {
      const start = toJstDate('2025-01-12');
      const end = toJstDate('2025-01-06');
      const result = count(start, end, isWeekday);
      assert.strictEqual(result, 0);
    });

    it('同じ日付で条件を満たす場合は 1 を返す', () => {
      const date = toJstDate('2025-01-06'); // 月曜日
      const result = count(date, date, isWeekday);
      assert.strictEqual(result, 1);
    });

    it('同じ日付で条件を満たさない場合は 0 を返す', () => {
      const date = toJstDate('2025-01-04'); // 土曜日
      const result = count(date, date, isWeekday);
      assert.strictEqual(result, 0);
    });

    it('週末の日数をカウントする', () => {
      const start = toJstDate('2025-01-01');
      const end = toJstDate('2025-01-31');
      const result = count(start, end, isWeekend);
      // 2025年1月: 4, 5, 11, 12, 18, 19, 25, 26 = 8日
      assert.strictEqual(result, 8);
    });

    it('初期アキュムレータを指定する', () => {
      const start = toJstDate('2025-01-06');
      const end = toJstDate('2025-01-10');
      const result = count(start, end, isWeekday, 10);
      assert.strictEqual(result, 15); // 10 + 5
    });
  });

  describe('collect', () => {
    it('範囲内の日付を変換して収集する', () => {
      const start = toJstDate('2025-01-01');
      const end = toJstDate('2025-01-05');
      const result = collect(start, end, (date) => formatDate(date));
      assert.deepStrictEqual(result, [
        '2025-01-01',
        '2025-01-02',
        '2025-01-03',
        '2025-01-04',
        '2025-01-05',
      ]);
    });

    it('undefined を返す場合はスキップする', () => {
      const start = toJstDate('2025-01-01');
      const end = toJstDate('2025-01-10');
      const result = collect(start, end, (date) =>
        isEvenDay(date) ? formatDate(date) : undefined
      );
      assert.deepStrictEqual(result, [
        '2025-01-02',
        '2025-01-04',
        '2025-01-06',
        '2025-01-08',
        '2025-01-10',
      ]);
    });

    it('範囲が逆の場合は空配列を返す', () => {
      const start = toJstDate('2025-01-10');
      const end = toJstDate('2025-01-01');
      const result = collect(start, end, (date) => formatDate(date));
      assert.deepStrictEqual(result, []);
    });

    it('同じ日付の範囲で結果を返す', () => {
      const date = toJstDate('2025-01-01');
      const result = collect(date, date, (d) => formatDate(d));
      assert.deepStrictEqual(result, ['2025-01-01']);
    });

    it('全て undefined の場合は空配列を返す', () => {
      const start = toJstDate('2025-01-01');
      const end = toJstDate('2025-01-05');
      const result = collect(start, end, () => undefined);
      assert.deepStrictEqual(result, []);
    });

    it('オブジェクトを収集する', () => {
      const start = toJstDate('2025-01-04'); // 土曜日
      const end = toJstDate('2025-01-05'); // 日曜日
      const result = collect(start, end, (date) => ({
        date: formatDate(date),
        dayOfWeek: getJstDay(date),
      }));
      assert.deepStrictEqual(result, [
        { date: '2025-01-04', dayOfWeek: 6 },
        { date: '2025-01-05', dayOfWeek: 0 },
      ]);
    });

    it('初期アキュムレータを指定する', () => {
      const start = toJstDate('2025-01-01');
      const end = toJstDate('2025-01-03');
      const initial = ['2024-12-31'];
      const result = collect(start, end, (date) => formatDate(date), initial);
      assert.deepStrictEqual(result, [
        '2024-12-31',
        '2025-01-01',
        '2025-01-02',
        '2025-01-03',
      ]);
    });
  });
});
