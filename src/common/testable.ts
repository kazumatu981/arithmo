/**
 * 自信のプロパティをテストする機能を持つ抽象クラス
 */
export abstract class Testable<T> {
    /**
     * テストルール
     */
    abstract readonly rules: Rule<T>[];

    /**
     * テストの実行
     */
    public test(): void {
        for (const rule of this.rules) {
            rule(this);
        }
    }
}

/**
 * テストルールの実体
 */
export type Rule<T> = (test: Testable<T>) => void;
