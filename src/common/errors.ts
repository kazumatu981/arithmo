import { ErrorMessageDictionary, type ErrorCode } from './error-messages';

/**
 * エラーオプション
 */
export interface ErrorOptions {
    /**
     * エラーメッセージに埋め込む位置
     */
    position?: number;
    /**
     * エラーメッセージに付加するメッセージ
     */
    appendixMessage?: string;
}

/**
 * エラーが発生したモジュール名
 */
export type ModuleName = 'tokenizer' | 'parser' | 'common';

/**
 * Arithmo で発生したエラー
 */
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

    /**
     * 新しい ArithmoError インスタンスを作成します。
     * @param code - エラーコード
     * @param moduleName - エラーが発生したモジュール名
     * @param options - エラーオプション（位置や補足メッセージを含む）
     */
    public constructor(
        code: ErrorCode,
        moduleName: ModuleName,
        options?: ErrorOptions,
    ) {
        /**
         * エラーメッセージの設定
         */
        const message: string =
            ErrorMessageDictionary[code] ||
            ErrorMessageDictionary['unexpected'];
        super(message);
        this.code = code;
        this.moduleName = moduleName;
        this.position = options?.position;
        this.appendixMessage = options?.appendixMessage;
    }
}

export { type ErrorCode } from './error-messages';
