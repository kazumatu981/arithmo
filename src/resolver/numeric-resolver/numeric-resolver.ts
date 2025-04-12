import { RingResolverBase } from '../common/arithmetic-resolver-base';
import { stringToNum } from '../common/string-to-num';
import { Numeric } from './numeric';

export class NumericResolver extends RingResolverBase<Numeric> {
    protected resolveValue(tokenValue: string): Numeric {
        return new Numeric(stringToNum(tokenValue));
    }
}
