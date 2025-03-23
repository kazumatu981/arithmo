import type { ParenNode, ParseTreeNode, SingleNode } from '../../parser';
import { stringToNum } from '../common/string-to-num';
import { ResolverBase } from '../common/resolver-base';

/**
 * 数値解析クラス
 * @group Resolver
 */
export class NumberResolver extends ResolverBase<number> {
    protected operatorResolver = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '+': (a: number, b: number): number => a + b,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '-': (a: number, b: number): number => a - b,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '*': (a: number, b: number): number => a * b,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/': (a: number, b: number): number => a / b,
    };

    protected resolveSingleNode(node: SingleNode): number {
        const numberValue = stringToNum(node.tokens[0].value);
        return node.isNegative ? -numberValue : numberValue;
    }

    protected resolveParenNode(node: ParenNode): number {
        const childrenRoot = node.childrenRoot as ParseTreeNode;
        const numberValue = this.resolve(childrenRoot);
        return node.isNegative ? -numberValue : numberValue;
    }
}
