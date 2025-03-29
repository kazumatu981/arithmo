import { ArithmoError } from './errors';

/**
 * 自信のプロパティをテストする機能を持つ抽象クラス
 */
export abstract class Testable<T> {
    protected abstract readonly moduleName: string;
    /**
     * テストルール
     */
    protected abstract readonly rules: Rule<T>[];

    /**
     * テストの実行
     */
    public test(): void {
        const errors = this.rules
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
            throw new ArithmoTestError(this.moduleName, errors);
        }
    }
}

/**
 * テストルールの実体
 */
export type Rule<T> = (test: Testable<T>) => void;

export class ArithmoTestError extends Error {
    public readonly errors: ArithmoError[];
    public readonly moduleName: string;

    public constructor(moduleName: string, errors: ArithmoError[]) {
        super(`${moduleName} でエラーが発生しました。`);
        this.moduleName = moduleName;
        this.errors = errors;
    }
}
