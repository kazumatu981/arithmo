import { CalcErrorBase, ErrorCodes } from './errors';

export function __assert<E extends CalcErrorBase>(ErrorType: new (code: ErrorCodes, appendixMessage?: string) => E) {
    return {
        notUndefined: (value: any, code: ErrorCodes, appendixMessage?: string) => {
            if (value === undefined) {
                throw new ErrorType(code, appendixMessage);
            }
        },
        toTrue: (condition: boolean, code: ErrorCodes, appendixMessage?: string) => {
            if (!condition) {
                throw new ErrorType(code, appendixMessage);
            }
        },
        toFalse: (condition: boolean, code: ErrorCodes, appendixMessage?: string) => {
            if (condition) {
                throw new ErrorType(code, appendixMessage);
            }
        },
    };
}
