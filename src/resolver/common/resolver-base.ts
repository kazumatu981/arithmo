import {
    type SingleNode,
    type ParenNode,
    type BinaryNode,
    type ParseTreeNode,
} from '../../parser';

import type { Operator } from '../../common/char-util';

/**
 * 意味解析イベント引数
 * @group Resolver
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
 * @group Resolver
 */
export type ResolveHandler<T> = (eventArg: ResolveEventArg<T>) => void;

/**
 * 意味解析基底クラス
 * @group Resolver
 */
export abstract class ResolverBase<T> {
    protected abstract _operatorResolver: Record<Operator, (a: T, b: T) => T>;
    protected abstract _resolveValue(tokenValue: string): T;
    protected abstract _toNegative(value: T): T;
    protected _currentOrder = 0;

    /**
     * 解決イベントハンドラ
     */
    public onResolved?: ResolveHandler<T>;

    protected _resolveSingleNode(node: SingleNode): T {
        return node.isNegative
            ? this._toNegative(this._resolveValue(node.value))
            : this._resolveValue(node.value);
    }

    protected _resolveParenNode(node: ParenNode): T {
        const childrenResult = this.resolve(node.childrenRoot as ParseTreeNode);
        return node.isNegative
            ? this._toNegative(childrenResult)
            : childrenResult;
    }
    protected _resolveBinaryNode(node: BinaryNode): T {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const operatorAction = this._operatorResolver[node.operator]!;
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
        this._currentOrder = 0;
    }

    /**
     * 意味解析をする
     * @param node - 意味解析対象の構文木
     * @returns 意味解析結果
     */
    public resolve(node: ParseTreeNode): T {
        let result: T;
        switch (node.type) {
            case 'single':
                result = this._resolveSingleNode(node as SingleNode);
                break;
            case 'paren':
                result = this._resolveParenNode(node as ParenNode);
                break;
            case 'binary':
                result = this._resolveBinaryNode(node as BinaryNode);
                break;
        }
        this.onResolved?.({ node, order: this._currentOrder++, result });
        return result;
    }
}
