import { Numeric } from '../numeric-resolver/numeric';
import { RationalBase } from './rational-base';

export class RationalNumber extends RationalBase<RationalNumber, Numeric> {
    readonly constructable = RationalNumber;
    /**
     * 分子
     */
    public numerator: Numeric;
    /**
     * 分母
     */
    public denominator: Numeric;

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
