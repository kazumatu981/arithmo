import { describe, expect, test } from '@jest/globals';
import { tokenize } from '../../../src/tokenizer';
import { parse } from '../../../src/parser';
import { RationalNumberResolver, RationalNumber } from '../../../src/resolver';

describe('RationalNumberResolver', () => {
    test('1/2+1/3', () => {
        const tokens = tokenize('1/2+1/3');
        const nodes = parse(tokens);
        const resolver = new RationalNumberResolver();
        const result = resolver.resolve(nodes!);
        expect(result.equals(new RationalNumber(5, 6))).toBeTruthy();
    });
    test('1/2-1/3', () => {
        const tokens = tokenize('1/2-1/3');
        const nodes = parse(tokens);
        const resolver = new RationalNumberResolver();
        const result = resolver.resolve(nodes!);
        expect(result.equals(new RationalNumber(1, 6))).toBeTruthy();
    });
    test('1/2*1/3', () => {
        const tokens = tokenize('1/2*1/3');
        const nodes = parse(tokens);
        const resolver = new RationalNumberResolver();
        const result = resolver.resolve(nodes!);
        expect(result.equals(new RationalNumber(1, 6))).toBeTruthy();
    });
    test('(1/2)/(1/3)', () => {
        const tokens = tokenize('(1/2)/(1/3)');
        const nodes = parse(tokens);
        const resolver = new RationalNumberResolver();
        const result = resolver.resolve(nodes!);
        expect(result.equals(new RationalNumber(3, 2))).toBeTruthy();
    });
    test('(1/2)^3', () => {
        const tokens = tokenize('(1/2)^3');
        const nodes = parse(tokens);
        const resolver = new RationalNumberResolver();
        const result = resolver.resolve(nodes!);
        expect(result.equals(new RationalNumber(1, 8))).toBeTruthy();
    });
    test('(1/2)^(-3)', () => {
        const tokens = tokenize('(1/2)^(-3)');
        const nodes = parse(tokens);
        const resolver = new RationalNumberResolver();
        const result = resolver.resolve(nodes!);
        expect(result.equals(new RationalNumber(8, 1))).toBeTruthy();
    });
});
