import { parse, ParserNode } from '../parser';
import { tokenize, type Token } from '../tokenizer';
import { resolveNode } from './node-resolver';
import { type ResolveEventHandler } from './resolve-event-handler';

export function resolve(expression: string, eventHandler?: ResolveEventHandler): number;
export function resolve(tokens: Token[], eventHandler?: ResolveEventHandler): number;
export function resolve(node: ParserNode, eventHandler?: ResolveEventHandler): number;
/**
 * 構文木(文字列、トークン配列、構文木)を解析し、結果を数字で返します
 * @param args 構文木を解析するための引数
 * @param eventHandler resolve中に発生するイベントのハンドラ
 * @return 解析結果
 */
export function resolve(args: string | Token[] | ParserNode, eventHandler?: ResolveEventHandler): number {
    if (typeof args === 'string') {
        return resolveNode(parse(tokenize(args)), eventHandler);
    } else if (Array.isArray(args)) {
        return resolveNode(parse(args), eventHandler);
    } else {
        return resolveNode(args, eventHandler);
    }
}

export function resolveAsync(expression: string, eventHandler?: ResolveEventHandler): Promise<number>;
export function resolveAsync(tokens: Token[], eventHandler?: ResolveEventHandler): Promise<number>;
export function resolveAsync(node: ParserNode, eventHandler?: ResolveEventHandler): Promise<number>;
/**
 * 構文木(文字列、トークン配列、構文木)を非同期に解析し、結果を数字で返します
 * @param args 構文木を解析するための引数
 * @param eventHandler resolve中に発生するイベントのハンドラ
 * @return 解析結果
 */
export function resolveAsync(args: string | Token[] | ParserNode, eventHandler?: ResolveEventHandler): Promise<number> {
    return new Promise<number>((_resolve, _reject) => {
        try {
            if (typeof args === 'string') {
                _resolve(resolve(args, eventHandler));
            } else if (Array.isArray(args)) {
                _resolve(resolve(args, eventHandler));
            } else {
                _resolve(resolve(args, eventHandler));
            }
        } catch (e) {
            _reject(e);
        }
    });
}

export { type ResolveEvent, type ResolveEventArg, type ResolveEventHandler } from './resolve-event-handler';
