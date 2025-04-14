import { RingResolverBase } from '../common/arithmetic-resolver-base';
import { stringToNum } from '../common/string-to-num';
import { Numeric } from '../algebra/numeric';

/**
 * 数値解析クラス
 * @group Resolver
 */
export class NumericResolver extends RingResolverBase<Numeric> {
    protected _resolveValue(tokenValue: string): Numeric {
        return new Numeric(stringToNum(tokenValue));
    }
}
