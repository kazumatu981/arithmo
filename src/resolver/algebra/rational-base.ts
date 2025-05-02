import { Testable } from '../../common/testable';
import type { Ring, Field, DivisionResult } from './arithmetic-operations';

/**
 * 有理数(抽象貸したモデル)
 */
export abstract class RationalBase<
        TThis extends RationalBase<TThis, TBase>,
        TBase extends Ring<TBase>,
    >
    extends Testable<TThis>
    implements Field<TThis>
{
    protected abstract _numerator: TBase;
    protected abstract _denominator: TBase;
    protected abstract readonly _constructable: {
        new (numerator: TBase, denominator: TBase): TThis;
    };
    /**
     * 分子
     * @returns 分子
     */
    public get numerator(): TBase {
        return this._numerator;
    }

    /**
     * 分子を設定する
     * @param value - 設定する分子
     */
    public set numerator(value: TBase) {
        this._numerator = value;
        this.test();
    }
    /**
     * 分母
     * @returns 分母
     */
    public get denominator(): TBase {
        return this._denominator;
    }
    /**
     * 分母を設定する
     */
    public set denominator(value: TBase) {
        this._denominator = value;
        this.test();
    }
    /**
     * 足し算
     * @param other 足す数
     * @returns 計算結果
     */
    public add(other: TThis): TThis {
        const firstElement = this.numerator.multiply(other.denominator);
        const secondElement = this.denominator.multiply(other.numerator);

        const newNumerator = firstElement.add(secondElement);
        const newDenominator = this.denominator.multiply(other.denominator);
        return new this._constructable(newNumerator, newDenominator);
    }
    /**
     * 掛け算
     * @param other 掛ける数
     * @returns 計算結果
     */
    public multiply(other: TThis): TThis {
        const newNumerator = this.numerator.multiply(other.numerator);
        const newDenominator = this.denominator.multiply(other.denominator);
        return new this._constructable(newNumerator, newDenominator);
    }

    public divide(b: TThis): TThis {
        return this.multiply(b.inverse());
    }

    public euclideanDivision(_b: TThis): DivisionResult<TThis> {
        throw new Error('Method not implemented.');
    }

    /**
     * 符号を反転する
     * @returns 計算結果
     */
    public negate(): TThis {
        return new this._constructable(
            this.numerator.negate(),
            this.denominator,
        );
    }

    /**
     * 逆数を求める
     * @returns 計算結果
     */
    public inverse(): TThis {
        return new this._constructable(this.denominator, this.numerator);
    }

    /**
     * 整数に変換する
     * @returns 変換結果
     */
    public toNumericNumber(): number {
        if (this.denominator.equals(this.denominator.unit())) {
            return this.numerator.toNumericNumber();
        }
        throw new Error('整数に変換できません。');
    }
    /**
     * 零元
     * @returns 計算結果
     */
    public zero(): TThis {
        return new this._constructable(
            this.numerator.zero(),
            this.denominator.unit(),
        );
    }
    /**
     * 単位元
     * @returns 計算結果
     */
    public unit(): TThis {
        return new this._constructable(
            this.numerator.unit(),
            this.denominator.unit(),
        );
    }

    public clone(): TThis {
        return new this._constructable(
            this.numerator.clone(),
            this.denominator.clone(),
        );
    }
    isZero(): boolean {
        return this.equals(this.zero());
    }
    /**
     * 比較する
     * @param other 比較対象
     * @returns 比較結果
     */
    public equals(other: TThis): boolean {
        return this.numerator
            .multiply(other.denominator)
            .equals(this.denominator.multiply(other.numerator));
    }
}
