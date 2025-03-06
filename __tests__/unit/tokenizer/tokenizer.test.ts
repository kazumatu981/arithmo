import { describe, test, expect } from '@jest/globals';
import { type TokenType, tokenize, Token } from '../../../src/tokenizer';
interface ExpectedToken {
    tokenType: TokenType;
    value: string;
    position: number;
}
interface IResult {
    isSuccess: boolean;
    description: string;
}
interface Success extends IResult {
    tokens: ExpectedToken[];
}
interface Fail extends IResult {}
interface TestCase {
    test: string;
    expected: Success | Error;
}

type ExpectedResult = Success | Fail;

function toSuccess(tokens: Token[] | undefined, expected: ExpectedResult) {
    expect(tokens).toBeDefined();
    tokens = tokens!;
    expect(expected.isSuccess).toBeTruthy();
    let successExpected = expected as Success;
    expect(successExpected.tokens.length).toEqual(tokens.length);
    const compared = successExpected.tokens.map(
        (test, i) =>
            test.tokenType === tokens[i].type &&
            test.value === tokens[i].value &&
            test.position === tokens[i].position,
    );
    expect(compared.every((item) => item)).toBeTruthy();
}

function expectTokenize(expression: string) {
    let tokens: Token[] | undefined;
    let error: Error | undefined;

    try {
        tokens = tokenize(expression);
    } catch (e) {
        error = e;
    }

    return {
        toSuccess: (expected: ExpectedResult) => {
            toSuccess(tokens, expected);
        },
    };
}
describe('unittest-tokenizer', () => {});
