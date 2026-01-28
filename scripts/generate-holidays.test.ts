import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  parseCsv,
  generateHolidayDatesJson,
  generateHolidayNamesJson,
} from './generate-holidays.ts';

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

describe('generateHolidayDatesJson', () => {
  it('空配列の場合は空の JSON 配列を返す', () => {
    const result = generateHolidayDatesJson([]);
    assert.strictEqual(result, '[]');
  });

  it('単一要素の配列で正しい JSON を生成する', () => {
    const result = generateHolidayDatesJson([{ date: '2025-01-01', name: '元日' }]);
    assert.strictEqual(result, '["2025-01-01"]');
  });

  it('複数要素の配列で正しい JSON を生成する', () => {
    const result = generateHolidayDatesJson([
      { date: '2025-01-01', name: '元日' },
      { date: '2025-01-13', name: '成人の日' },
    ]);
    assert.strictEqual(result, '["2025-01-01","2025-01-13"]');
  });

  it('生成された文字列が有効な JSON である', () => {
    const result = generateHolidayDatesJson([{ date: '2025-01-01', name: '元日' }]);
    assert.doesNotThrow(() => JSON.parse(result));
  });
});

describe('generateHolidayNamesJson', () => {
  it('空配列の場合は空の JSON オブジェクトを返す', () => {
    const result = generateHolidayNamesJson([]);
    assert.strictEqual(result, '{}');
  });

  it('単一要素の配列で正しい JSON を生成する', () => {
    const result = generateHolidayNamesJson([{ date: '2025-01-01', name: '元日' }]);
    assert.strictEqual(result, '{"2025-01-01":"元日"}');
  });

  it('複数要素の配列で正しい JSON を生成する', () => {
    const result = generateHolidayNamesJson([
      { date: '2025-01-01', name: '元日' },
      { date: '2025-01-13', name: '成人の日' },
    ]);
    assert.strictEqual(result, '{"2025-01-01":"元日","2025-01-13":"成人の日"}');
  });

  it('生成された文字列が有効な JSON である', () => {
    const result = generateHolidayNamesJson([{ date: '2025-01-01', name: '元日' }]);
    assert.doesNotThrow(() => JSON.parse(result));
  });
});
