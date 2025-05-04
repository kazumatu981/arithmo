import { type TokenType } from '../tokenizer';
import { RingResolverBase } from './abstract/arithmetic-resolver-base';
import { RationalNumber, RationalCoefficientPolynomial } from '../algebra';
import { stringToNum } from '../common/string-to-num';

/**
 * 分数係数多項式解析クラス
 * @group Resolver
 */
export class RationalCoefficientPolynomialResolver extends RingResolverBase<RationalCoefficientPolynomial> {
    protected _resolveValue(
        tokenType: TokenType,
        tokenValue: string,
    ): RationalCoefficientPolynomial {
        if (tokenType !== 'number' && tokenType !== 'variable') {
            throw new Error(`Invalid token type: ${tokenType}`);
        }
        let resolved: RationalCoefficientPolynomial;
        if (tokenType === 'number') {
            const number = stringToNum(tokenValue);
            resolved = new RationalCoefficientPolynomial([
                new RationalNumber(number, 1),
            ]);
        } else {
            resolved = new RationalCoefficientPolynomial(
                [new RationalNumber(0, 1), new RationalNumber(1, 1)],
                tokenValue,
            );
        }

        return resolved;
    }
}

export { RationalCoefficientPolynomial };
