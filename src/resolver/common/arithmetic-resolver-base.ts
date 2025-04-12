import type { Ring, Field } from './arithmetic-operations';
import { ResolverBase } from './resolver-base';

export abstract class RingResolverBase<
    T extends Ring<T>,
> extends ResolverBase<T> {
    protected operatorResolver: Record<
        '+' | '-' | '/' | '*',
        (a: T, b: T) => T
    > = {
        '+': (a, b) => a.add(b),
        '-': (a, b) => a.add(b.negate()),
        '*': (a, b) => a.multiply(b),
        '/': (_a, _b) => {
            throw new Error('not implemented');
        },
    };
    protected toNegative(value: T): T {
        return value.negate();
    }
}

export abstract class FieldResolverBase<
    T extends Field<T>,
> extends RingResolverBase<T> {
    protected operatorResolver: Record<
        '+' | '-' | '/' | '*',
        (a: T, b: T) => T
    > = {
        '+': (a, b) => a.add(b),
        '-': (a, b) => a.add(b.negate()),
        '*': (a, b) => a.multiply(b),
        '/': (a, b) => a.multiply(b.reciprocate()),
    };
    protected toNegative(value: T): T {
        return value.negate();
    }
}
