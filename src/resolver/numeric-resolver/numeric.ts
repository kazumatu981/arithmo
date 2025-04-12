import { type Ring } from '../common/arithmetic-operations';

export class Numeric implements Ring<Numeric> {
    private _value: number = 0;

    constructor(value: number) {
        this._value = value;
    }

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = value;
    }

    public add(value: Numeric): Numeric {
        return new Numeric(this._value + value.value);
    }

    public multiply(b: Numeric): Numeric {
        return new Numeric(this._value * b.value);
    }

    public remainder(b: Numeric): Numeric {
        return new Numeric(this._value % b.value);
    }

    public negate(): Numeric {
        return new Numeric(-this._value);
    }

    public equals(other: Numeric | number): boolean {
        if (typeof other === 'number') {
            return this._value === other;
        } else {
            return this._value === other.value;
        }
    }

    public zero(): Numeric {
        return ZERO;
    }
    public unit(): Numeric {
        return ONE;
    }
}

const ZERO = new Numeric(0);
const ONE = new Numeric(1);
