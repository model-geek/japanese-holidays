import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isNationalHoliday,
  isWeekend,
  isHoliday,
  isBusinessDay,
  addBusinessDays,
  subBusinessDays,
  getNextBusinessDay,
  getPreviousBusinessDay,
  countBusinessDays,
  getLastBusinessDayOfMonth,
  getLastBusinessDayOfWeek,
} from './index.ts';
import { toJstDate } from './_internal/jst.ts';

describe('default: isNationalHoliday', () => {
  it('祝日の場合 true を返す', () => {
    assert.strictEqual(isNationalHoliday('2026-01-01'), true);
  });

  it('祝日でない場合 false を返す', () => {
    assert.strictEqual(isNationalHoliday('2026-01-02'), false);
  });

  it('Date オブジェクトを受け付ける', () => {
    assert.strictEqual(isNationalHoliday(toJstDate('2026-01-01')), true);
  });
});

describe('default: isWeekend', () => {
  it('土曜日の場合 true を返す', () => {
    assert.strictEqual(isWeekend('2026-01-03'), true);
  });

  it('日曜日の場合 true を返す', () => {
    assert.strictEqual(isWeekend('2026-01-04'), true);
  });

  it('平日の場合 false を返す', () => {
    assert.strictEqual(isWeekend('2026-01-05'), false);
  });
});

describe('default: isHoliday', () => {
  it('祝日の場合 true を返す', () => {
    assert.strictEqual(isHoliday('2026-01-01'), true);
  });

  it('土曜日の場合 true を返す', () => {
    assert.strictEqual(isHoliday('2026-01-03'), true);
  });

  it('日曜日の場合 true を返す', () => {
    assert.strictEqual(isHoliday('2026-01-04'), true);
  });

  it('祝日でも土日でもない場合 false を返す', () => {
    assert.strictEqual(isHoliday('2026-01-02'), false);
  });

  it('Date オブジェクトを受け付ける', () => {
    assert.strictEqual(isHoliday(toJstDate('2026-01-01')), true);
  });
});

describe('default: isBusinessDay', () => {
  it('営業日の場合 true を返す', () => {
    // 2026-01-02 は金曜日、祝日でない
    assert.strictEqual(isBusinessDay('2026-01-02'), true);
  });

  it('土曜日の場合 false を返す', () => {
    assert.strictEqual(isBusinessDay('2026-01-03'), false);
  });

  it('日曜日の場合 false を返す', () => {
    assert.strictEqual(isBusinessDay('2026-01-04'), false);
  });

  it('祝日の場合 false を返す', () => {
    assert.strictEqual(isBusinessDay('2026-01-01'), false);
  });

  it('Date オブジェクトを受け付ける', () => {
    assert.strictEqual(isBusinessDay(toJstDate('2026-01-02')), true);
  });
});

describe('default: addBusinessDays', () => {
  it('営業日を加算できる', () => {
    // 2026-01-02（金）→ 1 営業日後 → 2026-01-05（月）
    const result = addBusinessDays('2026-01-02', 1);
    assert.strictEqual(result.getTime(), toJstDate('2026-01-05').getTime());
  });

  it('Date オブジェクトを受け付ける', () => {
    const result = addBusinessDays(toJstDate('2026-01-02'), 1);
    assert.strictEqual(result.getTime(), toJstDate('2026-01-05').getTime());
  });
});

describe('default: subBusinessDays', () => {
  it('営業日を減算できる', () => {
    // 2026-01-05（月）→ 1 営業日前 → 2026-01-02（金）
    const result = subBusinessDays('2026-01-05', 1);
    assert.strictEqual(result.getTime(), toJstDate('2026-01-02').getTime());
  });

  it('Date オブジェクトを受け付ける', () => {
    const result = subBusinessDays(toJstDate('2026-01-05'), 1);
    assert.strictEqual(result.getTime(), toJstDate('2026-01-02').getTime());
  });
});

describe('default: getNextBusinessDay', () => {
  it('次の営業日を返す', () => {
    // 2026-01-02（金）→ 2026-01-05（月）
    const result = getNextBusinessDay('2026-01-02');
    assert.strictEqual(result.getTime(), toJstDate('2026-01-05').getTime());
  });

  it('Date オブジェクトを受け付ける', () => {
    const result = getNextBusinessDay(toJstDate('2026-01-02'));
    assert.strictEqual(result.getTime(), toJstDate('2026-01-05').getTime());
  });
});

describe('default: getPreviousBusinessDay', () => {
  it('前の営業日を返す', () => {
    // 2026-01-05（月）→ 2026-01-02（金）
    const result = getPreviousBusinessDay('2026-01-05');
    assert.strictEqual(result.getTime(), toJstDate('2026-01-02').getTime());
  });

  it('Date オブジェクトを受け付ける', () => {
    const result = getPreviousBusinessDay(toJstDate('2026-01-05'));
    assert.strictEqual(result.getTime(), toJstDate('2026-01-02').getTime());
  });
});

describe('default: countBusinessDays', () => {
  it('営業日数をカウントする', () => {
    // 2026-01-05（月）〜 2026-01-09（金）= 5 営業日
    assert.strictEqual(countBusinessDays('2026-01-05', '2026-01-09'), 5);
  });

  it('Date オブジェクトを受け付ける', () => {
    const result = countBusinessDays(toJstDate('2026-01-05'), toJstDate('2026-01-09'));
    assert.strictEqual(result, 5);
  });
});

describe('default: getLastBusinessDayOfMonth', () => {
  it('月末の最終営業日を返す', () => {
    // 2026-01-31（土）→ 2026-01-30（金）
    const result = getLastBusinessDayOfMonth('2026-01-15');
    assert.strictEqual(result.getTime(), toJstDate('2026-01-30').getTime());
  });

  it('Date オブジェクトを受け付ける', () => {
    const result = getLastBusinessDayOfMonth(toJstDate('2026-01-15'));
    assert.strictEqual(result.getTime(), toJstDate('2026-01-30').getTime());
  });
});

describe('default: getLastBusinessDayOfWeek', () => {
  it('週の最終営業日を返す', () => {
    // 2026-01-05（月）→ 2026-01-09（金）
    const result = getLastBusinessDayOfWeek('2026-01-05');
    assert.strictEqual(result.getTime(), toJstDate('2026-01-09').getTime());
  });

  it('Date オブジェクトを受け付ける', () => {
    const result = getLastBusinessDayOfWeek(toJstDate('2026-01-05'));
    assert.strictEqual(result.getTime(), toJstDate('2026-01-09').getTime());
  });
});
