import { type Token } from '../tokenizer';
import { ParseTreeBuilder } from './parse-tree-builder';
import { type ParseTreeNode } from './parse-tree-nodes';

/**
 * 字句解析の結果から構文を解析して構文木を返却する
 * @param tokens - 字句
 * @returns 解析結果のノードツリーのルート
 */
export function parse(tokens: Token[]): ParseTreeNode | undefined {
    const builder = new ParseTreeBuilder();
    tokens.forEach((token) => builder.addToken(token));
    return builder.build();
}

export * from './parse-tree-nodes';
