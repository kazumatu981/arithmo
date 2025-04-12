import { FieldResolverBase } from '../common/arithmetic-resolver-base';
import { stringToNum } from '../common/string-to-num';
import { RationalNumber } from '../algebra/rational-number';

export class RationalNumberResolver extends FieldResolverBase<RationalNumber> {
    protected resolveValue(tokenValue: string): RationalNumber {
        const number = stringToNum(tokenValue);
        return new RationalNumber(number, 1);
    }
}
