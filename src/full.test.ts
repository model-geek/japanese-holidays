import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isHoliday } from './full.ts';

describe('full: isHoliday', () => {
  it('祝日の場合 true を返す', () => {
    assert.strictEqual(isHoliday('2026-01-01'), true);
  });

  it('祝日でない場合 false を返す', () => {
    assert.strictEqual(isHoliday('2026-01-02'), false);
  });

  it('Date オブジェクトを受け付ける', () => {
    const date = new Date(2026, 0, 1); // 2026-01-01
    assert.strictEqual(isHoliday(date), true);
  });
});
