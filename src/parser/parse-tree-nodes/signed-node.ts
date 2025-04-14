import { ParseTreeNode } from './parse-tree-node';
import { type NodeType } from './parse-node-info';

import { type Token } from '../../tokenizer';
import { type Rule } from '../../common/testable';
import { ParserError } from '../parser-error';

/**
 * 符号付きノード
 */
export abstract class SignedNode extends ParseTreeNode {
    /**
     * 符号の字句
     */
    public readonly signToken?: Token;

    /**
     * 符号付きのノードを作成する
     * @param type - ノードの型
     * @param tokens - ノードを構成するトークン(ただし符号は含まない)
     * @param signToken 符号ノード
     */
    public constructor(type: NodeType, tokens: Token[], signToken?: Token) {
        super(type, tokens);
        this.signToken = signToken;
    }

    /**
     * 値がマイナスかどうかを返却します。
     * @returns マイナス記号かどうか
     */
    public get isNegative(): boolean {
        return this.signToken?.isNegativeSign ?? false;
    }

    protected _signedNodeRules: Rule<ParseTreeNode>[] = [
        (node): void => {
            const signedNode = node as SignedNode;
            if (signedNode.signToken) {
                const signToken = signedNode.signToken;
                if (signToken.type !== 'operator' || signToken.value !== '-') {
                    throw new ParserError('sign-must-be-negative', {
                        token: signToken,
                    });
                }
            }
        },
    ];
}
