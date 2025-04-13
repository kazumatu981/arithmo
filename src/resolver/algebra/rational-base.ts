import { Testable } from '../../common/testable';
import type { Ring, Field } from './arithmetic-operations';

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
     */
    public get numerator(): TBase {
        return this._numerator;
    }
    public set numerator(value: TBase) {
        this._numerator = value;
        this.test();
    }
    /**
     * 分母
     */
    public get denominator(): TBase {
        return this._denominator;
    }
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

    public multiply(other: TThis): TThis {
        const newNumerator = this.numerator.multiply(other.numerator);
        const newDenominator = this.denominator.multiply(other.denominator);
        return new this._constructable(newNumerator, newDenominator);
    }

    public negate(): TThis {
        return new this._constructable(
            this.numerator.negate(),
            this.denominator,
        );
    }

    public reciprocate(): TThis {
        return new this._constructable(this.denominator, this.numerator);
    }
    public zero(): TThis {
        return new this._constructable(
            this.numerator.zero(),
            this.denominator.unit(),
        );
    }
    public unit(): TThis {
        return new this._constructable(
            this.numerator.unit(),
            this.denominator.unit(),
        );
    }
    public equals(other: TThis): boolean {
        return this.numerator
            .multiply(other.denominator)
            .equals(this.denominator.multiply(other.numerator));
    }
}
