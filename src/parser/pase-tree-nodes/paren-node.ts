import {
    PaseTreeNode,
    type StringifyType,
    type IParseTreeNode,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';

export class ParenNode extends PaseTreeNode {
    private _childrenRoot?: PaseTreeNode;

    public constructor(tokens: Token[]) {
        super('paren', tokens);
    }

    public set parenEnd(token: Token) {
        this.value.push(token);
    }

    public get childrenRoot(): PaseTreeNode | undefined {
        return this._childrenRoot;
    }

    public set childrenRoot(value: PaseTreeNode) {
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
}
