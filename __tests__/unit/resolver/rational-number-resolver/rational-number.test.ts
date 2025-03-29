import { describe, expect, test } from '@jest/globals';
import { RationalNumber } from '../../../../src/resolver/rational-number-resolver/rational-number';

describe('RationalNumber', () => {
    describe('constructor', () => {
        test('1/2', () => {
            const r = new RationalNumber(1, 2);
            expect(r.numerator).toBe(1);
            expect(r.denominator).toBe(2);
            expect(r.isNegative).toBe(false);
        });
        test('-1/2', () => {
            const r = new RationalNumber(1, 2, true);
            expect(r.numerator).toBe(1);
            expect(r.denominator).toBe(2);
            expect(r.isNegative).toBe(true);
        });
        test('0/2', () => {
            const r = new RationalNumber(0, 2);
            expect(r.numerator).toBe(0);
            expect(r.denominator).toBe(1);
            expect(r.isNegative).toBe(false);
        });
        test('(-1)/2', () => {
            expect(() => {
                new RationalNumber(-1, 2);
            }).toThrow();
        });
        test('1/(-2)', () => {
            expect(() => {
                new RationalNumber(1, -2);
            }).toThrow();
        });
        test('1/0', () => {
            expect(() => new RationalNumber(1, 0)).toThrow();
        });
        test('0.1/2', () => {
            expect(() => new RationalNumber(0.1, 2)).toThrow();
        });
        test('1/0.2', () => {
            expect(() => new RationalNumber(1, 0.2)).toThrow();
        });
    });
    describe('properties', () => {
        describe('numerator', () => {
            test('1/2 --> 分子を3に変更', () => {
                const r = new RationalNumber(1, 2);
                r.numerator = 3;
                expect(r.numerator).toBe(3);
                expect(r.denominator).toBe(2);
            });
            test('1/2 --> 分子を4に変更', () => {
                const r = new RationalNumber(1, 2);
                r.numerator = 4;
                expect(r.numerator).toBe(2);
                expect(r.denominator).toBe(1);
            });
            test('1/2 --> 分子を-1に変更', () => {
                const r = new RationalNumber(1, 2);
                expect(() => (r.numerator = -1)).toThrow();
            });
        });
        describe('denominator', () => {
            test('1/2 --> 分母を3に変更', () => {
                const r = new RationalNumber(1, 2);
                r.denominator = 3;
                expect(r.numerator).toBe(1);
                expect(r.denominator).toBe(3);
            });
            test('2/3 --> 分母を4に変更', () => {
                const r = new RationalNumber(2, 3);
                r.denominator = 4;
                expect(r.numerator).toBe(1);
                expect(r.denominator).toBe(2);
            });
            test('1/2 --> 分母を0に変更', () => {
                const r = new RationalNumber(1, 2);
                expect(() => (r.denominator = 0)).toThrow();
            });
        });
        describe('isNegative', () => {
            test('1/2 --> true', () => {
                const r = new RationalNumber(1, 2);
                r.isNegative = true;
                expect(r.isNegative).toBe(true);
            });
            test('-1/2 --> true', () => {
                const r = new RationalNumber(1, 2, true);
                r.isNegative = true;
                expect(r.isNegative).toBe(true);
            });
        });
    });
    describe('equals', () => {
        test('1/2 === 1/2', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 2);
            expect(r1.equals(r2)).toBeTruthy();
        });
        test('-1/2 === -1/2', () => {
            const r1 = new RationalNumber(1, 2, true);
            const r2 = new RationalNumber(1, 2, true);
            expect(r1.equals(r2)).toBeTruthy();
        });
        test('1/2 === 2/4', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(2, 4);
            expect(r1.equals(r2)).toBeTruthy();
        });
        test('0/3 === 0/2', () => {
            const r1 = new RationalNumber(0, 3);
            const r2 = new RationalNumber(0, 2);
            expect(r1.equals(r2)).toBeTruthy();
        });
        test('1/2 !== 1/3', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 3);
            expect(r1.equals(r2)).toBeFalsy();
        });
        test('1/2 !== 2/3', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(2, 3);
            expect(r1.equals(r2)).toBeFalsy();
        });
        test('1/2 !== -1/2', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 2, true);
            expect(r1.equals(r2)).toBeFalsy();
        });
    });

    describe('add', () => {
        test('1/2 + 1/2 === 1/1', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 2);
            const r3 = r1.add(r2);
            expect(r3.equals(new RationalNumber(1, 1))).toBeTruthy();
        });
        test('1/2 + 1/3 === 5/6', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 3);
            const r3 = r1.add(r2);
            expect(r3.equals(new RationalNumber(5, 6))).toBeTruthy();
        });
        test('1/2 + -1/3 === 1/6', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 3, true);
            const r3 = r1.add(r2);
            expect(r3.equals(new RationalNumber(1, 6, false))).toBeTruthy();
        });
        test('-1/4 + -1/2 === -3/2', () => {
            const r1 = new RationalNumber(1, 4, true);
            const r2 = new RationalNumber(1, 2, true);
            const r3 = r1.add(r2);
            expect(r3.equals(new RationalNumber(3, 4, true))).toBeTruthy();
        });
    });

    describe('subtract', () => {
        test('2/3 - 1/3 === 1/3', () => {
            const r1 = new RationalNumber(2, 3);
            const r2 = new RationalNumber(1, 3);
            const r3 = r1.subtract(r2);
            expect(r3.equals(new RationalNumber(1, 3))).toBeTruthy();
        });
        test('1/2 - 1/3 === 1/6', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 3);
            const r3 = r1.subtract(r2);
            expect(r3.equals(new RationalNumber(1, 6))).toBeTruthy();
        });
        test('1/2 - -1/3 === 5/6', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 3, true);
            const r3 = r1.subtract(r2);
            expect(r3.equals(new RationalNumber(5, 6))).toBeTruthy();
        });
        test('-3/4 - - 1/2 === -1/4', () => {
            const r1 = new RationalNumber(3, 4, true);
            const r2 = new RationalNumber(1, 2, true);
            const r3 = r1.subtract(r2);
            expect(r3.equals(new RationalNumber(1, 4, true))).toBeTruthy();
        });
        test('5/6 - 5/6 === 0/1', () => {
            const r1 = new RationalNumber(5, 6);
            const r2 = new RationalNumber(5, 6);
            const r3 = r1.subtract(r2);
            expect(r3.equals(new RationalNumber(0, 1))).toBeTruthy();
        });
    });

    describe('multiply', () => {
        test('1/2 * 1/2 === 1/4', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 2);
            const r3 = r1.multiply(r2);
            expect(r3.equals(new RationalNumber(1, 4))).toBeTruthy();
        });
        test('1/2 * 1/3 === 1/6', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 3);
            const r3 = r1.multiply(r2);
            expect(r3.equals(new RationalNumber(1, 6))).toBeTruthy();
        });
        test('1/2 * -1/3 === -1/6', () => {
            const r1 = new RationalNumber(1, 2);
            const r2 = new RationalNumber(1, 3, true);
            const r3 = r1.multiply(r2);
            expect(r3.equals(new RationalNumber(1, 6, true))).toBeTruthy();
        });
        test('-1/2 * 1/3 === -1/6', () => {
            const r1 = new RationalNumber(1, 2, true);
            const r2 = new RationalNumber(1, 3, false);
            const r3 = r1.multiply(r2);
            expect(r3.equals(new RationalNumber(1, 6, true))).toBeTruthy();
        });
        test('-1/4 * -1/2 === 1/8', () => {
            const r1 = new RationalNumber(1, 4, true);
            const r2 = new RationalNumber(1, 2, true);
            const r3 = r1.multiply(r2);
            expect(r3.equals(new RationalNumber(1, 8))).toBeTruthy();
        });
        test('5/6 * 1/1 === 5/6', () => {
            const r1 = new RationalNumber(5, 6);
            const r2 = new RationalNumber(1, 1);
            const r3 = r1.multiply(r2);
            expect(r3.equals(new RationalNumber(5, 6))).toBeTruthy();
        });
        test('5/6 * 0/1 === 0/1', () => {
            const r1 = new RationalNumber(5, 6);
            const r2 = new RationalNumber(0, 1);
            const r3 = r1.multiply(r2);
            expect(r3.equals(new RationalNumber(0, 1))).toBeTruthy();
        });
    });
});
