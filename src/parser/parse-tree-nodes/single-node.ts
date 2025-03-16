import {
    ParseTreeNode,
    type ValidationRule,
    simpleValidationRule,
    type StringifyType,
    type ParseNodeInfo,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';

export class SingleNode extends ParseTreeNode {
    validations: ValidationRule[] = [
        simpleValidationRule(
            (node) => node.value.length === 1 || node.value.length === 2,
            'single-node-must-have-1-or-2-tokens',
        ),
    ];
    public constructor(tokens: Token[]) {
        super('single', tokens);
    }

    public toString(_: StringifyType): string {
        return this.value.map((token) => token.value).join('');
    }
    public toNodeInfo(): ParseNodeInfo {
        return {
            type: this.nodeType,
            value: this.toString('thisNode'),
        };
    }
}
