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

    protected resolveValue(tokenValue: string): number {
        return stringToNum(tokenValue);
    }

    protected toNegative(value: number): number {
        return -value;
    }
}
