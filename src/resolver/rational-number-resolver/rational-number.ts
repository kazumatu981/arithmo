import { gcd, isNumeric } from '../common/numeric';
import { Testable, type Rule } from '../../common/testable';
import { Field } from '../common/arithmetic-operations';

export class RationalNumber
    extends Testable<RationalNumber>
    implements Field<RationalNumber>
{
    /**
     * 分子
     */
    private _numerator: number = 0;
    /**
     * 分母
     */
    private _denominator: number = 1;
    private _isNegative: boolean = false;

    constructor(
        numerator: number,
        denominator: number,
        isNegative: boolean = false,
    ) {
        super();
        this._numerator = numerator;
        this._denominator = denominator;
        this._isNegative = isNegative;
        this.test();
    }
    public get numerator(): number {
        return this._numerator;
    }

    public set numerator(value: number) {
        this._numerator = value;
        this.test();
    }
    public get denominator(): number {
        return this._denominator;
    }
    public set denominator(value: number) {
        this._denominator = value;
        this.test();
    }
    public get isNegative(): boolean {
        return this._isNegative;
    }
    public set isNegative(value: boolean) {
        this._isNegative = value;
    }

    public add(other: RationalNumber): RationalNumber {
        const numerator =
            (this.isNegative ? -1 : 1) * this.numerator * other.denominator +
            (other.isNegative ? -1 : 1) * this.denominator * other.numerator;
        const denominator = this.denominator * other.denominator;

        return new RationalNumber(
            numerator < 0 ? -numerator : numerator,
            denominator,
            numerator < 0,
        );
    }

    public subtract(other: RationalNumber): RationalNumber {
        const negated = other.negate();
        return this.add(negated);
    }
    public multiply(other: RationalNumber): RationalNumber {
        const numerator = this.numerator * other.numerator;
        const denominator = this.denominator * other.denominator;
        return new RationalNumber(
            numerator,
            denominator,
            this.isNegative !== other.isNegative,
        );
    }

    public divide(other: RationalNumber): RationalNumber {
        const reciprocated = other.reciprocate();
        return this.multiply(reciprocated);
    }

    public negate(): RationalNumber {
        return new RationalNumber(
            this.numerator,
            this.denominator,
            !this.isNegative,
        );
    }

    public reciprocate(): RationalNumber {
        return new RationalNumber(
            this.denominator,
            this.numerator,
            this.isNegative,
        );
    }

    public zero(): RationalNumber {
        return Zero;
    }

    public unit(): RationalNumber {
        return One;
    }

    public equals(other: RationalNumber): boolean {
        return (
            this.numerator * other.denominator ===
                this.denominator * other.numerator &&
            this.isNegative === other.isNegative
        );
    }
    public toString(): string {
        const signature = this.isNegative ? '-' : '';
        return this.numerator === 0
            ? '0'
            : `${signature}${this.numerator}/${this.denominator}`;
    }
    protected normalize(): void {
        const gcdOfNumeratorAndDenominator = gcd(
            this.numerator,
            this.denominator,
        );
        this._numerator /= gcdOfNumeratorAndDenominator;
        this._denominator /= gcdOfNumeratorAndDenominator;
    }
    protected readonly moduleName = 'resolver';
    protected readonly rules: Rule<RationalNumber>[] = [
        (r): void => {
            const rationalNumber = r as RationalNumber;
            if (rationalNumber.denominator === 0) {
                throw new Error('分母が0です');
            }
        },
        (r): void => {
            const rationalNumber = r as RationalNumber;
            if (rationalNumber.denominator < 0) {
                throw new Error('分母が負の数です');
            }
        },
        (r): void => {
            const rationalNumber = r as RationalNumber;
            if (rationalNumber.numerator < 0) {
                throw new Error('分子が負の数です');
            }
        },
        (r): void => {
            const rationalNumber = r as RationalNumber;
            if (!isNumeric(rationalNumber.numerator)) {
                throw new Error('分子が小数です');
            }
        },
        (r): void => {
            const rationalNumber = r as RationalNumber;
            if (!isNumeric(rationalNumber.denominator)) {
                throw new Error('分母が小数です');
            }
        },
    ];
}

export const Zero: RationalNumber = new RationalNumber(0, 1);
export const One: RationalNumber = new RationalNumber(1, 1);
