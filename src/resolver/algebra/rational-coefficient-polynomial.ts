import { PolynomialBase } from './polynomial-base';
import { RationalNumber } from './rational-number';

export class RationalCoefficientPolynomial extends PolynomialBase<RationalNumber> {
    protected readonly _constructable: new (
        coefficients: RationalNumber[],
        variable: string,
    ) => PolynomialBase<RationalNumber> = RationalCoefficientPolynomial;
}
