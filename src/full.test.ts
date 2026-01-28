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
  getHolidayName,
  getHolidaysInRange,
} from './full.ts';
import { toJstDate } from './_internal/jst.js';

describe('full: isNationalHoliday', () => {
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

describe('full: isWeekend', () => {
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

describe('full: isHoliday', () => {
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

describe('full: isBusinessDay', () => {
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

describe('full: getHolidayName', () => {
  it('祝日の場合は祝日名を返す', () => {
    assert.strictEqual(getHolidayName('2026-01-01'), '元日');
  });

  it('祝日でない場合は undefined を返す', () => {
    assert.strictEqual(getHolidayName('2026-01-02'), undefined);
  });

  it('Date オブジェクトを受け付ける', () => {
    assert.strictEqual(getHolidayName(toJstDate('2026-01-01')), '元日');
  });
});

describe('full: getHolidaysInRange', () => {
  it('範囲内の祝日を返す', () => {
    const holidays = getHolidaysInRange('2026-01-01', '2026-01-31');
    assert.ok(holidays.length > 0);
    assert.strictEqual(holidays[0].date, '2026-01-01');
    assert.strictEqual(holidays[0].name, '元日');
  });

  it('祝日がない範囲では空配列を返す', () => {
    const holidays = getHolidaysInRange('2026-06-01', '2026-06-15');
    assert.deepStrictEqual(holidays, []);
  });

  it('Date オブジェクトを受け付ける', () => {
    const holidays = getHolidaysInRange(
      toJstDate('2026-01-01'),
      toJstDate('2026-01-31'),
    );
    assert.ok(holidays.length > 0);
    assert.strictEqual(holidays[0].date, '2026-01-01');
  });
});

describe('full: addBusinessDays', () => {
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

describe('full: subBusinessDays', () => {
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

describe('full: getNextBusinessDay', () => {
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

describe('full: getPreviousBusinessDay', () => {
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

describe('full: countBusinessDays', () => {
  it('営業日数をカウントする', () => {
    // 2026-01-05（月）〜 2026-01-09（金）= 5 営業日
    assert.strictEqual(countBusinessDays('2026-01-05', '2026-01-09'), 5);
  });

  it('Date オブジェクトを受け付ける', () => {
    const result = countBusinessDays(toJstDate('2026-01-05'), toJstDate('2026-01-09'));
    assert.strictEqual(result, 5);
  });
});
