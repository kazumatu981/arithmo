import {
    type ParseTreeNode,
    type StringifyType,
    type ParseNodeInfo,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';
import type { Rule } from '../../common/testable';
import { ParserError } from '../parser-error';
import { SignedNode } from './signed-node';
/**
 * 単項ノード(数字ノード)
 * @group Parser
 */
export class SingleNode extends SignedNode {
    /**
     * 単項ノードを生成する
     * @param tokens - 使われた字句
     */
    public constructor(token: Token, signToken?: Token) {
        super('single', [token], signToken);
    }

    //#region overrides
    /**
     * ノードを文字列化する
     * @param _ - 文字列化タイプ(使用しない)
     * @returns 文字列化の結果
     */
    public toString(_: StringifyType): string {
        const signature = this.isNegative ? '-' : '';
        return `${signature}${this.tokens
            .map((token) => token.toString())
            .join('')}`;
    }
    /**
     * ノード情報の取得
     * @returns JSON表現ができる情報
     */
    public toNodeInfo(): ParseNodeInfo {
        return {
            type: this.type,
            value: this.toString('thisNode'),
        };
    }
    //#region privates
    protected readonly rules: Rule<ParseTreeNode>[] = [
        (node): void => {
            const singleNode = node as SingleNode;
            if (singleNode.tokens.length !== 1) {
                throw new ParserError('single-node-must-have-single-token', {
                    token: singleNode.tokens[0],
                });
            }
        },
    ];
    //#endregion
    //#endregion
}
