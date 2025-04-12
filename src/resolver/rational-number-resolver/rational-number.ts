import { Numeric } from '../numeric-resolver/numeric';
import { RationalBase } from './rational-base';

export class RationalNumber extends RationalBase<RationalNumber, Numeric> {
    readonly constructable = RationalNumber;
    _numerator: Numeric = new Numeric(0);
    _denominator: Numeric = new Numeric(1);

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
