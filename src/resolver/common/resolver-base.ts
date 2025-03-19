import {
    type SingleNode,
    type ParenNode,
    type BinaryNode,
    type ParseTreeNode,
} from '../../parser';

import type { Operator } from '../../common/char-util';

/**
 * 意味解析イベント引数
 */
export interface ResolveEventArg<T> {
    /** 構文木ノード */
    node: ParseTreeNode;
    /** 解析順 */
    order: number;
    /** 解決結果 */
    result: T;
}

/**
 * 意味解析イベントハンドラ
 */
export type ResolveHandler<T> = (eventArg: ResolveEventArg<T>) => void;

/**
 * 意味解析基底クラス
 */
export abstract class ResolverBase<T> {
    protected abstract operatorResolver: Record<Operator, (a: T, b: T) => T>;
    protected currentOrder = 0;

    /**
     * 単項ノードを解決する
     * @param node - 解析対象の単項ノード
     * @returns 解決結果
     */
    protected abstract resolveSingleNode(node: SingleNode): T;
    protected abstract resolveParenNode(node: ParenNode): T;

    /**
     * 解決イベントハンドラ
     */
    public onResolved?: ResolveHandler<T>;

    protected resolveBinaryNode(node: BinaryNode): T {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const operatorAction = this.operatorResolver[node.operator]!;
        const result = operatorAction(
            this.resolve(node.left as ParseTreeNode),
            this.resolve(node.right as ParseTreeNode),
        );
        return result;
    }

    /**
     * 状態をリセットする。
     */
    public reset(): void {
        this.currentOrder = 0;
    }

    /**
     * 意味解析をする
     * @param node - 意味解析対象の構文木
     * @returns 意味解析結果
     */
    public resolve(node: ParseTreeNode): T {
        let result: T;
        switch (node.nodeType) {
            case 'single':
                result = this.resolveSingleNode(node as SingleNode);
                break;
            case 'paren':
                result = this.resolveParenNode(node as ParenNode);
                break;
            case 'binary':
                result = this.resolveBinaryNode(node as BinaryNode);
                break;
        }
        this.onResolved?.({ node, order: this.currentOrder++, result });
        return result;
    }
}
