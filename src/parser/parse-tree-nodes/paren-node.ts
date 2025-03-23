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
     * @param tokens - 使われた字句
     */
    public constructor(parenStart: Token, signToken?: Token) {
        super('paren', [parenStart], signToken);
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
     */
    public set parenEnd(token: Token) {
        this.tokens.push(token);
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
            if (!parenNode.isClosed) {
                throw new ParserError('paren-node-must-be-closed', {
                    token: parenNode.tokens[parenNode.tokens.length - 1],
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            parenNode.childrenRoot!.test();
        },
    ];
    //#endregion
    //#endregion
}
