import { Polynomial } from './polynomial';
import { RationalNumber } from './rational-number';

export class RationalCoefficientPolynomial extends Polynomial<RationalNumber> {
    _constructable: new (
        coefficients: RationalNumber[],
        variable: string,
    ) => Polynomial<RationalNumber> = RationalCoefficientPolynomial;
}
