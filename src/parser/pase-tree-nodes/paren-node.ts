import {
    ParseTreeNode,
    type StringifyType,
    type IParseTreeNode,
    type ValidationRule,
    type ValidationResult,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';

export class ParenNode extends ParseTreeNode {
    private _childrenRoot?: ParseTreeNode;
    validations: ValidationRule[] = [
        (node: ParseTreeNode): ValidationResult | undefined => {
            const parenNode = node as ParenNode;
            if (parenNode.isClosed) return undefined;
            return {
                node,
                message: '括弧ノードは閉じられていません',
            };
        },
        (node: ParseTreeNode): ValidationResult | undefined => {
            const parenNode = node as ParenNode;
            if (parenNode.childrenRoot) return undefined;
            return {
                node,
                message: '括弧ノードに子ノードがありません',
            };
        },
        (node: ParseTreeNode): ValidationResult | undefined => {
            if (node.value.length === 2 || node.value.length === 3)
                return undefined;
            return {
                node,
                message: '括弧ノードの字句は2つか3つである必要があります',
            };
        },
        (node: ParseTreeNode): ValidationResult | undefined => {
            const parenNode = node as ParenNode;
            parenNode.childrenRoot?.validate();
            return undefined;
        },
    ];

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
        let currentNode: ParseTreeNode | undefined = node?.parent;
        while (currentNode !== undefined) {
            if (currentNode.nodeType === 'paren') {
                return currentNode as ParenNode;
            }
            currentNode = currentNode.parent;
        }
        return undefined;
    }
}
