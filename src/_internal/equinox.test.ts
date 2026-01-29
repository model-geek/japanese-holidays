import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateVernalEquinox, calculateAutumnalEquinox } from './equinox.ts';

describe('calculateVernalEquinox', () => {
  describe('計算式の適用範囲内（1900-2099年）', () => {
    it('2024年の春分日は3月20日', () => {
      assert.strictEqual(calculateVernalEquinox(2024), 20);
    });

    it('2025年の春分日は3月20日', () => {
      assert.strictEqual(calculateVernalEquinox(2025), 20);
    });

    it('2026年の春分日は3月20日', () => {
      assert.strictEqual(calculateVernalEquinox(2026), 20);
    });

    it('1980年の春分日は3月20日', () => {
      assert.strictEqual(calculateVernalEquinox(1980), 20);
    });

    it('1979年の春分日は3月21日', () => {
      assert.strictEqual(calculateVernalEquinox(1979), 21);
    });

    it('1960年の春分日は3月20日', () => {
      assert.strictEqual(calculateVernalEquinox(1960), 20);
    });

    it('2000年の春分日は3月20日', () => {
      assert.strictEqual(calculateVernalEquinox(2000), 20);
    });
  });

  describe('計算式の適用範囲外', () => {
    it('1899年は既定値の21を返す', () => {
      assert.strictEqual(calculateVernalEquinox(1899), 21);
    });

    it('2100年は既定値の21を返す', () => {
      assert.strictEqual(calculateVernalEquinox(2100), 21);
    });
  });

  describe('過去の春分日の検証', () => {
    // 国立天文台の公表データに基づく
    it('2020年の春分日は3月20日', () => {
      assert.strictEqual(calculateVernalEquinox(2020), 20);
    });

    it('2019年の春分日は3月21日', () => {
      assert.strictEqual(calculateVernalEquinox(2019), 21);
    });

    it('2018年の春分日は3月21日', () => {
      assert.strictEqual(calculateVernalEquinox(2018), 21);
    });

    it('2017年の春分日は3月20日', () => {
      assert.strictEqual(calculateVernalEquinox(2017), 20);
    });
  });
});

describe('calculateAutumnalEquinox', () => {
  describe('計算式の適用範囲内（1900-2099年）', () => {
    it('2024年の秋分日は9月22日', () => {
      assert.strictEqual(calculateAutumnalEquinox(2024), 22);
    });

    it('2025年の秋分日は9月23日', () => {
      assert.strictEqual(calculateAutumnalEquinox(2025), 23);
    });

    it('2026年の秋分日は9月23日', () => {
      assert.strictEqual(calculateAutumnalEquinox(2026), 23);
    });

    it('1980年の秋分日は9月23日', () => {
      assert.strictEqual(calculateAutumnalEquinox(1980), 23);
    });

    it('1979年の秋分日は9月24日', () => {
      assert.strictEqual(calculateAutumnalEquinox(1979), 24);
    });

    it('1960年の秋分日は9月23日', () => {
      assert.strictEqual(calculateAutumnalEquinox(1960), 23);
    });

    it('2000年の秋分日は9月23日', () => {
      assert.strictEqual(calculateAutumnalEquinox(2000), 23);
    });
  });

  describe('計算式の適用範囲外', () => {
    it('1899年は既定値の23を返す', () => {
      assert.strictEqual(calculateAutumnalEquinox(1899), 23);
    });

    it('2100年は既定値の23を返す', () => {
      assert.strictEqual(calculateAutumnalEquinox(2100), 23);
    });
  });

  describe('過去の秋分日の検証', () => {
    // 国立天文台の公表データに基づく
    it('2020年の秋分日は9月22日', () => {
      assert.strictEqual(calculateAutumnalEquinox(2020), 22);
    });

    it('2019年の秋分日は9月23日', () => {
      assert.strictEqual(calculateAutumnalEquinox(2019), 23);
    });

    it('2018年の秋分日は9月23日', () => {
      assert.strictEqual(calculateAutumnalEquinox(2018), 23);
    });

    it('2017年の秋分日は9月23日', () => {
      assert.strictEqual(calculateAutumnalEquinox(2017), 23);
    });
  });
});
