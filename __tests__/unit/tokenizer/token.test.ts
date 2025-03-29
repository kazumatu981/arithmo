import { describe, expect, test } from '@jest/globals';
import { Token, TokenType } from '../../../src/tokenizer/token';
import { TokenizerError } from '../../../src/tokenizer/tokenizer-error';
import { ArithmoTestError } from '../../../src/common/testable';
import { ErrorCode } from '../../../src/common/error-messages';
import { ArithmoTestErrorUtil } from '../util/ArithmoTestErrorUtil';

interface TestCase {
    type: TokenType;
    value: string;
}

interface ErrorTestCase extends TestCase {
    expectedError: ErrorCode;
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

const errorTestCases: ErrorTestCase[] = [
    {
        type: 'number',
        value: '1234a',
        expectedError: 'unknown-character',
    },
    {
        type: 'operator',
        value: '%',
        expectedError: 'type-mismatch',
    },
    {
        type: 'operator',
        value: '123',
        expectedError: 'type-mismatch',
    },
    {
        type: 'leftParen',
        value: ')',
        expectedError: 'type-mismatch',
    },
    {
        type: 'rightParen',
        value: '(',
        expectedError: 'type-mismatch',
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
                    const util = new ArithmoTestErrorUtil(e as Error);
                    util.isEqualModuleName('tokenizer');
                    util.hasError();
                    util.hasErrorCode(testCase.expectedError);
                }
            });
        }
    });
});
