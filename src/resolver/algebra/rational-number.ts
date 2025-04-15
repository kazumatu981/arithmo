import { Numeric } from './numeric';
import { RationalBase } from './rational-base';
import { type Rule } from '../../common/testable';
import { isNumeric } from '../algebra/numeric';

/**
 * 有理数
 */
export class RationalNumber extends RationalBase<RationalNumber, Numeric> {
    protected readonly _constructable = RationalNumber;
    protected readonly _moduleName = 'resolver';
    protected _numerator: Numeric = new Numeric(0);
    protected _denominator: Numeric = new Numeric(1);

    /**
     * インスタンスを生成する。
     * @param numerator 分子
     * @param denominator 分母
     */
    public constructor(
        numerator: Numeric | number,
        denominator: Numeric | number,
    ) {
        super();
        this.numerator =
            typeof numerator === 'number' ? new Numeric(numerator) : numerator;
        this.denominator =
            typeof denominator === 'number'
                ? new Numeric(denominator)
                : denominator;
    }
    protected readonly _rules: Rule<RationalNumber>[] = [
        (r): void => {
            const rationalNumber = r as RationalNumber;
            if (rationalNumber.denominator.equals(0)) {
                throw new Error('分母は0にできません。');
            }
        },
        (r): void => {
            const rationalNumber = r as RationalNumber;
            if (
                !isNumeric(rationalNumber.numerator.value) ||
                !isNumeric(rationalNumber.denominator.value)
            ) {
                throw new Error(
                    '分子分母の両方が整数でなければなりません。',
                );
            }
        },
    ];
}
