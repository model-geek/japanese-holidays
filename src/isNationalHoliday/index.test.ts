import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isNationalHoliday } from './index.ts';

describe('isNationalHoliday', () => {
  describe('元日', () => {
    it('1月1日は祝日', () => {
      assert.strictEqual(isNationalHoliday('2025-01-01'), true);
    });
  });

  describe('成人の日', () => {
    it('2000年以降は第2月曜日', () => {
      assert.strictEqual(isNationalHoliday('2025-01-13'), true); // 第2月曜
      assert.strictEqual(isNationalHoliday('2024-01-08'), true); // 第2月曜
    });

    it('1999年以前は1月15日', () => {
      assert.strictEqual(isNationalHoliday('1999-01-15'), true);
      assert.strictEqual(isNationalHoliday('1990-01-15'), true);
    });
  });

  describe('建国記念の日', () => {
    it('2月11日は祝日（1967年以降）', () => {
      assert.strictEqual(isNationalHoliday('2025-02-11'), true);
      assert.strictEqual(isNationalHoliday('1967-02-11'), true);
    });

    it('1966年以前は祝日ではない', () => {
      assert.strictEqual(isNationalHoliday('1966-02-11'), false);
    });
  });

  describe('天皇誕生日', () => {
    it('2020年以降は2月23日', () => {
      assert.strictEqual(isNationalHoliday('2025-02-23'), true);
      assert.strictEqual(isNationalHoliday('2020-02-23'), true);
    });

    it('1989-2018年は12月23日', () => {
      assert.strictEqual(isNationalHoliday('2018-12-23'), true);
      assert.strictEqual(isNationalHoliday('1989-12-23'), true);
    });

    it('2019年は天皇誕生日なし', () => {
      assert.strictEqual(isNationalHoliday('2019-02-23'), false);
      assert.strictEqual(isNationalHoliday('2019-12-23'), false);
    });
  });

  describe('春分の日', () => {
    it('2025年は3月20日', () => {
      assert.strictEqual(isNationalHoliday('2025-03-20'), true);
    });

    it('2024年は3月20日', () => {
      assert.strictEqual(isNationalHoliday('2024-03-20'), true);
    });
  });

  describe('昭和の日・みどりの日・天皇誕生日（4月29日）', () => {
    it('4月29日は祝日（1949年以降）', () => {
      assert.strictEqual(isNationalHoliday('2025-04-29'), true);
      assert.strictEqual(isNationalHoliday('1989-04-29'), true);
      assert.strictEqual(isNationalHoliday('1950-04-29'), true);
    });
  });

  describe('憲法記念日', () => {
    it('5月3日は祝日', () => {
      assert.strictEqual(isNationalHoliday('2025-05-03'), true);
    });
  });

  describe('みどりの日（5月4日）', () => {
    it('2007年以降は祝日', () => {
      assert.strictEqual(isNationalHoliday('2025-05-04'), true);
      assert.strictEqual(isNationalHoliday('2007-05-04'), true);
    });
  });

  describe('こどもの日', () => {
    it('5月5日は祝日', () => {
      assert.strictEqual(isNationalHoliday('2025-05-05'), true);
    });
  });

  describe('海の日', () => {
    it('2003年以降は第3月曜日', () => {
      assert.strictEqual(isNationalHoliday('2025-07-21'), true);
      assert.strictEqual(isNationalHoliday('2024-07-15'), true);
    });

    it('1996-2002年は7月20日', () => {
      assert.strictEqual(isNationalHoliday('2002-07-20'), true);
      assert.strictEqual(isNationalHoliday('1996-07-20'), true);
    });

    it('2020年は7月23日（オリンピック特例）', () => {
      assert.strictEqual(isNationalHoliday('2020-07-23'), true);
    });

    it('2021年は7月22日（オリンピック特例）', () => {
      assert.strictEqual(isNationalHoliday('2021-07-22'), true);
    });
  });

  describe('山の日', () => {
    it('2016年以降は8月11日', () => {
      assert.strictEqual(isNationalHoliday('2025-08-11'), true);
      assert.strictEqual(isNationalHoliday('2016-08-11'), true);
    });

    it('2020年は8月10日（オリンピック特例）', () => {
      assert.strictEqual(isNationalHoliday('2020-08-10'), true);
    });

    it('2021年は8月8日（オリンピック特例）', () => {
      assert.strictEqual(isNationalHoliday('2021-08-08'), true);
    });
  });

  describe('敬老の日', () => {
    it('2003年以降は第3月曜日', () => {
      assert.strictEqual(isNationalHoliday('2025-09-15'), true);
      assert.strictEqual(isNationalHoliday('2024-09-16'), true);
    });

    it('1966-2002年は9月15日', () => {
      assert.strictEqual(isNationalHoliday('2002-09-15'), true);
      assert.strictEqual(isNationalHoliday('1966-09-15'), true);
    });
  });

  describe('秋分の日', () => {
    it('2025年は9月23日', () => {
      assert.strictEqual(isNationalHoliday('2025-09-23'), true);
    });

    it('2024年は9月22日', () => {
      assert.strictEqual(isNationalHoliday('2024-09-22'), true);
    });
  });

  describe('スポーツの日/体育の日', () => {
    it('2000年以降は第2月曜日', () => {
      assert.strictEqual(isNationalHoliday('2025-10-13'), true);
      assert.strictEqual(isNationalHoliday('2024-10-14'), true);
    });

    it('1966-1999年は10月10日', () => {
      assert.strictEqual(isNationalHoliday('1999-10-10'), true);
      assert.strictEqual(isNationalHoliday('1966-10-10'), true);
    });

    it('2020年は7月24日（オリンピック特例）', () => {
      assert.strictEqual(isNationalHoliday('2020-07-24'), true);
    });

    it('2021年は7月23日（オリンピック特例）', () => {
      assert.strictEqual(isNationalHoliday('2021-07-23'), true);
    });
  });

  describe('文化の日', () => {
    it('11月3日は祝日', () => {
      assert.strictEqual(isNationalHoliday('2025-11-03'), true);
    });
  });

  describe('勤労感謝の日', () => {
    it('11月23日は祝日', () => {
      assert.strictEqual(isNationalHoliday('2025-11-23'), true);
    });
  });

  describe('振替休日', () => {
    it('祝日が日曜の場合、翌月曜が振替休日', () => {
      // 2025-02-23 (日) → 2025-02-24 (月) が振替休日
      assert.strictEqual(isNationalHoliday('2025-02-24'), true);
    });

    it('複数の祝日が連続して日曜から始まる場合', () => {
      // 2019-05-03 (金), 05-04 (土), 05-05 (日), 05-06 (月) が振替休日
      assert.strictEqual(isNationalHoliday('2019-05-06'), true);
    });

    it('1973年以前は振替休日なし', () => {
      // 1972-01-01 は土曜日、1972-01-02 は日曜日ではないが確認
      // 1973年以前のケースを探す必要がある
    });
  });

  describe('国民の休日', () => {
    it('祝日に挟まれた日は国民の休日', () => {
      // 2009-09-21 敬老の日, 09-22 国民の休日, 09-23 秋分の日
      assert.strictEqual(isNationalHoliday('2009-09-22'), true);
    });

    it('2019年のゴールデンウィーク', () => {
      // 2019-04-30, 05-02 は国民の休日
      assert.strictEqual(isNationalHoliday('2019-04-30'), true);
      assert.strictEqual(isNationalHoliday('2019-05-02'), true);
    });
  });

  describe('特別な祝日', () => {
    it('皇太子明仁親王の結婚の儀（1959-04-10）', () => {
      assert.strictEqual(isNationalHoliday('1959-04-10'), true);
    });

    it('昭和天皇の大喪の礼（1989-02-24）', () => {
      assert.strictEqual(isNationalHoliday('1989-02-24'), true);
    });

    it('即位礼正殿の儀（1990-11-12）', () => {
      assert.strictEqual(isNationalHoliday('1990-11-12'), true);
    });

    it('皇太子徳仁親王の結婚の儀（1993-06-09）', () => {
      assert.strictEqual(isNationalHoliday('1993-06-09'), true);
    });

    it('天皇の即位の日（2019-05-01）', () => {
      assert.strictEqual(isNationalHoliday('2019-05-01'), true);
    });

    it('即位礼正殿の儀（2019-10-22）', () => {
      assert.strictEqual(isNationalHoliday('2019-10-22'), true);
    });
  });

  describe('祝日ではない日', () => {
    it('通常の平日は祝日ではない', () => {
      assert.strictEqual(isNationalHoliday('2025-01-02'), false);
      assert.strictEqual(isNationalHoliday('2025-06-15'), false);
    });

    it('祝日法施行前（1948年以前）は祝日なし', () => {
      assert.strictEqual(isNationalHoliday('1947-01-01'), false);
      assert.strictEqual(isNationalHoliday('1940-11-03'), false);
    });
  });

  describe('Date オブジェクト入力', () => {
    it('Date オブジェクトを受け付ける', () => {
      // JST 2025-01-01 00:00:00 = UTC 2024-12-31 15:00:00
      const date = new Date('2024-12-31T15:00:00.000Z');
      assert.strictEqual(isNationalHoliday(date), true);
    });
  });
});
