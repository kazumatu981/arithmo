/**
 * 二つの整数の最大公約数を計算する
 * @param a - 整数
 * @param b - 整数
 * @returns 最大公約数
 */
export function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * x が整数かどうかを判定する
 * @param x - 整数かどうかを判定する値
 * @returns x が整数の場合 true
 */
export function isNumeric(x: number): boolean {
    return Number.isInteger(x);
}
