import type { BinaryNode } from '../../parser';
import { isNumeric } from '../common/numeric';
import { NumberResolver } from '../number-resolver';

export class NumericResolver extends NumberResolver {
    protected resolveBinaryNode(node: BinaryNode): number {
        const result = super.resolveBinaryNode(node);

        if (!isNumeric(result)) {
            // TODO throw resolver error.
            throw new Error('割り切れません');
        }
        return result;
    }
}
