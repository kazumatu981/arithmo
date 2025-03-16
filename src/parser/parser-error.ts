import {
    ArithmoError,
    type ErrorCode,
    type ErrorOptions,
} from '../common/errors';

import { type Token } from '../tokenizer';

/**
 * 構文解析エラーのオプション
 */
export interface ParserErrorOptions extends ErrorOptions {
    /**
     * 発生した字句
     */
    token?: Token;
}

/**
 * 構文解析エラー
 */
export class ParserError extends ArithmoError {
    public readonly token?: Token;

    /**
     * 構文解析時に発生したエラー
     * @param code - エラーコード
     * @param options - エラーオプション
     */
    public constructor(code: ErrorCode, options?: ParserErrorOptions) {
        if (options && options.position === undefined) {
            options.position = options?.token?.position;
        }
        super(code, 'parser', options);
        this.token = options?.token;
    }
}
