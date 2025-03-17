import {
    type SingleNode,
    type ParenNode,
    type BinaryNode,
    type ParseTreeNode,
} from '../parser';

import type { Operator } from '../common/char-util';

export abstract class ResolverBase<T> {
    abstract operatorResolver: Record<Operator, (a: T, b: T) => T>;
    protected abstract _resolveSingleNode(node: SingleNode): T;
    protected abstract _resolveParenNode(node: ParenNode): T;

    private _resolveBinaryNode(node: BinaryNode): T {
        const operatorAction = this.operatorResolver[node.operator];
        if (operatorAction === undefined) {
            throw new Error('operator not found');
        }
        return operatorAction(
            this.resolve(node.left as ParseTreeNode),
            this.resolve(node.right as ParseTreeNode),
        );
    }
    /**
     * 意味解析をする
     * @param node - 意味解析対象の構文木
     * @returns 意味解析結果
     */
    public resolve(node: ParseTreeNode): T {
        switch (node.nodeType) {
            case 'single':
                return this._resolveSingleNode(node as SingleNode);
            case 'paren':
                return this._resolveParenNode(node as ParenNode);
            case 'binary':
                return this._resolveBinaryNode(node as BinaryNode);
        }
    }
}
