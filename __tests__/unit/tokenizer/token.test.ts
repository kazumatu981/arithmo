import { describe, expect, test } from '@jest/globals';
import { Token, TokenType } from '../../../src/tokenizer/token';
import { TokenizerError } from '../../../src/tokenizer/tokenizer-error';

interface TestCase {
    type: TokenType;
    value: string;
}

const notErrorTestCases: TestCase[] = [
    {
        type: 'number',
        value: '1234',
    },
    {
        type: 'operator',
        value: '+',
    },
    {
        type: 'leftParen',
        value: '(',
    },
    {
        type: 'rightParen',
        value: ')',
    },
];

const errorTestCases: TestCase[] = [
    {
        type: 'number',
        value: '1234a',
    },
    {
        type: 'operator',
        value: '%',
    },
    {
        type: 'operator',
        value: '123',
    },
    {
        type: 'leftParen',
        value: ')',
    },
    {
        type: 'rightParen',
        value: '(',
    },
];

describe('Token', () => {
    describe('can construct', () => {
        for (const testCase of notErrorTestCases) {
            test(`${testCase.type} ${testCase.value}`, () => {
                expect(
                    () => new Token(testCase.type, testCase.value),
                ).not.toThrowError();
            });
        }
        for (const testCase of notErrorTestCases) {
            test(`check type and toString of ${testCase.type} ${testCase.value}`, () => {
                const token = new Token(testCase.type, testCase.value);
                expect(token.type).toBe(testCase.type);
                expect(token.toString()).toBe(testCase.value);
            });
        }
        for (const testCase of errorTestCases) {
            test(`${testCase.type} ${testCase.value}`, () => {
                try {
                    new Token(testCase.type, testCase.value);
                    throw new Error('Should be thrown');
                } catch (e) {
                    expect(e).toBeInstanceOf(TokenizerError);
                    expect((e as TokenizerError).code).toBe('type-mismatch');
                }
            });
        }
    });
});
