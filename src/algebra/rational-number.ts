import { Numeric } from './numeric';
import { RationalBase } from './abstract';

/**
 * 有理数
 */
export class RationalNumber extends RationalBase<RationalNumber, Numeric> {
    protected readonly _constructable = RationalNumber;
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
}
