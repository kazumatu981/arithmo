import { type EuclideanDivisionResult, type Ring } from './abstract';

/**
 * 二つの整数の最大公約数を計算する
 * @param a - 整数
 * @param b - 整数
 * @returns 最大公約数
 */
export function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * x が整数かどうかを判定する
 * @param x - 整数かどうかを判定する値
 * @returns x が整数の場合 true
 */
export function isNumeric(x: number): boolean {
    return Number.isInteger(x);
}

/**
 * 数値を表現するクラス
 */
export class Numeric implements Ring<Numeric> {
    private _value: number = 0;

    /**
     * インスタンスを生成する
     * @param value - 数値
     */
    constructor(value: number) {
        if (!isNumeric(value)) throw new Error('数値を指定してください。');
        this._value = value;
    }

    /**
     * 数値を取得します。
     * @returns {number} 数値
     */
    public get value(): number {
        return this._value;
    }

    /**
     * 数値を設定します。
     * @param {number} value 数値
     */
    public set value(value: number) {
        this._value = value;
    }

    /**
     * 数値を加算する
     * @param value - 加算する数値
     * @returns 加算した数値
     */
    public add(value: Numeric): Numeric {
        return new Numeric(this._value + value.value);
    }

    /**
     * 数値を乗算する
     * @param b - 乗算する数値
     * @returns 乗算した数値
     */
    public multiply(b: Numeric): Numeric {
        return new Numeric(this._value * b.value);
    }

    /**
     * ユークリッド除算を行います。
     * @param b - 除算する数値
     * @returns ユークリッド除算の結果
     */
    public euclideanDivide(b: Numeric): EuclideanDivisionResult<Numeric> {
        const gcdValue = gcd(this._value, b.value);
        return {
            quotient: new Numeric(Math.trunc(this._value / gcdValue)),
            remainder: new Numeric(b.value / gcdValue),
        };
    }

    /**
     * 符号を変換する
     * @returns 符号を変換した数値
     */
    public negate(): Numeric {
        return new Numeric(-this._value);
    }

    /**
     * 整数に変換する
     * @returns 数値
     */
    public toNumber(): number {
        if (isNumeric(this._value)) {
            return this._value;
        }
        throw new Error('整数に変換できません。');
    }
    /**
     * 複製する
     * @returns 複製したインスタンス
     */
    public clone(): Numeric {
        return new Numeric(this._value);
    }
    /**
     * 数値を比較する
     * @param other - 比較する数値
     * @returns 数値の比較結果
     */
    public equals(other: Numeric | number): boolean {
        if (typeof other === 'number') {
            return this._value === other;
        } else {
            return this._value === other.value;
        }
    }

    /**
     * 数値がゼロかどうかを判定します。
     * @returns ゼロの場合はtrue、それ以外はfalse
     */
    public get isZero(): boolean {
        return this.equals(this.zero);
    }

    /**
     * 数値が単位元かどうかを判定します。
     * @returns 単位元の場合はtrue、それ以外はfalse
     */
    public get isUnit(): boolean {
        return this.equals(this.unit);
    }
    /**
     * 0 を返却する
     * @returns 0
     */
    public get zero(): Numeric {
        return ZERO;
    }

    /**
     * 1 を返却する
     * @returns 1
     */
    public get unit(): Numeric {
        return ONE;
    }
}

const ZERO = new Numeric(0);
const ONE = new Numeric(1);
