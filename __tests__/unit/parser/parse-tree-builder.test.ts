import { describe, expect, test } from '@jest/globals';
import { ParseTreeBuilder } from '../../../src/parser/parse-tree-builder';
import { tokenize } from '../../../src/tokenizer';

const normalTestCases: string[] = [
    '1+1',
    '1-1',
    '1*12+1',
    '1*12+3*4',
    '(1+1)*2',
    '1+(3*3)+1',
    '-1+1',
    '1+(-1)',
    '1-(-1+5)',
    '-(1-(-1+5))',
];
const abnormalTestCases: string[] = [
    '1+',
    '1--1-1',
    '1+()',
    '1*(3*4',
    '1(1+3)',
    '1 1',
    '1+(3))',
];
describe('unittest-parse-tree-builder', () => {
    normalTestCases.forEach((testCase) => {
        test(`Can build tree from ${testCase}`, () => {
            const tokens = tokenize(testCase);
            const builder = new ParseTreeBuilder();
            tokens.forEach((token) => builder.addToken(token));
            const tree = builder.build();
            expect(tree?.toNodeInfo()).toMatchSnapshot();
        });
    });
    abnormalTestCases.forEach((testCase) => {
        test(`Cannot build tree from ${testCase}`, () => {
            const tokens = tokenize(testCase);
            const builder = new ParseTreeBuilder();
            expect(() => {
                tokens.forEach((token) => builder.addToken(token));
                builder.build();
            }).toThrowErrorMatchingSnapshot();
        });
    });
});
