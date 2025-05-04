import { RingResolverBase } from './abstract/arithmetic-resolver-base';
import { stringToNum } from '../common/string-to-num';
import { Numeric } from '../algebra';
import { type TokenType } from '../tokenizer';

/**
 * 数値解析クラス
 * @group Resolver
 */
export class NumericResolver extends RingResolverBase<Numeric> {
    protected _resolveValue(tokenType: TokenType, tokenValue: string): Numeric {
        if (tokenType !== 'number') {
            throw new Error(`Invalid token type: ${tokenType}`);
        }
        return new Numeric(stringToNum(tokenValue));
    }
}

export { Numeric };
