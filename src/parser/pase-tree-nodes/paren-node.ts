import { PaseTreeNode, type StringifyType } from './parse-tree-node';
import { type Token } from '../../tokenizer';

export class ParenNode extends PaseTreeNode {
    private _childRoot?: PaseTreeNode;

    public constructor(tokens: Token[]) {
        super('paren', tokens);
    }

    public set parenEnd(token: Token) {
        this.value.push(token);
    }

    public get childRoot(): PaseTreeNode | undefined {
        return this._childRoot;
    }

    public set childRoot(value: PaseTreeNode) {
        this._childRoot = value;
        this._childRoot.parent = this;
    }
    public toString(_: StringifyType): string {
        throw new Error('Method not implemented.');
    }
}
