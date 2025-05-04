import type { Arithmetic, Additive, Multiplicative } from './arithmetic';

/**
 * ユークリッド的除法の結果インターフェイス
 */
export interface EuclideanDivisionResult<T> {
    /**
     * 商
     */
    quotient: T;
    /**
     * 余り
     */
    remainder: T;
}

/**
 * 環インターフェイス
 */
export interface Ring<T> extends Additive<T>, Multiplicative<T>, Arithmetic<T> {
    /**
     * ユークリッド的除算(商と余りを求める)
     * @param b - 除算対象
     */
    euclideanDivide(b: T): EuclideanDivisionResult<T>;
    /**
     * 符号を反転する
     */
    negate(): T;
}

/**
 * 体インターフェイス
 */
export interface Field<T>
    extends Additive<T>,
        Multiplicative<T>,
        Arithmetic<T> {
    /**
     * 符号を反転する
     */
    negate(): T;
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
