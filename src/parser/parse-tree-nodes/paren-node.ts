import {
    ParseTreeNode,
    type StringifyType,
    type ParseNodeInfo,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';
import { type Rule } from '../../common/testable';
import { ParserError } from '../parser-error';

export class ParenNode extends ParseTreeNode {
    private _childrenRoot?: ParseTreeNode;
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

    public toNodeInfo(): ParseNodeInfo {
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
