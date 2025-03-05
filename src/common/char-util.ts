/**
 * 数字どうかを判定する
 * @param s 対象文字列
 * @param pos 対象文字の位置
 * @returns 数字かどうかを表す真偽値
 */
export function isDigit(s: string, pos: number): boolean {
    const c = s.charAt(pos);
    return c >= '0' && c <= '9';
}

/**
 * 演算子かどうかを判定する
 * @param s 対象文字列
 * @param pos 対象文字の位置
 * @returns 演算子かどうかを表す真偽値
 */
export function isOperator(s: string, pos: number): boolean {
    const c = s.charAt(pos);
    return c === '+' || c === '-' || c === '*' || c === '/';
}

/**
 * 空白文字かどうかを判定する
 * @param s 対象文字列
 * @param pos 対象文字の位置
 * @returns 空白文字かどうかを表す真偽値
 */
export function isWhiteSpace(s: string, pos: number): boolean {
    const c = s.charAt(pos);
    return c === ' ';
}

/**
 * 左括弧か右括弧かどうかを判定する
 * @param s 対象文字列
 * @param pos 対象文字の位置
 * @returns 左括弧か右括弧かどうかを表す真偽値
 */
export function isParen(s: string, pos: number): boolean {
    return isLeftParen(s, pos) || isRightParen(s, pos);
}

/**
 * 左括弧かどうかを判定する
 * @param s 対象文字列
 * @param pos 対象文字の位置
 * @returns 左括弧かどうかを表す真偽値
 */
export function isLeftParen(s: string, pos: number): boolean {
    const c = s.charAt(pos);
    return c === '(';
}

/**
 * 右括弧かどうかを判定する
 * @param s 対象文字列
 * @param pos 対象文字列の位置
 * @returns 右括弧かどうかを表す真偽値
 */
export function isRightParen(s: string, pos: number): boolean {
    const c = s.charAt(pos);
    return c === ')';
}
