export interface DivisionResult<T> {
    quotient: T;
    remainder: T;
}

/**
 * 環インターフェイス
 */
export interface Ring<T> {
    /**
     * 加算する
     * @param b - 加算対象
     */
    add(b: T): T;
    /**
     * 乗算する
     * @param b - 乗算対象
     */
    multiply(b: T): T;
    /**
     * ユークリッド的除算(商と余りを求める)
     * @param b - 除算対象
     */
    euclideanDivision(b: T): DivisionResult<T>;
    /**
     * 符号を反転する
     */
    negate(): T;
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
     * 整数値に変換する
     * @returns 整数値
     */
    toNumericNumber(): number;
    isZero(): boolean;
}

/**
 * 体インターフェイス
 */
export interface Field<T> extends Ring<T> {
    /**
     * 除算する
     * @param b - 除算対象
     */
    divide(b: T): T;
    /**
     * 逆数を計算する
     */
    inverse(): T;
}
