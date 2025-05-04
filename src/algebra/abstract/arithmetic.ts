/**
 * 算術インターフェイス
 */
export interface Arithmetic<T> {
    /**
     * 複製する
     * @returns 複製したインスタンス
     */
    clone(): T;
    /**
     * 比較する
     * @param b - 比較対象
     */
    equals(b: T): boolean;
    /**
     * 文字列化する
     */
    toString(): string;
    /**
     * 数値化する
     * @returns 数値化した値
     */
    toNumber(): number;
}

/**
 * 加法インターフェイス
 */
export interface Additive<T> {
    /**
     * 加算する
     * @param b - 加算対象
     */
    add(b: T): T;
    /**
     * 0を返却する
     */
    get zero(): T;
    /**
     * 0判定
     */
    get isZero(): boolean;
}

/**
 * 乗法インターフェイス
 */
export interface Multiplicative<T> {
    /**
     * 乗算する
     * @param b - 乗算対象
     */
    multiply(b: T): T;
    /**
     * 1を返却する
     */
    get unit(): T;
    /**
     * 1判定
     */
    get isUnit(): boolean;
}
