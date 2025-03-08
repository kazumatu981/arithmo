import { describe, expect, test } from '@jest/globals';
import { ParseTreeBuilder } from '../../../src/parser/parse-tree-builder';
import { tokenize } from '../../../src/tokenizer';

const testCases: string[] = ['1+1', '1-1', '1*12+1', '1*12+3*4', '(1+1)*2'];
describe('unittest-parse-tree-builder', () => {
    testCases.forEach((testCase) => {
        test(`${testCase}`, () => {
            const tokens = tokenize(testCase);
            const builder = new ParseTreeBuilder();
            tokens.forEach((token) => builder.addToken(token));
            const tree = builder.build();
            expect(tree?.toNodeInfo()).toMatchSnapshot();
        });
    });
});
