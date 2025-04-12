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
    test('evaluate', () => {
        let p = new RationalCoefficientPolynomial(
            [new RationalNumber(1, 2), new RationalNumber(3, 4)],
            'x',
        );
        p = p.elevate(2);
        expect(
            p.safeCoefficient(0).equals(new RationalNumber(0, 1)),
        ).toBeTruthy();
        expect(
            p.safeCoefficient(1).equals(new RationalNumber(0, 1)),
        ).toBeTruthy();
        expect(
            p.safeCoefficient(2).equals(new RationalNumber(1, 2)),
        ).toBeTruthy();
        expect(
            p.safeCoefficient(3).equals(new RationalNumber(3, 4)),
        ).toBeTruthy();
    });
    describe('scalarMultiply', () => {
        test('normal case', () => {
            let p = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            p = p.scalarMultiply(new RationalNumber(2, 3));
            expect(
                p.safeCoefficient(0).equals(new RationalNumber(1, 3)),
            ).toBeTruthy();
            expect(
                p.safeCoefficient(1).equals(new RationalNumber(1, 2)),
            ).toBeTruthy();
        });
        test('zero case', () => {
            let p = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            p = p.scalarMultiply(new RationalNumber(0, 1));
            expect(
                p.equals(
                    new RationalCoefficientPolynomial(
                        [new RationalNumber(0, 1)],
                        'x',
                    ),
                ),
            ).toBeTruthy();
        });
    });
});
