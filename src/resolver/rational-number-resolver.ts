import { FieldResolverBase } from './abstract/arithmetic-resolver-base';
import { stringToNum } from '../common/string-to-num';
import { RationalNumber } from './algebra/rational-number';

/**
 * 分数解析クラス
 * @group Resolver
 */
export class RationalNumberResolver extends FieldResolverBase<RationalNumber> {
    protected _resolveValue(tokenValue: string): RationalNumber {
        const number = stringToNum(tokenValue);
        return new RationalNumber(number, 1);
    }
}

export { RationalNumber };
