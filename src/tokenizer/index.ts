import { type Token, type TokenType } from './token';
import { Tokenizer } from './tokenizer';

/**
 * 入力文字列を字句に分割する
 * @param input 入力文字列
 * @returns 切り出した字句
 */
function tokenize(input: string): Token[] {
    return new Tokenizer(input).tokenize();
}

export { type Token, type TokenType, tokenize };
