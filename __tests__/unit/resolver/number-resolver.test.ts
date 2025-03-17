import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { tokenize } from '../../../src/tokenizer';
import { parse } from '../../../src/parser';
import {
    NumberResolver,
    ResolveEventArg,
    ResolveHandler,
} from '../../../src/resolver';

interface NormalTestCase {
    test: string;
    expected: number;
}

const testCases: NormalTestCase[] = [
    {
        test: '1+1',
        expected: 2,
    },
    {
        test: '1*2',
        expected: 2,
    },
    {
        test: '6/2',
        expected: 3,
    },
    {
        test: '-2-3',
        expected: -5,
    },
    {
        test: '6/2/3',
        expected: 1,
    },
    {
        test: '6*2/3',
        expected: 4,
    },
    {
        test: '11+ (12+2)*2',
        expected: 39,
    },
    {
        test: '-(12+2)*2',
        expected: -28,
    },
];

describe('NumberResolver', () => {
    let resolver: NumberResolver = new NumberResolver();
    beforeEach(() => {
        resolver.reset();
    });
    for (const testCase of testCases) {
        test(`${testCase.test} = ${testCase.expected}`, () => {
            const tokens = tokenize(testCase.test);
            const treeRoot = parse(tokens)!;

            const actual = resolver.resolve(treeRoot);

            expect(actual).toEqual(testCase.expected);
        });
    }
    for (const testCase of testCases) {
        test(`Snapshot process ${testCase.test} = ${testCase.expected}`, () => {
            const processes: ResolveEventArg<number>[] = [];

            resolver.onResolved = (event: ResolveEventArg<number>): void => {
                processes.push(event);
            };
            const tokens = tokenize(testCase.test);
            const treeRoot = parse(tokens)!;

            resolver.resolve(treeRoot);

            expect(
                processes.map((process) => {
                    return {
                        order: process.order,
                        nodeInfo: process.node.toString('includeChildren'),
                        result: process.result,
                    };
                }),
            ).toMatchSnapshot();
        });
    }
});
