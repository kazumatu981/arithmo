import { describe, test, expect } from '@jest/globals';
import { tokenize } from '../../../src/tokenizer';
import { parse } from '../../../src/parser';
import {
    RationalCoefficientPolynomialResolver,
    RationalCoefficientPolynomial,
} from '../../../src/resolver';
import { RationalNumber } from '../../../src/algebra';

describe('RationalCoefficientPolynomialResolver', () => {
    test('1/2+1/3', () => {
        const tokens = tokenize('1/2+1/3');
        const nodes = parse(tokens);
        const resolver = new RationalCoefficientPolynomialResolver();
        const result = resolver.resolve(nodes!);
        expect(
            result.equals(
                new RationalCoefficientPolynomial([new RationalNumber(5, 6)]),
            ),
        ).toBeTruthy();
    });
    test('1/2-1/3', () => {
        const tokens = tokenize('1/2-1/3');
        const nodes = parse(tokens);
        const resolver = new RationalCoefficientPolynomialResolver();
        const result = resolver.resolve(nodes!);
        expect(
            result.equals(
                new RationalCoefficientPolynomial([new RationalNumber(1, 6)]),
            ),
        ).toBeTruthy();
    });
    test('1/2*1/3', () => {
        const tokens = tokenize('1/2*1/3');
        const nodes = parse(tokens);
        const resolver = new RationalCoefficientPolynomialResolver();
        const result = resolver.resolve(nodes!);
        expect(
            result.equals(
                new RationalCoefficientPolynomial([new RationalNumber(1, 6)]),
            ),
        ).toBeTruthy();
    });
    test('(1/2)/(1/3)', () => {
        const tokens = tokenize('(1/2)/(1/3)');
        const nodes = parse(tokens);
        const resolver = new RationalCoefficientPolynomialResolver();
        const result = resolver.resolve(nodes!);
        expect(
            result.equals(
                new RationalCoefficientPolynomial([new RationalNumber(3, 2)]),
            ),
        ).toBeTruthy();
    });
    test('(1/2)^3', () => {
        const tokens = tokenize('(1/2)^3');
        const nodes = parse(tokens);
        const resolver = new RationalCoefficientPolynomialResolver();
        const result = resolver.resolve(nodes!);
        expect(
            result.equals(
                new RationalCoefficientPolynomial([new RationalNumber(1, 8)]),
            ),
        ).toBeTruthy();
    });
    test('(1/2)^(-3)', () => {
        const tokens = tokenize('(1/2)^(-3)');
        const nodes = parse(tokens);
        const resolver = new RationalCoefficientPolynomialResolver();
        expect(() => resolver.resolve(nodes!)).toThrowError();
    });
    test('1+x+x = 1+2*x', () => {
        const tokens = tokenize('1+x+x');
        const nodes = parse(tokens);
        const resolver = new RationalCoefficientPolynomialResolver();
        const result = resolver.resolve(nodes!);
        expect(
            result.equals(
                new RationalCoefficientPolynomial(
                    [new RationalNumber(1, 1), new RationalNumber(2, 1)],
                    'x',
                ),
            ),
        ).toBeTruthy();
    });
    test('(1+x)*(3+2x) = 3+5*x+2*x^2', () => {
        const tokens = tokenize('(1+x)*(3+2*x)');
        const nodes = parse(tokens);
        const resolver = new RationalCoefficientPolynomialResolver();
        const result = resolver.resolve(nodes!);
        expect(
            result.equals(
                new RationalCoefficientPolynomial(
                    [
                        new RationalNumber(3, 1),
                        new RationalNumber(5, 1),
                        new RationalNumber(2, 1),
                    ],
                    'x',
                ),
            ),
        ).toBeTruthy();
    });
    test('(1-x)*(1+x+x^2+x^3) = 1-x^4', () => {
        const tokens = tokenize('(1-x)*(1+x+x^2+x^3)');
        const nodes = parse(tokens);
        const resolver = new RationalCoefficientPolynomialResolver();
        const result = resolver.resolve(nodes!);
        expect(
            result.equals(
                new RationalCoefficientPolynomial(
                    [
                        new RationalNumber(1, 1),
                        new RationalNumber(0, 1),
                        new RationalNumber(0, 1),
                        new RationalNumber(0, 1),
                        new RationalNumber(-1, 1),
                    ],
                    'x',
                ),
            ),
        ).toBeTruthy();
    });
});
