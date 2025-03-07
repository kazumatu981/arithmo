import { Token } from '../tokenizer';
import { PaseTreeNode } from './pase-tree-nodes';

type ParseState = 'Initial' | 'WaitForNumber' | 'WaitForOperator';
type StateAction: (token: Token) => void;
export class ParseTreeBuilder {
    private _currentNode?: PaseTreeNode;
    private state: ParseState = 'Initial';
    private sign: Token | null = null;
    private stateActions: Record<ParseState, StateAction> = {
        Initial: this.onInitial,
        WaitForNumber: this.onWaitForNumber,
        WaitForOperator: this.onWaitForOperator,
    }
    public addToken(token: Token): this {
        const action = this.stateActions[this.state];
        action(token);
        return this;
    }
    private onInitial(token: Token) {
        if (token.isNumber) {
            this.state = 'WaitForOperator';
        } if( token.isNegativeSign ) {
            this.state = 'WaitForNumber';
        } else {
            // todo error
        }
    }
    private onWaitForNumber(token: Token) {}
    private onWaitForOperator(token: Token) {}

    private appendNumberNode(token: Token) {}
    private appendOperatorNode(token: Token) {}
    private appendParenNode(token: Token) {}
}
