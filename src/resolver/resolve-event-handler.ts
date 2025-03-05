import { type ParserNode } from '../parser/parser-node';
export type ResolveEvent = 'operate' | 'read_num' | 'execute_paren';

export interface ResolveEventArg {
    /**
     * ノード
     */
    node: ParserNode;
    /**
     * 計算結果
     */
    result: number;
    /**
     * 左の項
     */
    left?: number;
    /**
     * 右の項
     */
    right?: number;
    /**
     * 演算子
     */
    operator?: string;
}

export type ResolveEventHandler = (event: ResolveEvent, arg: ResolveEventArg) => void;
