import { PolynomialBase } from './polynomial-base';
import { type RationalNumber } from './rational-number';

/**
 * 分数係数多項式
 */
export class RationalCoefficientPolynomial extends PolynomialBase<RationalNumber> {
    protected readonly _constructable: new (
        coefficients: RationalNumber[],
        variable: string,
    ) => PolynomialBase<RationalNumber> = RationalCoefficientPolynomial;
}
