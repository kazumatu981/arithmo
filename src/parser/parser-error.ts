import {
    ArithmoError,
    type ErrorCode,
    type ErrorOptions,
} from '../common/errors';

import { type Token } from '../tokenizer';

export interface ParserErrorOptions extends ErrorOptions {
    token?: Token;
}
export class ParserError extends ArithmoError {
    public readonly token?: Token;
    public constructor(code: ErrorCode, options?: ParserErrorOptions) {
        if (options && options.position === undefined) {
            options.position = options?.token?.position;
        }
        super(code, 'parser', options);
        this.token = options?.token;
    }
}
