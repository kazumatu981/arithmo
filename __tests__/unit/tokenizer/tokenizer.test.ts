import { describe, test, expect } from '@jest/globals';
import {
    type SuccessTestCase,
    type FailTestCase,
    expectTokenize,
} from './tokenizer-test-util';

const successTestCases: SuccessTestCase[] = [
    {
        test: '1 + 1',
        description: '通常の二項演算',
        expected: {
            tokens: [
                { tokenType: 'number', value: '1', position: 0 },
                { tokenType: 'operator', value: '+', position: 2 },
                { tokenType: 'number', value: '1', position: 4 },
            ],
        },
    },
    {
        test: '1 + 12',
        description: '通常の二項演算(二けた)',
        expected: {
            tokens: [
                { tokenType: 'number', value: '1', position: 0 },
                { tokenType: 'operator', value: '+', position: 2 },
                { tokenType: 'number', value: '12', position: 4 },
            ],
        },
    },
    {
        test: '    1 + 12',
        description: '通常の二項演算 前にスペース',
        expected: {
            tokens: [
                { tokenType: 'number', value: '1' },
                { tokenType: 'operator', value: '+' },
                { tokenType: 'number', value: '12' },
            ],
        },
    },
    {
        test: '    1 + 12      ',
        description: '通常の二項演算 後ろにスペース',
        expected: {
            tokens: [
                { tokenType: 'number', value: '1' },
                { tokenType: 'operator', value: '+' },
                { tokenType: 'number', value: '12' },
            ],
        },
    },
    {
        test: '25 + 13 *  12',
        description: '通常の三項演算',
        expected: {
            tokens: [
                { tokenType: 'number', value: '25' },
                { tokenType: 'operator', value: '+' },
                { tokenType: 'number', value: '13' },
                { tokenType: 'operator', value: '*' },
                { tokenType: 'number', value: '12' },
            ],
        },
    },
    {
        test: '123 * (12+13   + 12)',
        description: '括弧を含む',
        expected: {
            tokens: [
                { tokenType: 'number', value: '123' },
                { tokenType: 'operator', value: '*' },
                { tokenType: 'leftParen', value: '(' },
                { tokenType: 'number', value: '12' },
                { tokenType: 'operator', value: '+' },
                { tokenType: 'number', value: '13' },
                { tokenType: 'operator', value: '+' },
                { tokenType: 'number', value: '12' },
                { tokenType: 'rightParen', value: ')' },
            ],
        },
    },
    {
        test: '123 * (( 12+13   + 12)',
        description: '括弧が変(ここではエラーが起きない)',
        expected: {
            tokens: [
                { tokenType: 'number', value: '123' },
                { tokenType: 'operator', value: '*' },
                { tokenType: 'leftParen', value: '(' },
                { tokenType: 'leftParen', value: '(' },
                { tokenType: 'number', value: '12' },
                { tokenType: 'operator', value: '+' },
                { tokenType: 'number', value: '13' },
                { tokenType: 'operator', value: '+' },
                { tokenType: 'number', value: '12' },
                { tokenType: 'rightParen', value: ')' },
            ],
        },
    },
    {
        test: '123 * *( 12+13   + 12)',
        description: '演算子が続く(ここではエラーが起きない)',
        expected: {
            tokens: [
                { tokenType: 'number', value: '123' },
                { tokenType: 'operator', value: '*' },
                { tokenType: 'operator', value: '*' },
                { tokenType: 'leftParen', value: '(' },
                { tokenType: 'number', value: '12' },
                { tokenType: 'operator', value: '+' },
                { tokenType: 'number', value: '13' },
                { tokenType: 'operator', value: '+' },
                { tokenType: 'number', value: '12' },
                { tokenType: 'rightParen', value: ')' },
            ],
        },
    },
];

const failTestCases: FailTestCase[] = [
    {
        test: '1z23+12',
        description: '数字以外の文字を含む',
        expected: {},
    },
    {
        test: '1!23+12',
        description: '数字以外の文字を含む',
        expected: {},
    },
];

describe('unittest-tokenizer', () => {
    describe('success test case', () => {
        successTestCases.forEach((testCase) => {
            test(`${testCase.test} - ${testCase.description}`, () => {
                expectTokenize(testCase.test).toSuccess(testCase.expected);
            });
        });
    });
    describe('fail test case', () => {
        failTestCases.forEach((testCase) => {
            test(`${testCase.test} - ${testCase.description}`, () => {
                expectTokenize(testCase.test).toFail(testCase.expected);
            });
        });
    });
});
