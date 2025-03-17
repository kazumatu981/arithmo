import { ParenNode, ParseTreeNode, SingleNode } from '../../parser';
import { stringToNum } from './string-to-num';
import { ResolverBase } from '../resolver-base';

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
        const numberToken =
            node.value.length === 1 ? node.value[0] : node.value[1];
        const numberValue = stringToNum(numberToken.value);
        return node.value.length === 2 ? -numberValue : numberValue;
    }

    protected resolveParenNode(node: ParenNode): number {
        const childrenRoot = node.childrenRoot as ParseTreeNode;
        const numberValue = this.resolve(childrenRoot);
        return node.isNegative ? -numberValue : numberValue;
    }
}
