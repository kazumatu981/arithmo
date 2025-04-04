export interface ArithmeticOperations<T> {
    add(b: T): T;
    multiply(b: T): T;
    negate(): T;
    reciprocate(): T;
    equls(b: T): boolean;
}
