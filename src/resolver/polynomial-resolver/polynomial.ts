// TODO 多項式を実装する

import { type Field, type Ring } from '../common/arithmetic-operations';

export abstract class Polynomial<T extends Field<T>>
    implements Ring<Polynomial<T>>
{
    abstract readonly _constructable: {
        new (coefficients: T[]): Polynomial<T>;
    };
    private _coefficients: T[];
    private readonly _variable: string;

    constructor(coefficients: T[], variable: string) {
        this._variable = variable;
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
        return new this._constructable(newCoefficients)._trim();
    }
    public multiply(b: Polynomial<T>): Polynomial<T> {
        const result = this._coefficients
            .map((c, index) => {
                const element = b.scalarMultiply(c).elevate(index);
                return element;
            })
            .reduce((a, b) => a.add(b));
        return result._trim();
    }

    public remainder(_b: Polynomial<T>): Polynomial<T> {
        // TODO 多項式の除算を実装する
        throw new Error('not implemented');
    }

    public negate(): Polynomial<T> {
        const neCoefficients = this._coefficients.map((c) => c.negate());
        return new this._constructable(neCoefficients);
    }
    public zero(): Polynomial<T> {
        return new this._constructable([this._coefficients[0].zero()]);
    }
    public unit(): Polynomial<T> {
        return new this._constructable([this._coefficients[0].unit()]);
    }
    public equals(b: Polynomial<T>): boolean {
        if (this._variable !== b._variable) {
            return false;
        }
        if (this._coefficients.length !== b._coefficients.length) {
            return false;
        }
        for (let index = 0; index < this._coefficients.length; index++) {
            if (!this._coefficients[index].equals(b._coefficients[index])) {
                return false;
            }
        }
        return true;
    }
    private _trim(): this {
        while (this._coefficients.length > 1) {
            if (
                this._coefficients[this._coefficients.length - 1].equals(
                    this._coefficients[0].zero(),
                )
            ) {
                this._coefficients.pop();
            } else {
                break;
            }
        }
        return this;
    }
}
