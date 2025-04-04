import { ResolverBase } from '../common/resolver-base';
import { stringToNum } from '../common/string-to-num';
import { RationalNumber } from './rational-number';

export class RationalNumberResolver extends ResolverBase<RationalNumber> {
    protected operatorResolver = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '+': (a: RationalNumber, b: RationalNumber): RationalNumber => a.add(b),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '-': (a: RationalNumber, b: RationalNumber): RationalNumber =>
            a.subtract(b),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '*': (a: RationalNumber, b: RationalNumber): RationalNumber =>
            a.multiply(b),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/': (a: RationalNumber, b: RationalNumber): RationalNumber =>
            a.divide(b),
    };
    protected resolveValue(tokenValue: string): RationalNumber {
        const number = stringToNum(tokenValue);
        return new RationalNumber(number, 1);
    }
    protected toNegative(value: RationalNumber): RationalNumber {
        value.isNegative = true;
        return value;
    }
}
