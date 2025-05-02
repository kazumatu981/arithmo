import {
    type Field,
    type Ring,
    type DivisionResult,
} from './arithmetic-operations';

/**
 * 多項式を表すクラス
 */
export abstract class PolynomialBase<
    TThis extends PolynomialBase<TThis, TCoefficient>,
    TCoefficient extends Field<TCoefficient>,
> implements Ring<TThis>
{
    protected abstract readonly _constructable: {
        new (coefficients: TCoefficient[], variable: string | undefined): TThis;
    };
    private _coefficients: TCoefficient[];
    private readonly _variable: string | undefined;

    /**
     * 多項式を表すクラス
     * @param coefficients - 多項式の係数の配列
     * @param variable - 多項式の変数
     */
    constructor(
        coefficients: TCoefficient[],
        variable: string | undefined = undefined,
    ) {
        this._variable = variable;
        this._coefficients = coefficients;
    }

    /**
     * 多項式の係数を取得します。
     * @returns 係数の配列
     */
    public get coefficients(): TCoefficient[] {
        return this._coefficients;
    }
    /**
     * 多項式の変数を取得します。
     * @returns 多項式の変数
     */
    public get variable(): string | undefined {
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
    public safeCoefficient(index: number): TCoefficient {
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
    public elevate(order: number): TThis {
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
    public scalarMultiply(scalar: TCoefficient): TThis {
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
    public add(other: TThis): TThis {
        this._assertSameVariable(other);
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
        return new this._constructable(
            newCoefficients,
            this._variable ?? other.variable,
        )._trim();
    }
    /**
     * 2つの多項式を積み算します。
     * @param other - 積み算する多項式
     * @returns 積み算された多項式
     */
    public multiply(other: TThis): TThis {
        this._assertSameVariable(other);
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
    public euclideanDivision(other: TThis): DivisionResult<TThis> {
        let quotient = this.zero();
        let remainder = this.clone();
        while (remainder.degree >= other.degree && !remainder.isZero()) {
            const quotientCoefficient = remainder.coefficients[
                remainder.degree
            ].divide(other.coefficients[other.degree]);

            quotient = quotient
                .elevate(1)
                .add(
                    new this._constructable(
                        [quotientCoefficient],
                        this._variable,
                    ),
                );
            remainder = remainder
                .add(other.scalarMultiply(quotientCoefficient).negate())
                ._trim();
        }

        return { quotient, remainder };
    }
    /**
     * 多項式を符号反転させる
     * @returns 符号反転された多項式
     */
    public negate(): TThis {
        const neCoefficients = this._coefficients.map((c) => c.negate());
        return new this._constructable(neCoefficients, this._variable);
    }
    /**
     * ゼロの多項式を生成します
     * @returns ゼロの多項式
     */
    public zero(): TThis {
        return new this._constructable(
            [this._coefficients[0].zero()],
            this._variable,
        );
    }
    /**
     * 単位多項式を生成します。
     * @returns 係数が1の単位多項式
     */
    public unit(): TThis {
        return new this._constructable(
            [this._coefficients[0].unit()],
            this._variable,
        );
    }

    /**
     * 整数に変換します。
     * @returns 変換結果
     */
    public toNumericNumber(): number {
        if (this._coefficients.length === 1) {
            return this._coefficients[0].toNumericNumber();
        }
        throw new Error('整数に変換できません');
    }
    /**
     * 複製します。
     * @returns 複製したインスタンス
     */
    public clone(): TThis {
        return new this._constructable(
            this._coefficients.map((c) => c.clone()),
            this._variable,
        );
    }
    /**
     * 等しいかどうかを比較します
     * @param b - 比較する多項式
     * @returns 等しいかどうか
     */
    public equals(b: TThis): boolean {
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
    public isZero(): boolean {
        return this._coefficients.every((c) => c.isZero());
    }

    public get isScalar(): boolean {
        return this.degree === 0;
    }
    private _assertSameVariable(other: TThis): void {
        if (this.isScalar || other.isScalar) return;
        if (this._variable !== other._variable) {
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
