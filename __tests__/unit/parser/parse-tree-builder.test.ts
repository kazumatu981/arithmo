import { describe, expect, test } from '@jest/globals';
import { ParseTreeBuilder } from '../../../src/parser/parse-tree-builder';
import { Tokenizer } from '../../../src/tokenizer';

const testCases: string[] = ['1+1', '1-1', '1*12+1', '1*12+3*4'];
describe('unittest-parse-tree-builder', () => {
    testCases.forEach((testCase) => {
        test(`${testCase}`, () => {
            const tokenizer = new Tokenizer(testCase);
            const tokens = tokenizer.tokenize();
            const builder = new ParseTreeBuilder();
            tokens.forEach((token) => builder.addToken(token));
            const tree = builder.build();
            expect(tree?.toNodeInfo()).toMatchSnapshot();
        });
    });
});
