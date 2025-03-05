export class CharUtil {
    /**
     * 数字どうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字の位置
     * @returns 数字かどうかを表す真偽値
     */
    public static isDigit(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c >= '0' && c <= '9';
    }

    /**
     * 演算子かどうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字の位置
     * @returns 演算子かどうかを表す真偽値
     */
    public static isOperator(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c === '+' || c === '-' || c === '*' || c === '/';
    }

    /**
     * 空白文字かどうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字の位置
     * @returns 空白文字かどうかを表す真偽値
     */
    public static isWhiteSpace(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c === ' ';
    }

    /**
     * 左括弧か右括弧かどうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字の位置
     * @returns 左括弧か右括弧かどうかを表す真偽値
     */
    public static isParen(s: string, pos: number): boolean {
        return CharUtil.isLeftParen(s, pos) || CharUtil.isRightParen(s, pos);
    }

    /**
     * 左括弧かどうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字の位置
     * @returns 左括弧かどうかを表す真偽値
     */
    public static isLeftParen(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c === '(';
    }

    /**
     * 右括弧かどうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字列の位置
     * @returns 右括弧かどうかを表す真偽値
     */
    public static isRightParen(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c === ')';
    }
}
