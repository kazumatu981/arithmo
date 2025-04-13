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
     * 符号を反転する
     */
    negate(): T;
    /**
     * 0を返却する
     */
    zero(): T;
    /**
     * 1を返却する
     */
    unit(): T;
    /**
     * 比較する
     * @param b - 比較対象
     */
    equals(b: T): boolean;
}

/**
 * 体インターフェイス
 */
export interface Field<T> extends Ring<T> {
    /**
     * 逆数を計算する
     */
    reciprocate(): T;
}

/**
 * 剰余計算可能な環インターフェイス
 */
export interface RingWithRemainderProvider<T> extends Ring<T> {
    /**
     * 割り算した結果のあまりを返却する
     * @param b - 除算対象
     */
    remainder(b: T): T;
}
