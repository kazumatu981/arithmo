import { TokenizerError } from './tokenizer-error';
import {
    isDigit,
    isOperator,
    isParen,
    isWhiteSpace,
    isLeftParen,
} from '../common/char-util';
import { Token } from './token';

/**
 * 入力文字列を字句に分割するクラス
 */
export class Tokenizer {
    private expression: string;
    private currentIndex = 0;
    /**
     * @param expression - 入力文字列
     */
    constructor(expression: string) {
        this.expression = expression;
    }

    /**
     * 入力文字列を字句に分割する
     * @returns 切り出した字句
     */
    public tokenize(): Token[] {
        this.reset();
        const tokens: Token[] = [];
        const tokenIterator = this.tokens();
        for (const token of tokenIterator) {
            tokens.push(token);
        }
        return tokens;
    }

    /**
     * 字句を生成するジェネレータ
     * @returns Token - 切り出された字句
     */
    public *tokens(): Generator<Token> {
        this.reset();
        while (this.currentIndex < this.expression.length) {
            const token = this.readNextToken();
            if (token) {
                yield token;
            }
        }
    }
    /**
     * Tokenizerの状態をリセットする
     */
    public reset(): void {
        this.currentIndex = 0;
    }

    /**
     * 次の字句を読み込み、トークンとして返します。
     * 空白をスキップし、現在の文字が数字、演算子、または括弧の場合に対応するトークンを切り出します。
     * 入力文字列の末尾に達している場合、または空白のみの場合は未定義を返します。
     * 予期しない文字が現れた場合は例外をスローします。
     * @returns 切り出されたトークン、または未定義
     * @throws TokenizerError - 予期しない文字が検出された場合
     */
    public readNextToken(): Token | undefined {
        this._skipSpaces();

        if (this.currentIndex >= this.expression.length) {
            // 空白文字のまま末尾まで行ったらトークンは何もなかったとみなす。
            return undefined;
        } else if (isDigit(this.expression, this.currentIndex)) {
            // 数字を切り出す
            return this._readNumberToken();
        } else if (isOperator(this.expression, this.currentIndex)) {
            // 演算子を切り出す
            return this._readOperatorToken();
        } else if (isParen(this.expression, this.currentIndex)) {
            // 括弧を切り出す
            return this._readParenToken();
        } else {
            // 予期せぬ文字を検出した
            throw new TokenizerError('unknown-character', {
                position: this.currentIndex,
                appendixMessage: `検出した文字: ${this.expression.charAt(
                    this.currentIndex,
                )}`,
            });
        }
    }

    /**
     * 空白文字をスキップする
     */
    private _skipSpaces(): void {
        while (
            this.currentIndex < this.expression.length &&
            isWhiteSpace(this.expression, this.currentIndex)
        ) {
            this.currentIndex++;
        }
    }

    /**
     * 数字文字列としてTokenを切り出す。
     * @returns 切り出した字句
     */
    private _readNumberToken(): Token {
        let value = '';
        const startIndex = this.currentIndex;
        while (
            this.currentIndex < this.expression.length &&
            isDigit(this.expression, this.currentIndex)
        ) {
            value += this.expression.charAt(this.currentIndex);
            this.currentIndex++;
        }
        return new Token('number', value, startIndex);
    }

    /**
     * 演算子文字列としてTokenを切り出す。
     * @returns 切り出した字句
     */
    private _readOperatorToken(): Token {
        const startIndex = this.currentIndex;
        this.currentIndex++;
        return new Token(
            'operator',
            this.expression.charAt(startIndex),
            startIndex,
        );
    }

    /**
     * 括弧文字列としてTokenを切り出す。
     * @returns 切り出した字句
     */
    private _readParenToken(): Token {
        const startIndex = this.currentIndex;
        const parenCharacter = this.expression.charAt(startIndex);
        this.currentIndex++;
        return new Token(
            isLeftParen(this.expression, startIndex)
                ? 'leftParen'
                : 'rightParen',
            parenCharacter,
            startIndex,
        );
    }
}
