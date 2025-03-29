import { ErrorCode } from '../../../src/common/error-messages';
import { ArithmoTestError } from '../../../src/common/testable';
import { expect } from '@jest/globals';
export class ArithmoTestErrorUtil {
    private readonly _error: ArithmoTestError;
    constructor(error: Error) {
        expect(error).toBeInstanceOf(ArithmoTestError);
        this._error = error as ArithmoTestError;
    }

    public isEqualModuleName(moduleName: string) {
        expect(this._error.moduleName).toEqual(moduleName);
    }

    public hasError() {
        expect(this._error.errors.length).toBeGreaterThan(0);
    }

    public hasErrorCode(errorCode: ErrorCode) {
        expect(
            this._error.errors.map((error) => error.code).includes(errorCode),
        ).toBeTruthy();
    }

    public snapInnerError() {
        expect(this._error.errors).toMatchSnapshot();
    }
}
