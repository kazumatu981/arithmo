import { type Token } from '../../tokenizer';
import {
    PaseTreeNode,
    type StringifyType,
    type IParseTreeNode,
} from './parse-tree-node';

export class BinaryNode extends PaseTreeNode {
    private _left?: PaseTreeNode;
    private _right?: PaseTreeNode;

    public constructor(tokens: Token[]) {
        super('binary', tokens);
    }

    public get left(): PaseTreeNode | undefined {
        return this._left;
    }

    public set left(value: PaseTreeNode) {
        this._left = value;
        this._left.parent = this;
    }

    public get right(): PaseTreeNode | undefined {
        return this._right;
    }

    public set right(value: PaseTreeNode) {
        this._right = value;
        this._right.parent = this;
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
