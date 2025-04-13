import { ArithmoError } from './errors';

/**
 * 自信のプロパティをテストする機能を持つ抽象クラス
 */
export abstract class Testable<T> {
    protected abstract readonly _moduleName: string;
    /**
     * テストルール
     */
    protected abstract readonly _rules: Rule<T>[];

    /**
     * テストの実行
     */
    public test(): void {
        const errors = this._rules
            .map((rule) => {
                try {
                    rule(this);
                } catch (error) {
                    if (error instanceof ArithmoError) {
                        return error;
                    } else {
                        throw error;
                    }
                }
                return undefined;
            })
            .filter((error) => error !== undefined) as ArithmoError[];
        if (errors.length > 0) {
            throw new ArithmoTestError(this._moduleName, errors);
        }
    }
}

/**
 * テストルールの実体
 */
export type Rule<T> = (test: Testable<T>) => void;

/**
 * テストの実行結果
 */
export class ArithmoTestError extends Error {
    public readonly errors: ArithmoError[];
    public readonly moduleName: string;

    /**
     * 新しい ArithmoTestError インスタンスを作成します。
     * @param moduleName - モジュール名称
     * @param errors - 発生したエラーの配列
     */
    public constructor(moduleName: string, errors: ArithmoError[]) {
        super(`${moduleName} でエラーが発生しました。`);
        this.moduleName = moduleName;
        this.errors = errors;
    }
}
