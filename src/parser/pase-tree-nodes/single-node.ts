import { PaseTreeNode, type StringifyType } from './parse-tree-node';
import { type Token } from '../../tokenizer';

export class SingleNode extends PaseTreeNode {
    public constructor(tokens: Token[]) {
        super('single', tokens);
    }
    public toString(_: StringifyType): string {
        throw new Error('Method not implemented.');
    }
}
