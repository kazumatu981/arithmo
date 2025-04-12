import type { Ring, Field } from '../common/arithmetic-operations';

export abstract class RationalBase<TThis, TBase extends Ring<TBase>>
    implements Field<TThis>
{
    abstract readonly _constructable: {
        new (numerator: TBase, denominator: TBase): TThis;
    };
    public abstract denominator: TBase;
    public abstract numerator: TBase;
    public abstract isNegative: boolean;

    public add(_b: TThis): TThis {
        throw new Error('not implemented');
    }
    public multiply(_b: TThis): TThis {
        throw new Error('not implemented');
    }
    public negate(): TThis {
        throw new Error('not implemented');
    }
    public reciprocate(): TThis {
        throw new Error('not implemented');
    }
    public zero(): TThis {
        return new this._constructable(
            this.numerator.zero(),
            this.denominator.unit(),
        );
    }
    public unit(): TThis {
        return new this._constructable(
            this.numerator.unit(),
            this.denominator.unit(),
        );
    }
    public equals(_b: TThis): boolean {
        throw new Error('not implemented');
    }
}
