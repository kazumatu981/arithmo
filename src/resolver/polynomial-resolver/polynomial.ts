// TODO 多項式を実装する

import { type ArithmeticOperations } from '../common/arithmetic-operations';

export abstract class Polynomial<T extends ArithmeticOperations<T>>
    implements ArithmeticOperations<Polynomial<T>>
{
    abstract readonly _constructable: {
        new (coefficients: T[]): Polynomial<T>;
    };
    private _coefficients: T[];

    constructor(coefficients: T[]) {
        this._coefficients = coefficients;
    }

    public safeCoefficient(index: number): T {
        if (index < this._coefficients.length) {
            return this._coefficients[index];
        } else {
            return this._coefficients[0].zero();
        }
    }
    public elevate(order: number): Polynomial<T> {
        const zeros = new Array(order).fill(this._coefficients[0].zero());
        return new this._constructable([...zeros, ...this._coefficients]);
    }
    public scalarMultiply(scalar: T): Polynomial<T> {
        const neCoefficients = this._coefficients.map((c) =>
            c.multiply(scalar),
        );
        return new this._constructable(neCoefficients);
    }
    public add(b: Polynomial<T>): Polynomial<T> {
        const newLength = Math.max(
            this._coefficients.length,
            b._coefficients.length,
        );
        const newCoefficients = new Array(newLength).fill(
            this._coefficients[0].zero(),
        );
        for (let index = 0; index < newLength; index++) {
            newCoefficients[index] = this.safeCoefficient(index).add(
                b.safeCoefficient(index),
            );
        }
        return new this._constructable(newCoefficients);
    }
    public multiply(_b: Polynomial<T>): Polynomial<T> {
        throw new Error('Method not implemented.');
    }
    public negate(): Polynomial<T> {
        throw new Error('Method not implemented.');
    }
    public reciprocate(): Polynomial<T> {
        throw new Error('Method not implemented.');
    }
    public zero(): Polynomial<T> {
        return new this._constructable([this._coefficients[0].zero()]);
    }
    public unit(): Polynomial<T> {
        return new this._constructable([this._coefficients[0].unit()]);
    }
    public equals(_b: Polynomial<T>): boolean {
        throw new Error('Method not implemented.');
    }
}
