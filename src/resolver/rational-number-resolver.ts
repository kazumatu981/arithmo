import { FieldResolverBase } from './abstract/arithmetic-resolver-base';
import { stringToNum } from '../common/string-to-num';
import { RationalNumber } from './algebra/rational-number';
import { type TokenType } from '../tokenizer';

/**
 * 分数解析クラス
 * @group Resolver
 */
export class RationalNumberResolver extends FieldResolverBase<RationalNumber> {
    protected _resolveValue(
        tokenType: TokenType,
        tokenValue: string,
    ): RationalNumber {
        if (tokenType !== 'number') {
            throw new Error(`Invalid token type: ${tokenType}`);
        }
        const number = stringToNum(tokenValue);
        return new RationalNumber(number, 1);
    }
}

export { RationalNumber };
