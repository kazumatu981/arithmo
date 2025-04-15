import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { tokenize } from '../../../src/tokenizer';
import { parse } from '../../../src/parser';
import { NumericResolver } from '../../../src/resolver';

describe('NumericResolver は整数しか扱いません', () => {
    test('1+1', () => {
        const tokens = tokenize('1+1');
        const nodes = parse(tokens);
        const resolver = new NumericResolver();
        expect(() => {
            resolver.resolve(nodes!);
        }).not.toThrow();
    });
    test('1+1^(-2)', () => {
        const tokens = tokenize('1+1^(-2)');
        const nodes = parse(tokens);
        const resolver = new NumericResolver();
        expect(() => {
            resolver.resolve(nodes!);
        }).toThrow();
    });
    test('1/2', () => {
        const tokens = tokenize('1/2');
        const nodes = parse(tokens);
        const resolver = new NumericResolver();
        expect(() => {
            resolver.resolve(nodes!);
        }).toThrow();
    });
});
