import { type Token } from '../tokenizer';
import { ParseTreeBuilder } from './parse-tree-builder';
import { type ParseTreeNode } from './pase-tree-nodes';

export * from './pase-tree-nodes';
export function parse(tokens: Token[]): ParseTreeNode | undefined {
    const builder = new ParseTreeBuilder();
    tokens.forEach((token) => builder.addToken(token));
    return builder.build();
}
