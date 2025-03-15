import { type Token } from '../tokenizer';
import { ParseTreeBuilder } from './parse-tree-builder';
import { type ParseTreeNode } from './parse-tree-nodes';

export * from './parse-tree-nodes';
export function parse(tokens: Token[]): ParseTreeNode | undefined {
    const builder = new ParseTreeBuilder();
    tokens.forEach((token) => builder.addToken(token));
    return builder.build();
}
