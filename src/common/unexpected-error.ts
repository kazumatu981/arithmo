import { ArithmoError, type ErrorOptions, type ModuleName } from './errors';

/**
 * 予期しないエラー
 */
export class UnexpectedError extends ArithmoError {
    /**
     * 予期しないエラーが発生した
     * @param moduleName - モジュール名称
     * @param options - エラーオプション
     */
    public constructor(moduleName: ModuleName, options?: ErrorOptions) {
        super('unexpected', moduleName, options);
    }
}
