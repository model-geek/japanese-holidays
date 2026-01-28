import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createIsHoliday, formatDate } from './core.ts';

describe('formatDate', () => {
  it('文字列をそのまま返す', () => {
    assert.strictEqual(formatDate('2025-01-01'), '2025-01-01');
  });

  it('Date オブジェクトを YYYY-MM-DD 形式に変換する', () => {
    const date = new Date(2025, 0, 1); // 2025-01-01
    assert.strictEqual(formatDate(date), '2025-01-01');
  });

  it('月・日を 2 桁にゼロパディングする', () => {
    const date = new Date(2025, 0, 5); // 2025-01-05
    assert.strictEqual(formatDate(date), '2025-01-05');
  });
});

describe('createIsHoliday', () => {
  it('lookup.has() を使って判定する', () => {
    const mockLookup = {
      has: (key: string) => key === '2025-01-01',
    };
    const isHoliday = createIsHoliday(mockLookup);
    assert.strictEqual(isHoliday('2025-01-01'), true);
    assert.strictEqual(isHoliday('2025-01-02'), false);
  });
});
