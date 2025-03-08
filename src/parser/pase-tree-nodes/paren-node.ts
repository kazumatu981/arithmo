import {
    ParseTreeNode,
    type StringifyType,
    type IParseTreeNode,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';

export class ParenNode extends ParseTreeNode {
    private _childrenRoot?: ParseTreeNode;

    public constructor(tokens: Token[]) {
        super('paren', tokens);
    }

    public set parenEnd(token: Token) {
        this.value.push(token);
    }

    public get childrenRoot(): ParseTreeNode | undefined {
        return this._childrenRoot;
    }

    public get isClosed(): boolean {
        return this.value[this.value.length - 1].isRightParen;
    }
    public set childrenRoot(value: ParseTreeNode) {
        this._childrenRoot = value;
        this._childrenRoot.parent = this;
    }
    public toString(_: StringifyType): string {
        return this.value.map((token) => token.value).join('');
    }

    public toNodeInfo(): IParseTreeNode {
        return {
            type: this.nodeType,
            value: this.toString('thisNode'),
            childrenRoot: this.childrenRoot?.toNodeInfo(),
        };
    }

    public static findParenNode(
        node: ParseTreeNode | undefined,
    ): ParenNode | undefined {
        let currentNode: ParseTreeNode | undefined = node;
        while (currentNode !== undefined) {
            if (currentNode.nodeType === 'paren') {
                return currentNode as ParenNode;
            }
            currentNode = currentNode.parent;
        }
        return undefined;
    }
}
