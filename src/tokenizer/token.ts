/**
 * 字句の型
 */
export type TokenType = 'number' | 'operator' | 'leftParen' | 'rightParen';

/**
 * 切り出した字句
 */
export class Token {
    public readonly type: TokenType;
    public readonly value: string;
    public readonly position: number;

    /**
     * @param type - 字句の型
     * @param value - 字句の値
     * @param position - 字句の位置
     */
    constructor(type: TokenType, value: string, position: number) {
        this.type = type;
        this.value = value;
        this.position = position;
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
}
