import {
    type ParseTreeNode,
    type StringifyType,
    type ParseNodeInfo,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';
import { type Rule } from '../../common/testable';
import { ParserError } from '../parser-error';
import { SignedNode } from './signed-node';
/**
 * 括弧ノード
 * @group Parser
 */
export class ParenNode extends SignedNode {
    //#region private fields
    private _childrenRoot?: ParseTreeNode;
    //#endregion

    /**
     * 括弧ノードを作成します。
     * @param parenStartToken - 括弧の始まりトークン
     * @param signToken - 符号ノード
     */
    public constructor(parenStartToken: Token, signToken?: Token) {
        super('paren', [parenStartToken], signToken);
    }

    /**
     * 括弧ノードの子ノードを取得します。
     * @returns 子ノードのルート
     */
    public get childrenRoot(): ParseTreeNode | undefined {
        return this._childrenRoot;
    }
    /**
     * 括弧ノードの子ノードを設定します。
     * @param value - 設定する子ノードのルート
     */
    public set childrenRoot(value: ParseTreeNode) {
        this._childrenRoot = value;
        this._childrenRoot.parent = this;
    }
    /**
     * 括弧ノードが閉じられているかどうか
     * @returns 閉じられているかどうか
     */
    public get isClosed(): boolean {
        return this.tokens[this.tokens.length - 1].type === 'rightParen';
    }
    /**
     * 括弧ノードの終わりを設定します。
     * @param parenEndToken - 括弧ノードの終わり
     */
    public parenEnd(parenEndToken: Token): void {
        this.tokens.push(parenEndToken);
    }

    //#region statics
    /**
     * 括弧ノードを探します。
     * @param node - 対象のノード
     * @returns 括弧ノード
     */
    public static findParenNode(
        node: ParseTreeNode | undefined,
    ): ParenNode | undefined {
        let currentNode: ParseTreeNode | undefined = node?.parent;
        while (currentNode !== undefined) {
            if (currentNode.type === 'paren') {
                return currentNode as ParenNode;
            }
            currentNode = currentNode.parent;
        }
        return undefined;
    }
    //#endregion

    //#region overrides
    /**
     * ノードを文字列化する
     * @param stringifyType - 文字列化タイプ
     * @returns 文字列化の結果
     */
    public toString(stringifyType: StringifyType): string {
        const signature = this.isNegative ? '-' : '';
        if (stringifyType === 'includeChildren') {
            return `${signature}(${this.childrenRoot?.toString(
                'includeChildren',
            )})`;
        }
        return `${signature}${this.tokens
            .map((token) => token.value)
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
            childrenRoot: this.childrenRoot?.toNodeInfo(),
        };
    }
    //#region privates
    protected readonly rules: Rule<ParseTreeNode>[] = [
        (node): void => {
            const parenNode = node as ParenNode;
            if (parenNode.tokens.length !== 2) {
                throw new ParserError('paren-node-must-have-2-token', {
                    token: parenNode.tokens[0],
                });
            }
        },
        (node): void => {
            const parenNode = node as ParenNode;
            if (!parenNode.isClosed) {
                throw new ParserError('paren-node-must-be-closed', {
                    token: parenNode.tokens[parenNode.tokens.length - 1],
                });
            }
        },
        (node): void => {
            const parenNode = node as ParenNode;
            if (parenNode.tokens[0].type !== 'leftParen') {
                throw new ParserError('paren-node-must-start-with-left-paren', {
                    token: parenNode.tokens[0],
                });
            }
        },
        (node): void => {
            const parenNode = node as ParenNode;
            if (parenNode.childrenRoot === undefined) {
                throw new ParserError('paren-node-must-have-children', {
                    token: parenNode.tokens[0],
                });
            }
        },
        (node): void => {
            const parenNode = node as ParenNode;
            parenNode.childrenRoot?.test();
        },
        ...this.signedNodeRules,
    ];
    //#endregion
    //#endregion
}
