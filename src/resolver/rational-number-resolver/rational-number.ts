import { gcd, isNumeric } from '../common/numeric';
import { Testable, type Rule } from '../../common/testable';

export class RationalNumber extends Testable<RationalNumber> {
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
        this.normalize();
    }
    public get numerator(): number {
        return this._numerator;
    }

    public set numerator(value: number) {
        this._numerator = value;
        this.normalize();
        this.test();
    }
    public get denominator(): number {
        return this._denominator;
    }
    public set denominator(value: number) {
        this._denominator = value;
        this.normalize();
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
        const numerator =
            (this.isNegative ? -1 : 1) * this.numerator * other.denominator -
            (other.isNegative ? -1 : 1) * this.denominator * other.numerator;
        const denominator = this.denominator * other.denominator;
        return new RationalNumber(
            numerator < 0 ? -numerator : numerator,
            denominator,
            numerator < 0,
        );
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
        const numerator = this.numerator * other.denominator;
        const denominator = this.denominator * other.numerator;
        return new RationalNumber(
            numerator,
            denominator,
            this.isNegative !== other.isNegative,
        );
    }

    public equals(other: RationalNumber): boolean {
        return (
            this.numerator === other.numerator &&
            this.denominator === other.denominator &&
            this.isNegative === other.isNegative
        );
    }
    public toString(): string {
        const signature = this.isNegative ? '-' : '';
        return `${signature}${this.numerator}/${this.denominator}`;
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
