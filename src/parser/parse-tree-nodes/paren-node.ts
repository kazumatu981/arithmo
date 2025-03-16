import {
    ParseTreeNode,
    type StringifyType,
    type ParseNodeInfo,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';
import { type Rule } from '../../common/testable';
import { ParserError } from '../parser-error';

/**
 * 括弧ノード
 */
export class ParenNode extends ParseTreeNode {
    //#region private fields
    private _childrenRoot?: ParseTreeNode;
    //#endregion

    /**
     * 括弧ノードを作成します。
     * @param tokens - 使われた字句
     */
    public constructor(tokens: Token[]) {
        super('paren', tokens);
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
        return this.value[this.value.length - 1].isRightParen;
    }
    /**
     * 括弧ノードの終わりを設定します。
     */
    public set parenEnd(token: Token) {
        this.value.push(token);
    }
    /**
     * 括弧ノードがマイナス記号を持っているかどうか
     * @returns マイナス記号を持っているかどうか
     */
    public get isNegative(): boolean {
        return this.value[0].isNegativeSign;
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
            if (currentNode.nodeType === 'paren') {
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
        if (stringifyType === 'includeChildren') {
            return `${this.isNegative ? '-' : ''}(${this.childrenRoot?.toString(
                'includeChildren',
            )})`;
        }
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
            childrenRoot: this.childrenRoot?.toNodeInfo(),
        };
    }
    //#region privates
    rules: Rule<ParseTreeNode>[] = [
        (node): void => {
            const parenNode = node as ParenNode;
            if (parenNode.value.length !== 2 && parenNode.value.length !== 3) {
                throw new ParserError('paren-node-must-have-2-or-3-tokens', {
                    token: parenNode.value[0],
                });
            }
        },
        (node): void => {
            const parenNode = node as ParenNode;
            if (!parenNode.isClosed) {
                throw new ParserError('paren-node-must-be-closed', {
                    token: parenNode.value[parenNode.value.length - 1],
                });
            }
        },
        (node): void => {
            const parenNode = node as ParenNode;
            if (parenNode.childrenRoot === undefined) {
                throw new ParserError('paren-node-must-have-children', {
                    token: parenNode.value[0],
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
