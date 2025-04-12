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

    public negate(): Numeric {
        return new Numeric(-this._value);
    }

    public equals(b: Numeric): boolean {
        return this._value === b.value;
    }

    public zero(): Numeric {
        return Zero;
    }
    public unit(): Numeric {
        return One;
    }
}

const Zero = new Numeric(0);
const One = new Numeric(1);
