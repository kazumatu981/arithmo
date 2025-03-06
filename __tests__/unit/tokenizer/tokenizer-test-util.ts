import { tokenize, type Token, type TokenType } from '../../../src/tokenizer';

interface ExpectedToken {
    tokenType: TokenType;
    value: string;
    position?: number;
}
interface Success {
    tokens: ExpectedToken[];
}
interface Fail {}

type ExpectedResult = Success | Fail;

export interface SuccessTestCase {
    test: string;
    description: string;
    expected: Success;
}
export interface FailTestCase {
    test: string;
    description: string;
    expected: Fail;
}

function toSuccess(tokens: Token[] | undefined, expected: ExpectedResult) {
    expect(tokens).toBeDefined();
    tokens = tokens!;
    let successExpected = expected as Success;
    expect(successExpected.tokens.length).toEqual(tokens.length);
    const compared = successExpected.tokens.map((test, i) =>
        test.tokenType === tokens[i].type &&
        test.value === tokens[i].value &&
        test.position === undefined
            ? true
            : test.position === tokens[i].position,
    );
    expect(compared.every((item) => item)).toBeTruthy();
}

function toFail(error: Error | undefined, expected: ExpectedResult) {
    expect(error).toBeDefined();
}
export function expectTokenize(expression: string) {
    let tokens: Token[] | undefined;
    let error: Error | undefined;

    try {
        tokens = tokenize(expression);
    } catch (e) {
        error = e as Error;
    }

    return {
        toSuccess: (expected: ExpectedResult) => {
            toSuccess(tokens, expected);
        },
        toFail: (expected: ExpectedResult) => {
            toFail(error, expected);
        },
    };
}
