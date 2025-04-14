import {
    type Field,
    type RingWithRemainderProvider,
} from './arithmetic-operations';

/**
 * 多項式を表すクラス
 */
export abstract class PolynomialBase<T extends Field<T>>
    implements RingWithRemainderProvider<PolynomialBase<T>>
{
    protected abstract readonly _constructable: {
        new (coefficients: T[], variable: string): PolynomialBase<T>;
    };
    private _coefficients: T[];
    private readonly _variable: string;

    /**
     * 多項式を表すクラス
     * @param coefficients - 多項式の係数の配列
     * @param variable - 多項式の変数
     */
    constructor(coefficients: T[], variable: string) {
        this._variable = variable;
        this._coefficients = coefficients;
    }

    /**
     * 多項式の係数を取得します。
     * @returns 係数の配列
     */
    public get coefficients(): T[] {
        return this._coefficients;
    }
    /**
     * 多項式の変数を取得します。
     * @returns 多項式の変数
     */
    public get variable(): string {
        return this._variable;
    }
    /**
     * 多項式の次数を取得します。
     * @returns 多項式の次数
     */
    public get degree(): number {
        return this._coefficients.length - 1;
    }

    /**
     * 指定されたインデックスの係数を安全に取得します。
     * @param index - 取得したい係数のインデックス
     * @returns 指定されたインデックスの係数。インデックスが範囲外の場合は零を返します。
     */
    public safeCoefficient(index: number): T {
        if (index < this._coefficients.length) {
            return this._coefficients[index];
        } else {
            return this._coefficients[0].zero();
        }
    }
    /**
     * 指定された次数の単位行列を左上に持つ行列を生成します。
     * @param order - 生成する行列の次数
     * @returns 生成された行列
     */
    public elevate(order: number): PolynomialBase<T> {
        const zeros = new Array(order).fill(this._coefficients[0].zero());
        return new this._constructable(
            [...zeros, ...this._coefficients],
            this._variable,
        );
    }
    /**
     * この多項式をスカラー倍します。
     * @param scalar - スカラー
     * @returns スカラー倍された多項式
     */
    public scalarMultiply(scalar: T): PolynomialBase<T> {
        const neCoefficients = this._coefficients.map((c) =>
            c.multiply(scalar),
        );
        return new this._constructable(neCoefficients, this._variable)._trim();
    }
    /**
     * 2つの多項式を足し算します。
     * @param other - 足し算する多項式
     * @returns 足し算された多項式
     */
    public add(other: PolynomialBase<T>): PolynomialBase<T> {
        PolynomialBase._assertSameVariable(this, other);
        const newLength = Math.max(
            this._coefficients.length,
            other._coefficients.length,
        );
        const newCoefficients = new Array(newLength).fill(
            this._coefficients[0].zero(),
        );
        for (let index = 0; index < newLength; index++) {
            newCoefficients[index] = this.safeCoefficient(index).add(
                other.safeCoefficient(index),
            );
        }
        return new this._constructable(newCoefficients, this._variable)._trim();
    }
    /**
     * 2つの多項式を積み算します。
     * @param other - 積み算する多項式
     * @returns 積み算された多項式
     */
    public multiply(other: PolynomialBase<T>): PolynomialBase<T> {
        PolynomialBase._assertSameVariable(this, other);
        const result = this._coefficients
            .map((c, index) => {
                const element = other.scalarMultiply(c).elevate(index);
                return element;
            })
            .reduce((a, b) => a.add(b));
        return result._trim();
    }

    /**
     * 多項式を除算する
     * @param _b - 除算する多項式
     * @returns 除算結果
     * @throws Error - 除算の実装がされていない場合
     */
    public remainder(_b: PolynomialBase<T>): PolynomialBase<T> {
        throw new Error('not implemented');
    }
    /**
     * 多項式を符号反転させる
     * @returns 符号反転された多項式
     */
    public negate(): PolynomialBase<T> {
        const neCoefficients = this._coefficients.map((c) => c.negate());
        return new this._constructable(neCoefficients, this._variable);
    }
    /**
     * ゼロの多項式を生成します
     * @returns ゼロの多項式
     */
    public zero(): PolynomialBase<T> {
        return new this._constructable(
            [this._coefficients[0].zero()],
            this._variable,
        );
    }
    /**
     * 単位多項式を生成します。
     * @returns 係数が1の単位多項式
     */
    public unit(): PolynomialBase<T> {
        return new this._constructable(
            [this._coefficients[0].unit()],
            this._variable,
        );
    }
    /**
     * 等しいかどうかを比較します
     * @param b - 比較する多項式
     * @returns 等しいかどうか
     */
    public equals(b: PolynomialBase<T>): boolean {
        if (this._variable !== b._variable) {
            return false;
        }
        if (this._coefficients.length !== b._coefficients.length) {
            return false;
        }
        for (let index = 0; index < this._coefficients.length; index++) {
            if (!this._coefficients[index].equals(b._coefficients[index])) {
                return false;
            }
        }
        return true;
    }

    private static _assertSameVariable<S extends Field<S>>(
        a: PolynomialBase<S>,
        b: PolynomialBase<S>,
    ) {
        if (a._variable !== b._variable) {
            throw new Error('not same variable');
        }
    }
    private _trim(): this {
        while (this._coefficients.length > 1) {
            if (
                this._coefficients[this._coefficients.length - 1].equals(
                    this._coefficients[0].zero(),
                )
            ) {
                this._coefficients.pop();
            } else {
                break;
            }
        }
        return this;
    }
}
