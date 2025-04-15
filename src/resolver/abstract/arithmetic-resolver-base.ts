import type { Ring, Field } from '../algebra/arithmetic-operations';
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
        '/': (_a, _b) => {
            throw new Error('not implemented');
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '^': (_a, _b) => {
            throw new Error('not implemented');
        },
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
> extends RingResolverBase<T> {
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
        '/': (a, b) => a.multiply(b.reciprocate()),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '^': (_a, _b) => {
            throw new Error('not implemented');
        },
    };
    protected _toNegative(value: T): T {
        return value.negate();
    }
}
