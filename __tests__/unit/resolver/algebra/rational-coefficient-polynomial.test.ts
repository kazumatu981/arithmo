import { describe, expect, test } from '@jest/globals';
import { RationalCoefficientPolynomial } from '../../../../src/resolver/algebra/rational-coefficient-polynomial';
import { RationalNumber } from '../../../../src/resolver/algebra/rational-number';

describe('RationalCoefficientPolynomial', () => {
    test('constructor', () => {
        const p = new RationalCoefficientPolynomial(
            [new RationalNumber(1, 2), new RationalNumber(3, 4)],
            'x',
        );
        expect(p.coefficients[0].equals(new RationalNumber(1, 2))).toBeTruthy();
        expect(p.coefficients[1].equals(new RationalNumber(3, 4))).toBeTruthy();
        expect(p.variable).toBe('x');
    });
    test('safeCoefficient', () => {
        const p = new RationalCoefficientPolynomial(
            [new RationalNumber(1, 2), new RationalNumber(3, 4)],
            'x',
        );
        expect(
            p.safeCoefficient(0).equals(new RationalNumber(1, 2)),
        ).toBeTruthy();
        expect(
            p.safeCoefficient(1).equals(new RationalNumber(3, 4)),
        ).toBeTruthy();
        expect(
            p.safeCoefficient(2).equals(new RationalNumber(0, 1)),
        ).toBeTruthy();
    });
});
