import {
    ArithmoError,
    type ErrorCode,
    type ErrorOptions,
} from '../common/errors';

/**
 * 切り出し字句のエラー
 */
export class TokenizerError extends ArithmoError {
    /**
     * 文字列を切り出す際に発生したエラー
     * @param code - エラーコード
     * @param options - エラーオプション
     */
    public constructor(code: ErrorCode, options?: ErrorOptions) {
        super(code, 'tokenizer', options);
    }
}
