import {
    ParseTreeNode,
    type ValidationRule,
    type ValidationResult,
    type StringifyType,
    type IParseTreeNode,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';

export class SingleNode extends ParseTreeNode {
    validations: ValidationRule[] = [
        (node): ValidationResult | undefined => {
            if (node.value.length === 1 || node.value.length === 2) {
                return undefined;
            } else {
                return {
                    node,
                    message: '数値ノードは1または2個の字句を持つ必要があります',
                };
            }
        },
    ];
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
