import { type Token } from '../../tokenizer';
import {
    ParseTreeNode,
    type ValidationResult,
    type StringifyType,
    type IParseTreeNode,
    type ValidationRule,
} from './parse-tree-node';
import { type ParenNode } from './paren-node';

export class BinaryNode extends ParseTreeNode {
    private _left?: ParseTreeNode;
    private _right?: ParseTreeNode;

    validations: ValidationRule[] = [
        (node: ParseTreeNode): ValidationResult | undefined => {
            if (node.value.length === 1) return undefined;
            return {
                node,
                message: '二項演算子ノードの字句は1つである必要があります',
            };
        },
        (node: ParseTreeNode): ValidationResult | undefined => {
            const binaryNode = node as BinaryNode;
            if (binaryNode.left) return undefined;
            return {
                node,
                message: '二項演算子ノードに左の子ノードがありません',
            };
        },
        (node: ParseTreeNode): ValidationResult | undefined => {
            const binaryNode = node as BinaryNode;
            if (binaryNode.right) return undefined;
            return {
                node,
                message: '二項演算子ノードに右の子ノードがありません',
            };
        },
        (node: ParseTreeNode): ValidationResult | undefined => {
            const binaryNode = node as BinaryNode;
            binaryNode.left?.validate();
            binaryNode.right?.validate();
            return undefined;
        },
    ];
    public constructor(tokens: Token[]) {
        super('binary', tokens);
    }

    public get left(): ParseTreeNode | undefined {
        return this._left;
    }

    public set left(value: ParseTreeNode) {
        this._left = value;
        this._left.parent = this;
    }

    public get right(): ParseTreeNode | undefined {
        return this._right;
    }

    public get operatorToken(): Token {
        return this.value[0];
    }

    public set right(value: ParseTreeNode) {
        this._right = value;
        this._right.parent = this;
    }

    public attachTo(currentNode: ParseTreeNode | undefined): this {
        while (currentNode) {
            let connected = false;
            switch (currentNode.parent?.nodeType ?? 'root') {
                case 'root':
                    connected = this.rootConnectHandler(currentNode);
                    break;
                case 'binary':
                    connected = this.binaryConnectHandler(currentNode);
                    break;
                case 'paren':
                    connected = this.parenConnectHandler(currentNode);
                    break;
                case 'single':
                    throw new Error(
                        'single node cannot connect to binary node',
                    );
            }
            if (connected) break;
            currentNode = currentNode.parent;
        }
        return this;
    }

    private rootConnectHandler(
        currentNode: ParseTreeNode | undefined,
    ): boolean {
        this.left = currentNode as ParseTreeNode;
        return true;
    }
    private binaryConnectHandler(
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
    private parenConnectHandler(
        currentNode: ParseTreeNode | undefined,
    ): boolean {
        const parenNode = currentNode?.parent as ParenNode;
        this.left = parenNode.childrenRoot as ParseTreeNode;
        parenNode.childrenRoot = this;
        return true;
    }
    public toString(_: StringifyType): string {
        return this.value.map((token) => token.value).join('');
    }

    public toNodeInfo(): IParseTreeNode {
        return {
            type: this.nodeType,
            value: this.toString('thisNode'),
            left: this.left?.toNodeInfo(),
            right: this.right?.toNodeInfo(),
        };
    }
}
