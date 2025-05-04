import type { Ring, Field, Multiplicative } from '../../algebra/abstract';
import { ResolverBase } from '../abstract/resolver-base';

/**
 * 環を解決する解決機
 */
export abstract class RingResolverBase<
    T extends Ring<T>,
> extends ResolverBase<T> {
    protected _operatorResolver: Record<
        '+' | '-' | '/' | '*' | '^',
        (a: T, b: T) => T
    > = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '+': (a, b) => a.add(b),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '-': (a, b) => a.add(b.negate()),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '*': (a, b) => a.multiply(b),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/': (a, b) => {
            const result = a.euclideanDivide(b);
            if (!result.remainder.equals(result.quotient.zero)) {
                throw new Error('割り切れません。');
            }
            return result.quotient;
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '^': (a, b) => powOnRing(a, b.toNumber()),
    };
    protected _toNegative(value: T): T {
        return value.negate();
    }
}

/**
 * 体を解決する解決機
 */
export abstract class FieldResolverBase<
    T extends Field<T>,
> extends ResolverBase<T> {
    protected _operatorResolver: Record<
        '+' | '-' | '/' | '*' | '^',
        (a: T, b: T) => T
    > = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '+': (a, b) => a.add(b),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '-': (a, b) => a.add(b.negate()),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '*': (a, b) => a.multiply(b),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/': (a, b) => a.divide(b),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '^': (a, b) => powOnField(a, b.toNumber()),
    };
    protected _toNegative(value: T): T {
        return value.negate();
    }
}

function pow<T extends Multiplicative<T>>(a: T, b: number): T {
    let result = a.unit;
    for (let count = 0; count < b; count++) {
        result = result.multiply(a);
    }
    return result;
}

function powOnRing<T extends Ring<T>>(a: T, b: number): T {
    if (b < 0) {
        throw new Error('not implemented');
    }
    return pow(a, b);
}

function powOnField<T extends Field<T>>(a: T, b: number): T {
    const baseNumber = b < 0 ? a.inverse() : a;
    const exponent = b < 0 ? -b : b;
    return pow(baseNumber, exponent);
}
