import {
    ParseTreeNode,
    type StringifyType,
    type IParseTreeNode,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';

export class SingleNode extends ParseTreeNode {
    public constructor(tokens: Token[]) {
        super('single', tokens);
    }
    public toString(_: StringifyType): string {
        return this.value.map((token) => token.value).join('');
    }

    public toNodeInfo(): IParseTreeNode {
        return {
            type: this.nodeType,
            value: this.toString('thisNode'),
        };
    }
}
