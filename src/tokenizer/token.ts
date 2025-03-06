/**
 * 字句の型
 */
export type TokenType = 'number' | 'operator' | 'leftParen' | 'rightParen';

/**
 * 切り出した字句
 */
export class Token {
    public readonly id: string;
    public readonly type: TokenType;
    public readonly value: string;
    public readonly position: number;

    /**
     * @param type 字句の型
     * @param value 字句の値
     * @param position 字句の位置
     */
    constructor(type: TokenType, value: string, position: number) {
        this.id = `${type}-${value}-${position}`;
        this.type = type;
        this.value = value;
        this.position = position;
    }

    /**
     * 数字かどうか
     */
    public get isNumber(): boolean {
        return this.type === 'number';
    }

    /**
     * 演算子かどうか
     */
    public get isOperator(): boolean {
        return this.type === 'operator';
    }

    /**
     * 左括弧かどうか
     */
    public get isLeftParen(): boolean {
        return this.type === 'leftParen';
    }

    /**
     * 右括弧かどうか
     */
    public get isRightParen(): boolean {
        return this.type === 'rightParen';
    }

    /**
     * 左括弧か右括弧かどうか
     */
    public get isParen(): boolean {
        return this.isLeftParen || this.isRightParen;
    }

    /**
     * マイナス記号かどうか
     * @returns マイナス記号かどうかを表す真偽値
     */
    public get isNegativeSign(): boolean {
        return this.type === 'operator' && this.value === '-';
    }

    /**
     * 優先度の高い演算子かどうか
     * @returns 優先度が高い演算子かどうかを表す真偽値
     */
    public get isPrimaryOperator(): boolean {
        return this.type === 'operator' && (this.value === '*' || this.value === '/');
    }

    /**
     * 優先度の低い演算子かどうか
     * @returns 優先度が低い演算子かどうかを表す真偽値
     */
    public get isSecondaryOperator(): boolean {
        return this.type === 'operator' && (this.value === '+' || this.value === '-');
    }
}
