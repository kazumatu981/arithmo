import {
    ParseTreeNode,
    type StringifyType,
    type IParseTreeNode,
    type ValidationRule,
    type ValidationError,
    simpleValidationRule,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';

export class ParenNode extends ParseTreeNode {
    private _childrenRoot?: ParseTreeNode;
    validations: ValidationRule[] = [
        simpleValidationRule(
            (node) => node.value.length === 2 || node.value.length === 3,
            'paren-node-must-have-2-or-3-tokens',
        ),
        simpleValidationRule(
            (node) => (node as ParenNode).isClosed,
            'paren-node-must-be-closed',
        ),
        simpleValidationRule(
            (node) => (node as ParenNode).childrenRoot !== undefined,
            'paren-node-must-have-children',
        ),
        (node: ParseTreeNode): ValidationError | undefined => {
            const parenNode = node as ParenNode;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            parenNode.childrenRoot!.validate();
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
