import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createIsHoliday } from './createIsHoliday.ts';

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
