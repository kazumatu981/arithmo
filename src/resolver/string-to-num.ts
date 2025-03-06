/**
 * 数字文字列を数値に変換する
 * @param input 入力文字列
 * @returns 変換後の数値
 */
export function stringToNum(input: string): number {
    let result = 0;

    for (let index = 0; index < input.length; index++) {
        result = result * 10 + charToNum(input, index);
    }

    return result;
}

/**
 * 1文字を数値に変換する
 * @param c 対象文字列
 * @param index 対象文字の位置
 * @returns 変換後の数値
 * @throws {Error} 対象文字が 0~9 の範囲外の場合
 */
export function charToNum(c: string, index: number): number {
    // 文字コードが 0~9 の範囲にあるかを確認する
    if (c.charCodeAt(index) < '0'.charCodeAt(0) || c.charCodeAt(index) > '9'.charCodeAt(0)) {
        throw new Error('not a number');
    }

    // 文字コードを 0~9 から 0~9 に変換する
    return c.charCodeAt(index) - '0'.charCodeAt(0);
}
