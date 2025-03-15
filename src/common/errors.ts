import {
    ErrorMessageDictionary,
    type ErrorCode,
    unexpected,
} from './error-messages';
export interface ErrorOptions {
    position?: number;
    appendixMessage?: string;
}

export { type ErrorCode } from './error-messages';
export type ModuleName = 'tokenizer' | 'parser' | 'common';

export class ArithmoError extends Error {
    /**
     * エラーコード
     */
    public readonly code: ErrorCode;
    /**
     * エラーが発生したモジュール名
     */
    public readonly moduleName: ModuleName;
    /**
     * エラーの発生個所
     */
    public readonly position?: number;
    /**
     * エラーの補足メッセージ
     */
    public readonly appendixMessage?: string;

    public constructor(
        code: ErrorCode,
        moduleName: ModuleName,
        options?: ErrorOptions,
    ) {
        const message: string = ErrorMessageDictionary[code] || unexpected;
        super(message);
        this.code = code;
        this.moduleName = moduleName;
        this.position = options?.position;
        this.appendixMessage = options?.appendixMessage;
    }
}
