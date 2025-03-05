import { ParserNode, type StringifyType } from './parser-node';
import { Token } from '../../tokenizer';

/**
 * 単項ノード
 */
export class SingleNode extends ParserNode {
    /**
     * 単項が負の符号であるかどうか
     * @returns 単項が負の符号であるかどうかを表す真偽値
     * @description
     *  単項が負の符号であるかどうかを判定する
     *  単項が負の符号である場合、true を返す
     *  単項が負の符号でない場合、false を返す
     */
    public get isNegative(): boolean {
        return this.tokens[0].isNegativeSign;
    }
    /**
     * 単項の値
     * @returns 単項の値
     * @description
     *  単項の値を取得する
     *  単項が負の符号である場合、負の符号を除いた値を取得する
     */
    public get value(): string {
        return this.tokens.length === 1 ? this.tokens[0].value : this.tokens[1].value;
    }

    /**
     * @param tokens このノードに属するトークン
     */
    constructor(tokens: Token[]) {
        super('single', tokens);
    }

    /**
     * 単項の文字列表現を取得する
     * @returns 単項の文字列表現
     * @description
     *  単項の値を文字列に変換して返す
     *  負の符号である場合、`-` を付与する
     */
    public toString(_?: StringifyType): string {
        if (this.isNegative) {
            return `-${this.value}`;
        } else {
            return this.value;
        }
    }
}
