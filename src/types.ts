/**
 * 日付の入力型
 *
 * Date オブジェクトまたは YYYY-MM-DD 形式の文字列を受け付ける
 */
export type DateInput = Date | string;

/**
 * 祝日データ
 */
export interface Holiday {
  /**
   * 日付（YYYY-MM-DD 形式）
   */
  date: string;

  /**
   * 祝日名
   */
  name: string;
}

/**
 * 日付の存在確認が可能なオブジェクト
 *
 * Set または Map のように `has` メソッドを持つオブジェクト
 */
export interface DateLookup {
  has(key: string): boolean;
}

/**
 * 祝日名が取得可能なオブジェクト
 *
 * Map のように `get` と `entries` メソッドを持つオブジェクト
 */
export interface HolidayNameLookup extends DateLookup {
  get(key: string): string | undefined;
  entries(): Iterable<[string, string]>;
}
