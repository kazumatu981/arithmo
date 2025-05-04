import { describe, expect, test } from '@jest/globals';
import {
    RationalNumber,
    RationalCoefficientPolynomial,
} from '../../../../src/algebra';

describe('RationalCoefficientPolynomial', () => {
    test('constructor', () => {
        const p = new RationalCoefficientPolynomial(
            [new RationalNumber(1, 2), new RationalNumber(3, 4)],
            'x',
        );
        expect(p.coefficients[0].equals(new RationalNumber(1, 2))).toBeTruthy();
        expect(p.coefficients[1].equals(new RationalNumber(3, 4))).toBeTruthy();
        expect(p.variable).toBe('x');
        expect(p.degree).toBe(1);
    });

    test('negate', () => {
        const p = new RationalCoefficientPolynomial(
            [new RationalNumber(1, 2), new RationalNumber(3, 4)],
            'x',
        );
        const p2 = p.negate();
        expect(
            p2.coefficients[0].equals(new RationalNumber(-1, 2)),
        ).toBeTruthy();
        expect(
            p2.coefficients[1].equals(new RationalNumber(-3, 4)),
        ).toBeTruthy();
    });
    test('zero', () => {
        const p = new RationalCoefficientPolynomial(
            [new RationalNumber(1, 2), new RationalNumber(3, 4)],
            'x',
        );
        const zero = p.zero;
        expect(
            zero.coefficients[0].equals(new RationalNumber(0, 1)),
        ).toBeTruthy();
        expect(zero.degree).toBe(0);
        expect(zero.variable).toBe('x');
    });
    test('unit', () => {
        const p = new RationalCoefficientPolynomial(
            [new RationalNumber(1, 2), new RationalNumber(3, 4)],
            'x',
        );
        const unit = p.unit;
        expect(
            unit.coefficients[0].equals(new RationalNumber(1, 1)),
        ).toBeTruthy();
        expect(unit.degree).toBe(0);
        expect(unit.variable).toBe('x');
    });
    describe('equals', () => {
        test('同じ式の場合等しい', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            expect(p1.equals(p2)).toBeTruthy();
        });
        test('次数が異なる場合等しくない', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2)],
                'x',
            );
            expect(p1.equals(p2)).toBeFalsy();
        });
        test('変数が異なる場合等しくない', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'y',
            );
            expect(p1.equals(p2)).toBeFalsy();
        });
        test('係数が異なる場合等しくない', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(1, 4)],
                'x',
            );
            expect(p1.equals(p2)).toBeFalsy();
        });
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
    describe('add', () => {
        test('normal case', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p3 = p1.add(p2);
            expect(
                p3.safeCoefficient(0).equals(new RationalNumber(1, 1)),
            ).toBeTruthy();
            expect(
                p3.safeCoefficient(1).equals(new RationalNumber(3, 2)),
            ).toBeTruthy();
        });
        test('p1 longer than p2', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2)],
                'x',
            );
            const p3 = p1.add(p2);
            expect(
                p3.safeCoefficient(0).equals(new RationalNumber(1, 1)),
            ).toBeTruthy();
            expect(
                p3.safeCoefficient(1).equals(new RationalNumber(3, 4)),
            ).toBeTruthy();
        });
        test('p2 longer than p1', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p3 = p1.add(p2);
            expect(
                p3.safeCoefficient(0).equals(new RationalNumber(1, 1)),
            ).toBeTruthy();
            expect(
                p3.safeCoefficient(1).equals(new RationalNumber(3, 4)),
            ).toBeTruthy();
        });
        test('トリムが発生するケース', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(-3, 4)],
                'x',
            );
            const p3 = p1.add(p2);
            expect(p3.degree).toBe(0);
            expect(
                p3.safeCoefficient(0).equals(new RationalNumber(1, 1)),
            ).toBeTruthy();
        });
        test('変数が異なる場合はエラー', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(-3, 4)],
                'y',
            );
            expect(() => {
                p1.add(p2);
            }).toThrow();
        });
    });

    describe('multiply', () => {
        test('normal case', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p3 = p1.multiply(p2);
            expect(
                p3.safeCoefficient(0).equals(new RationalNumber(1, 4)),
            ).toBeTruthy();
            expect(
                p3.safeCoefficient(1).equals(new RationalNumber(3, 4)),
            ).toBeTruthy();
            expect(
                p3.safeCoefficient(2).equals(new RationalNumber(9, 16)),
            ).toBeTruthy();
        });
        test('zero case', () => {
            let p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            let p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(0, 1)],
                'x',
            );
            let p3 = p1.multiply(p2);
            expect(p3.equals(p1.zero)).toBeTruthy();
        });
        test('変数が異なる場合はエラー', () => {
            const p1 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(3, 4)],
                'x',
            );
            const p2 = new RationalCoefficientPolynomial(
                [new RationalNumber(1, 2), new RationalNumber(-3, 4)],
                'y',
            );
            expect(() => {
                p1.multiply(p2);
            }).toThrow();
        });
    });
});
