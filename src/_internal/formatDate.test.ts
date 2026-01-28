import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatDate } from './formatDate.ts';

describe('formatDate', () => {
  it('文字列をそのまま返す', () => {
    assert.strictEqual(formatDate('2025-01-01'), '2025-01-01');
  });

  it('Date オブジェクトを JST での YYYY-MM-DD 形式に変換する', () => {
    // UTC の 2024-12-31 15:00:00 = JST の 2025-01-01 00:00:00
    const date = new Date('2024-12-31T15:00:00.000Z');
    assert.strictEqual(formatDate(date), '2025-01-01');
  });

  it('JST で日付が変わる境界を正しく扱う', () => {
    // UTC の 2025-01-01 14:59:59 = JST の 2025-01-01 23:59:59
    const beforeMidnight = new Date('2025-01-01T14:59:59.000Z');
    assert.strictEqual(formatDate(beforeMidnight), '2025-01-01');

    // UTC の 2025-01-01 15:00:00 = JST の 2025-01-02 00:00:00
    const afterMidnight = new Date('2025-01-01T15:00:00.000Z');
    assert.strictEqual(formatDate(afterMidnight), '2025-01-02');
  });

  it('月・日を 2 桁にゼロパディングする', () => {
    // UTC の 2024-12-31 15:00:00 = JST の 2025-01-01 00:00:00
    const date = new Date('2025-01-04T15:00:00.000Z');
    assert.strictEqual(formatDate(date), '2025-01-05');
  });
});
