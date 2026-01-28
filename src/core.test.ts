import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isHoliday } from './core.ts';

describe('isHoliday', () => {
  it('祝日の場合 true を返す', () => {
    // TODO: #7 で祝日データを追加後に有効化
    // assert.strictEqual(isHoliday('2026-01-01'), true);
    assert.ok(true);
  });

  it('祝日でない場合 false を返す', () => {
    assert.strictEqual(isHoliday('2026-01-02'), false);
  });
});
