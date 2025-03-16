import { type Token } from '../../tokenizer';
import {
    ParseTreeNode,
    type StringifyType,
    type ParseNodeInfo,
} from './parse-tree-node';
import type { Rule } from '../../common/testable';
import { type ParenNode } from './paren-node';
import { ParserError } from '../parser-error';
import { UnexpectedError } from '../../common/unexpected-error';

/** 演算子ノード */
export class BinaryNode extends ParseTreeNode {
    private _left?: ParseTreeNode;
    private _right?: ParseTreeNode;

    /**
     * コンストラクタ
     * @param tokens - 構文解析木のノードに対応するトークン配列
     */
    public constructor(tokens: Token[]) {
        super('binary', tokens);
    }

    /**
     * 左子ノードを取得する
     * @returns 左子ノード
     */
    public get left(): ParseTreeNode | undefined {
        return this._left;
    }

    /**
     * 左子ノードを設定する
     * @param value - 設定する左子ノード
     */
    public set left(value: ParseTreeNode) {
        this._left = value;
        this._left.parent = this;
    }

    /**
     * 右子ノードを取得する
     * @returns 右子ノード
     */
    public get right(): ParseTreeNode | undefined {
        return this._right;
    }

    /**
     * 右子ノードを設定する
     * @param value - 設定する右子ノード
     */
    public set right(value: ParseTreeNode) {
        this._right = value;
        this._right.parent = this;
    }

    /**
     * 演算子トークンを取得する
     * @returns 演算子トークン
     */
    public get operatorToken(): Token {
        return this.value[0];
    }

    /**
     * 構文木に子ノードを接続する
     * @param currentNode - 接続する子ノードの親ノード
     * @returns このノード
     */
    public attachTo(currentNode: ParseTreeNode | undefined): this {
        while (currentNode) {
            let connected = false;
            switch (currentNode.parent?.nodeType ?? 'root') {
                case 'root':
                    connected = this._rootConnectHandler(currentNode);
                    break;
                case 'binary':
                    connected = this._binaryConnectHandler(currentNode);
                    break;
                case 'paren':
                    connected = this._parenConnectHandler(currentNode);
                    break;
                case 'single':
                    throw new UnexpectedError('parser', {
                        appendixMessage:
                            '数字ノードは子ノードを持てないノードである',
                    });
            }
            if (connected) break;
            currentNode = currentNode.parent;
        }
        return this;
    }

    //#region private methods
    private _rootConnectHandler(
        currentNode: ParseTreeNode | undefined,
    ): boolean {
        this.left = currentNode as ParseTreeNode;
        return true;
    }
    private _binaryConnectHandler(
        currentNode: ParseTreeNode | undefined,
    ): boolean {
        const binaryNode = currentNode?.parent as BinaryNode;
        if (
            this.operatorToken.isPrimaryOperator &&
            binaryNode?.operatorToken.isSecondaryOperator
        ) {
            this.left = binaryNode.right as ParseTreeNode;
            binaryNode.right = this;
            return true;
        }
        return false;
    }
    private _parenConnectHandler(
        currentNode: ParseTreeNode | undefined,
    ): boolean {
        const parenNode = currentNode?.parent as ParenNode;
        this.left = parenNode.childrenRoot as ParseTreeNode;
        parenNode.childrenRoot = this;
        return true;
    }
    // #endregion

    //#region overrides
    /**
     * ノードを文字列化する
     * @param stringifyType -文字列化タイプ
     * @returns 文字列化の結果
     */
    public toString(stringifyType: StringifyType): string {
        if (stringifyType === 'includeChildren') {
            return `${this.left?.toString('includeChildren')} ${
                this.operatorToken.value
            } ${this.right?.toString('includeChildren')}`;
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
            left: this.left?.toNodeInfo(),
            right: this.right?.toNodeInfo(),
        };
    }
    //#region privates
    rules: Rule<ParseTreeNode>[] = [
        (node): void => {
            const binaryNode = node as BinaryNode;
            if (binaryNode.value.length !== 1) {
                throw new ParserError('binary-node-must-have-1-token', {
                    token: binaryNode.value[0],
                });
            }
        },
        (node): void => {
            const binaryNode = node as BinaryNode;
            if (binaryNode.left === undefined) {
                throw new ParserError('binary-node-must-have-left', {
                    token: binaryNode.value[0],
                });
            }
        },
        (node): void => {
            const binaryNode = node as BinaryNode;
            if (binaryNode.right === undefined) {
                throw new ParserError('binary-node-must-have-right', {
                    token: binaryNode.value[0],
                });
            }
        },
        (node): void => {
            const binaryNode = node as BinaryNode;
            binaryNode.left?.test();
            binaryNode.right?.test();
            return undefined;
        },
    ];
    //#endregion
    //#endregion
}
