import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getHolidayName } from './index.ts';

describe('getHolidayName', () => {
  describe('元日', () => {
    it('1月1日は元日', () => {
      assert.strictEqual(getHolidayName('2025-01-01'), '元日');
    });
  });

  describe('成人の日', () => {
    it('2000年以降は第2月曜日', () => {
      assert.strictEqual(getHolidayName('2025-01-13'), '成人の日');
      assert.strictEqual(getHolidayName('2024-01-08'), '成人の日');
    });

    it('1999年以前は1月15日', () => {
      assert.strictEqual(getHolidayName('1999-01-15'), '成人の日');
      assert.strictEqual(getHolidayName('1990-01-15'), '成人の日');
    });
  });

  describe('建国記念の日', () => {
    it('2月11日は建国記念の日（1967年以降）', () => {
      assert.strictEqual(getHolidayName('2025-02-11'), '建国記念の日');
      assert.strictEqual(getHolidayName('1967-02-11'), '建国記念の日');
    });

    it('1966年以前は祝日ではない', () => {
      assert.strictEqual(getHolidayName('1966-02-11'), undefined);
    });
  });

  describe('天皇誕生日', () => {
    it('2020年以降は2月23日', () => {
      assert.strictEqual(getHolidayName('2025-02-23'), '天皇誕生日');
      assert.strictEqual(getHolidayName('2020-02-23'), '天皇誕生日');
    });

    it('1989-2018年は12月23日', () => {
      assert.strictEqual(getHolidayName('2018-12-23'), '天皇誕生日');
      assert.strictEqual(getHolidayName('1989-12-23'), '天皇誕生日');
    });

    it('1949-1988年は4月29日', () => {
      assert.strictEqual(getHolidayName('1988-04-29'), '天皇誕生日');
      assert.strictEqual(getHolidayName('1949-04-29'), '天皇誕生日');
    });

    it('2019年は天皇誕生日なし', () => {
      assert.strictEqual(getHolidayName('2019-02-23'), undefined);
      assert.strictEqual(getHolidayName('2019-12-23'), undefined);
    });
  });

  describe('春分の日', () => {
    it('2025年は3月20日', () => {
      assert.strictEqual(getHolidayName('2025-03-20'), '春分の日');
    });

    it('2024年は3月20日', () => {
      assert.strictEqual(getHolidayName('2024-03-20'), '春分の日');
    });
  });

  describe('みどりの日', () => {
    it('2007年以降は5月4日', () => {
      assert.strictEqual(getHolidayName('2025-05-04'), 'みどりの日');
      assert.strictEqual(getHolidayName('2007-05-04'), 'みどりの日');
    });

    it('1989-2006年は4月29日', () => {
      assert.strictEqual(getHolidayName('2006-04-29'), 'みどりの日');
      assert.strictEqual(getHolidayName('1989-04-29'), 'みどりの日');
    });
  });

  describe('昭和の日', () => {
    it('2007年以降は4月29日', () => {
      assert.strictEqual(getHolidayName('2025-04-29'), '昭和の日');
      assert.strictEqual(getHolidayName('2007-04-29'), '昭和の日');
    });
  });

  describe('憲法記念日', () => {
    it('5月3日は憲法記念日', () => {
      assert.strictEqual(getHolidayName('2025-05-03'), '憲法記念日');
    });
  });

  describe('こどもの日', () => {
    it('5月5日はこどもの日', () => {
      assert.strictEqual(getHolidayName('2025-05-05'), 'こどもの日');
    });
  });

  describe('海の日', () => {
    it('2003年以降は第3月曜日', () => {
      assert.strictEqual(getHolidayName('2025-07-21'), '海の日');
      assert.strictEqual(getHolidayName('2024-07-15'), '海の日');
    });

    it('1996-2002年は7月20日', () => {
      assert.strictEqual(getHolidayName('2002-07-20'), '海の日');
      assert.strictEqual(getHolidayName('1996-07-20'), '海の日');
    });

    it('2020年は7月23日（オリンピック特例）', () => {
      assert.strictEqual(getHolidayName('2020-07-23'), '海の日');
    });

    it('2021年は7月22日（オリンピック特例）', () => {
      assert.strictEqual(getHolidayName('2021-07-22'), '海の日');
    });
  });

  describe('山の日', () => {
    it('2016年以降は8月11日', () => {
      assert.strictEqual(getHolidayName('2025-08-11'), '山の日');
      assert.strictEqual(getHolidayName('2016-08-11'), '山の日');
    });

    it('2020年は8月10日（オリンピック特例）', () => {
      assert.strictEqual(getHolidayName('2020-08-10'), '山の日');
    });

    it('2021年は8月8日（オリンピック特例）', () => {
      assert.strictEqual(getHolidayName('2021-08-08'), '山の日');
    });
  });

  describe('敬老の日', () => {
    it('2003年以降は第3月曜日', () => {
      assert.strictEqual(getHolidayName('2025-09-15'), '敬老の日');
      assert.strictEqual(getHolidayName('2024-09-16'), '敬老の日');
    });

    it('1966-2002年は9月15日', () => {
      assert.strictEqual(getHolidayName('2002-09-15'), '敬老の日');
      assert.strictEqual(getHolidayName('1966-09-15'), '敬老の日');
    });
  });

  describe('秋分の日', () => {
    it('2025年は9月23日', () => {
      assert.strictEqual(getHolidayName('2025-09-23'), '秋分の日');
    });

    it('2024年は9月22日', () => {
      assert.strictEqual(getHolidayName('2024-09-22'), '秋分の日');
    });
  });

  describe('体育の日/スポーツの日', () => {
    it('2020年以降はスポーツの日', () => {
      assert.strictEqual(getHolidayName('2025-10-13'), 'スポーツの日');
      assert.strictEqual(getHolidayName('2024-10-14'), 'スポーツの日');
    });

    it('2019年は体育の日（スポーツの日）（名称変更直前）', () => {
      assert.strictEqual(getHolidayName('2019-10-14'), '体育の日（スポーツの日）');
    });

    it('2000-2018年は体育の日（第2月曜）', () => {
      assert.strictEqual(getHolidayName('2018-10-08'), '体育の日');
      assert.strictEqual(getHolidayName('2000-10-09'), '体育の日');
    });

    it('1966-1999年は体育の日（10月10日）', () => {
      assert.strictEqual(getHolidayName('1999-10-10'), '体育の日');
      assert.strictEqual(getHolidayName('1966-10-10'), '体育の日');
    });

    it('2020年は7月24日（オリンピック特例）', () => {
      assert.strictEqual(getHolidayName('2020-07-24'), 'スポーツの日');
    });

    it('2021年は7月23日（オリンピック特例）', () => {
      assert.strictEqual(getHolidayName('2021-07-23'), 'スポーツの日');
    });
  });

  describe('文化の日', () => {
    it('11月3日は文化の日', () => {
      assert.strictEqual(getHolidayName('2025-11-03'), '文化の日');
    });
  });

  describe('勤労感謝の日', () => {
    it('11月23日は勤労感謝の日', () => {
      assert.strictEqual(getHolidayName('2025-11-23'), '勤労感謝の日');
    });
  });

  describe('振替休日', () => {
    it('祝日が日曜の場合、翌月曜が休日', () => {
      // 2025-02-23 (日) → 2025-02-24 (月) が振替休日
      assert.strictEqual(getHolidayName('2025-02-24'), '休日');
    });

    it('複数の祝日が連続して日曜から始まる場合', () => {
      // 2019-05-03 (金), 05-04 (土), 05-05 (日), 05-06 (月) が振替休日
      assert.strictEqual(getHolidayName('2019-05-06'), '休日');
    });
  });

  describe('国民の休日', () => {
    it('祝日に挟まれた日は国民の休日', () => {
      // 2009-09-21 敬老の日, 09-22 国民の休日, 09-23 秋分の日
      assert.strictEqual(getHolidayName('2009-09-22'), '休日');
    });

    it('2019年のゴールデンウィーク', () => {
      // 2019-04-30, 05-02 は国民の休日
      assert.strictEqual(getHolidayName('2019-04-30'), '休日');
      assert.strictEqual(getHolidayName('2019-05-02'), '休日');
    });
  });

  describe('特別な祝日', () => {
    it('結婚の儀（1959-04-10）', () => {
      assert.strictEqual(getHolidayName('1959-04-10'), '結婚の儀');
    });

    it('大喪の礼（1989-02-24）', () => {
      assert.strictEqual(getHolidayName('1989-02-24'), '大喪の礼');
    });

    it('即位礼正殿の儀（1990-11-12）', () => {
      assert.strictEqual(getHolidayName('1990-11-12'), '即位礼正殿の儀');
    });

    it('結婚の儀（1993-06-09）', () => {
      assert.strictEqual(getHolidayName('1993-06-09'), '結婚の儀');
    });

    it('休日（祝日扱い）（2019-05-01）', () => {
      assert.strictEqual(getHolidayName('2019-05-01'), '休日（祝日扱い）');
    });

    it('休日（祝日扱い）（2019-10-22）', () => {
      assert.strictEqual(getHolidayName('2019-10-22'), '休日（祝日扱い）');
    });
  });

  describe('祝日ではない日', () => {
    it('通常の平日は undefined を返す', () => {
      assert.strictEqual(getHolidayName('2025-01-02'), undefined);
      assert.strictEqual(getHolidayName('2025-06-15'), undefined);
    });

    it('祝日法施行前（1948年以前）は undefined を返す', () => {
      assert.strictEqual(getHolidayName('1947-01-01'), undefined);
      assert.strictEqual(getHolidayName('1940-11-03'), undefined);
    });
  });

  describe('Date オブジェクト入力', () => {
    it('Date オブジェクトを受け付ける', () => {
      // JST 2025-01-01 00:00:00 = UTC 2024-12-31 15:00:00
      const date = new Date('2024-12-31T15:00:00.000Z');
      assert.strictEqual(getHolidayName(date), '元日');
    });

    it('祝日でない Date オブジェクトでは undefined を返す', () => {
      // JST 2025-01-02 00:00:00 = UTC 2025-01-01 15:00:00
      const date = new Date('2025-01-01T15:00:00.000Z');
      assert.strictEqual(getHolidayName(date), undefined);
    });
  });

  describe('タイムゾーン境界', () => {
    it('UTC で前日でも JST で祝日なら祝日名を返す', () => {
      // UTC 2024-12-31 20:00:00 = JST 2025-01-01 05:00:00（元日）
      const date = new Date('2024-12-31T20:00:00.000Z');
      assert.strictEqual(getHolidayName(date), '元日');
    });

    it('UTC で祝日でも JST で翌日なら undefined を返す', () => {
      // UTC 2025-01-01 20:00:00 = JST 2025-01-02 05:00:00（祝日ではない）
      const date = new Date('2025-01-01T20:00:00.000Z');
      assert.strictEqual(getHolidayName(date), undefined);
    });
  });
});
