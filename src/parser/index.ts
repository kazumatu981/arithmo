import { Parser } from './parser';
import { ParserNode, SingleNode, BinaryNode, ParenNode, type NodeType } from './parser-node';
import { tokenize, type Token } from '../tokenizer';

export { ParserNode, SingleNode, BinaryNode, ParenNode, NodeType };

export async function parseAsync(tokens: Token[]): Promise<ParserNode>;
export async function parseAsync(expression: string): Promise<ParserNode>;
/**
 * 数式文字列または字句から、構文木を作成する（非同期インタフェース）
 * @param args 数式文字列あるいは字句配列
 * @returns 構文木
 */
export async function parseAsync(args: string | Token[]): Promise<ParserNode> {
    if (typeof args === 'string') {
        return new Promise<ParserNode>((resolve, reject) => {
            try {
                resolve(parse(tokenize(args)));
            } catch (e) {
                reject(e);
            }
        });
    } else {
        const token = args as Token[];
        return new Promise<ParserNode>((resolve, reject) => {
            try {
                resolve(parse(token));
            } catch (e) {
                reject(e);
            }
        });
    }
}

export function parse(tokens: Token[]): ParserNode;
export function parse(expression: string): ParserNode;
/**
 * 数式文字列または字句から、構文木を作成する
 * @param args 数式文字列あるいは字句配列
 * @returns 構文木
 */
export function parse(args: string | Token[]): ParserNode {
    if (typeof args === 'string') {
        return new Parser(tokenize(args)).parse();
    } else {
        const token = args as Token[];
        return new Parser(token).parse();
    }
}
