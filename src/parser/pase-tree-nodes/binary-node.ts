import { type Token } from '../../tokenizer';
import {
    ParseTreeNode,
    type StringifyType,
    type IParseTreeNode,
} from './parse-tree-node';

export class BinaryNode extends ParseTreeNode {
    private _left?: ParseTreeNode;
    private _right?: ParseTreeNode;

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

    public set right(value: ParseTreeNode) {
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
