import {
    ParseTreeNode,
    type StringifyType,
    type ParseNodeInfo,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';
import type { Rule } from '../../common/testable';
import { ParserError } from '../parser-error';

/**
 * 単項ノード(数字ノード)
 */
export class SingleNode extends ParseTreeNode {
    /**
     * 単項ノードを生成する
     * @param tokens - 使われた字句
     */
    public constructor(tokens: Token[]) {
        super('single', tokens);
    }

    //#region overrides
    /**
     * ノードを文字列化する
     * @param _ - 文字列化タイプ(使用しない)
     * @returns 文字列化の結果
     */
    public toString(_: StringifyType): string {
        return this.value.map((token) => token.value).join('');
    }
    /**
     * ノード情報の取得
     * @returns JSON表現ができる情報
     */
    public toNodeInfo(): ParseNodeInfo {
        return {
            type: this.nodeType,
            value: this.toString('thisNode'),
        };
    }
    //#region privates
    rules: Rule<ParseTreeNode>[] = [
        (node): void => {
            const singleNode = node as SingleNode;
            if (
                singleNode.value.length !== 1 &&
                singleNode.value.length !== 2
            ) {
                throw new ParserError('single-node-must-have-1-or-2-tokens', {
                    token: singleNode.value[0],
                });
            }
        },
    ];
    //#endregion
    //#endregion
}
