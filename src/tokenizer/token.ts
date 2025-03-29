import { isAllValidCharacters, isOperator } from '../common/char-util';
import { Testable, type Rule } from '../common/testable';
import { TokenizerError } from './tokenizer-error';
/**
 * 字句の型
 * @group Tokenizer
 */
export type TokenType = 'number' | 'operator' | 'leftParen' | 'rightParen';

/**
 * 切り出した字句
 * @group Tokenizer
 */
export class Token extends Testable<Token> {
    protected readonly moduleName = 'tokenizer';

    public readonly type: TokenType;
    public readonly value: string;
    public readonly position?: number;

    /**
     * @param type - 字句の型
     * @param value - 字句の値
     * @param position - 字句の位置
     */
    constructor(type: TokenType, value: string, position?: number) {
        super();
        this.type = type;
        this.value = value;
        this.position = position;
        this.test();
    }

    /**
     * マイナス記号かどうか
     * @returns マイナス記号かどうかを表す真偽値
     */
    public get isNegativeSign(): boolean {
        return this.type === 'operator' && this.value === '-';
    }

    /**
     * Tokenを文字列化する
     * @returns 字句を表す文字列
     */
    public toString(): string {
        return this.value;
    }

    protected readonly rules: Rule<Token>[] = [
        (testable): void => {
            const token = testable as Token;
            if (isAllValidCharacters(token.value)) return;
            throw new TokenizerError('unknown-character', {
                position: token.position,
            });
        },
        /**
         * number token は数字しか受け付けない
         * @param testable - テスト対象
         */
        (testable): void => {
            const token = testable as Token;
            if (token.type === 'number' && !token.value.match(/^[0-9]+$/)) {
                throw new TokenizerError('type-mismatch', {
                    position: token.position,
                });
            }
        },
        /**
         * operator token は演算子しか受け付けない
         * @param testable テスト対象
         */
        (testable): void => {
            const token = testable as Token;
            if (
                token.type === 'operator' &&
                (token.value.length !== 1 || !isOperator(token.value, 0))
            ) {
                throw new TokenizerError('type-mismatch', {
                    position: token.position,
                });
            }
        },
        /**
         * leftParen token は '(' しか受け付けない
         * @param testable テスト対象
         */
        (testable): void => {
            const token = testable as Token;
            if (token.type === 'leftParen' && token.value !== '(') {
                throw new TokenizerError('type-mismatch', {
                    position: token.position,
                });
            }
        },
        /**
         * rightParen token は ')' しか受け付けない
         * @param testable テスト対象
         */
        (testable): void => {
            const token = testable as Token;
            if (token.type === 'rightParen' && token.value !== ')') {
                throw new TokenizerError('type-mismatch', {
                    position: token.position,
                });
            }
        },
    ];
}
