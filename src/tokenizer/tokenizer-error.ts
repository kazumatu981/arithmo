import {
    ArithmoError,
    type ErrorCode,
    type ErrorOptions,
} from '../common/errors';

export class TokenizerError extends ArithmoError {
    public constructor(code: ErrorCode, options?: ErrorOptions) {
        super(code, 'tokenizer', options);
    }
}
