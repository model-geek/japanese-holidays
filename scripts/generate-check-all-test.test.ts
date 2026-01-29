import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseCsv, fetchCsv } from './generate-check-all-test.ts';

describe('parseCsv', () => {
  it('基本的な CSV をパースできる', () => {
    const csv = '国民の祝日・休日月日,国民の祝日・休日名称\n2025/1/1,元日';
    const result = parseCsv(csv);
    assert.deepStrictEqual(result, [{ date: '2025-01-01', name: '元日' }]);
  });

  it('複数行の CSV をパースできる', () => {
    const csv = `国民の祝日・休日月日,国民の祝日・休日名称
2025/1/1,元日
2025/1/13,成人の日`;
    const result = parseCsv(csv);
    assert.deepStrictEqual(result, [
      { date: '2025-01-01', name: '元日' },
      { date: '2025-01-13', name: '成人の日' },
    ]);
  });

  it('空行をスキップする', () => {
    const csv = `国民の祝日・休日月日,国民の祝日・休日名称
2025/1/1,元日

2025/1/13,成人の日`;
    const result = parseCsv(csv);
    assert.strictEqual(result.length, 2);
  });

  it('末尾の改行を処理できる', () => {
    const csv = '国民の祝日・休日月日,国民の祝日・休日名称\n2025/1/1,元日\n';
    const result = parseCsv(csv);
    assert.strictEqual(result.length, 1);
  });

  it('月・日が 1 桁の日付をゼロパディングする', () => {
    const csv = '国民の祝日・休日月日,国民の祝日・休日名称\n2025/1/1,元日';
    const result = parseCsv(csv);
    assert.strictEqual(result[0].date, '2025-01-01');
  });

  it('月・日が 2 桁の日付をそのまま変換する', () => {
    const csv = '国民の祝日・休日月日,国民の祝日・休日名称\n2025/12/23,天皇誕生日';
    const result = parseCsv(csv);
    assert.strictEqual(result[0].date, '2025-12-23');
  });

  it('月が 1 桁、日が 2 桁の日付を正しく変換する', () => {
    const csv = '国民の祝日・休日月日,国民の祝日・休日名称\n2025/1/13,成人の日';
    const result = parseCsv(csv);
    assert.strictEqual(result[0].date, '2025-01-13');
  });

  it('月が 2 桁、日が 1 桁の日付を正しく変換する', () => {
    const csv = '国民の祝日・休日月日,国民の祝日・休日名称\n2025/10/1,都民の日';
    const result = parseCsv(csv);
    assert.strictEqual(result[0].date, '2025-10-01');
  });
});

describe('fetchCsv', () => {
  it('Shift_JIS の CSV を UTF-8 に変換して返す', async () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const fixtureBuffer = await readFile(
      join(__dirname, 'fixtures', 'syukujitsu.csv')
    );

    const mockFetch = mock.fn(() =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(fixtureBuffer.buffer),
      } as Response)
    );
    mock.method(globalThis, 'fetch', mockFetch);

    const result = await fetchCsv('https://example.com/test.csv');

    assert.ok(result.includes('元日'));
    assert.ok(result.includes('国民の祝日'));

    mock.reset();
  });

  it('HTTP エラーの場合は例外をスローする', async () => {
    const mockFetch = mock.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)
    );
    mock.method(globalThis, 'fetch', mockFetch);

    await assert.rejects(
      () => fetchCsv('https://example.com/not-found.csv'),
      /Failed to fetch CSV: 404 Not Found/
    );

    mock.reset();
  });
});
