import { Token } from '../tokenizer';
import { PaseTreeNode } from './pase-tree-nodes';

type ParseState = 'Initial' | 'WaitForNumber' | 'WaitForOperator';
type StateAction = (token: Token) => void;
export class ParseTreeBuilder {
    private _currentNode?: PaseTreeNode;
    private state: ParseState = 'Initial';
    private sign: Token | null = null;
    private stateActions: Record<ParseState, StateAction> = {
        Initial: this.onInitial,
        WaitForNumber: this.onWaitForNumber,
        WaitForOperator: this.onWaitForOperator,
    };
    public addToken(token: Token): this {
        const action = this.stateActions[this.state];
        action(token);
        return this;
    }
    private onInitial(token: Token): void {
        if (token.isNumber) {
            this.state = 'WaitForOperator';
            this.appendNumberNode(token);
        }
        if (token.isNegativeSign) {
            this.state = 'WaitForNumber';
        } else {
            // TODO error
        }
    }
    private onWaitForNumber(token: Token): void {
        if (token.isNumber) {
            this.state = 'WaitForOperator';
            this.appendNumberNode(token);
        }
        if (token.isLeftParen) {
            this.state = 'Initial';
            this.appendParenStart(token);
        } else {
            // TODO error
        }
    }
    private onWaitForOperator(token: Token): void {
        if (token.isOperator) {
            this.state = 'WaitForNumber';
            this.appendOperatorNode(token);
        } else if (token.isRightParen) {
            this.appendParenEnd(token);
            this.state = 'WaitForOperator';
        } else {
            // TODO error
        }
    }

    private appendNumberNode(token: Token) {
        const number;
    }
    private appendOperatorNode(token: Token) {}
    private appendParenStart(token: Token) {}
    private appendParenEnd(token: Token) {}
}
