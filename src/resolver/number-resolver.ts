import { stringToNum } from '../common/string-to-num';
import { type TokenType } from '../tokenizer';
import { ResolverBase } from './abstract/resolver-base';

/**
 * 数値解析クラス
 * @group Resolver
 */
export class NumberResolver extends ResolverBase<number> {
    protected _operatorResolver = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '+': (a: number, b: number): number => a + b,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '-': (a: number, b: number): number => a - b,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '*': (a: number, b: number): number => a * b,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/': (a: number, b: number): number => a / b,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '^': (a: number, b: number): number => Math.pow(a, b),
    };

    protected _resolveValue(tokenType: TokenType, tokenValue: string): number {
        if (tokenType !== 'number') {
            throw new Error(`Invalid token type: ${tokenType}`);
        }
        return stringToNum(tokenValue);
    }

    protected _toNegative(value: number): number {
        return -value;
    }
}
