import {
    ParseTreeNode,
    type StringifyType,
    type ParseNodeInfo,
} from './parse-tree-node';
import { type Token } from '../../tokenizer';
import type { Rule } from '../../common/testable';
import { ParserError } from '../parser-error';

export class SingleNode extends ParseTreeNode {
    rules: Rule<ParseTreeNode>[] = [
        (node): void => {
            const singleNode = node as SingleNode;
            if (
                singleNode.value.length !== 1 &&
                singleNode.value.length !== 2
            ) {
                throw new ParserError('single-node-must-have-1-or-2-tokens', {
                    token: singleNode.value[0],
                });
            }
        },
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
