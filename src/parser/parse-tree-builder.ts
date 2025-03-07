import { Token } from '../tokenizer';
import {
    ParseTreeNode,
    SingleNode,
    BinaryNode,
    ParenNode,
} from './pase-tree-nodes';

type ParseState = 'Initial' | 'WaitForNumber' | 'WaitForOperator';
type StateAction = (token: Token) => void;
export class ParseTreeBuilder {
    private _currentNode?: ParseTreeNode;
    private state: ParseState = 'Initial';
    private sign: Token | null = null;
    private stateActions: Record<ParseState, StateAction> = {
        Initial: this.onInitial.bind(this),
        WaitForNumber: this.onWaitForNumber.bind(this),
        WaitForOperator: this.onWaitForOperator.bind(this),
    };
    public addToken(token: Token): this {
        const action = this.stateActions[this.state];
        action(token);
        return this;
    }
    public build(): ParseTreeNode | undefined {
        let current = this._currentNode;
        while (current?.parent) {
            current = current.parent;
        }
        return current;
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

    private appendNumberNode(token: Token): void {
        const numberNode = this.sign
            ? new SingleNode([this.sign, token])
            : new SingleNode([token]);
        this.sign = null;
        if (this._currentNode) {
            if (this._currentNode.nodeType === 'binary') {
                (this._currentNode as BinaryNode).right = numberNode;
            } else if (this._currentNode.nodeType === 'paren') {
                (this._currentNode as ParenNode).childrenRoot = numberNode;
            } else {
                // TODO error
            }
        }
        this._currentNode = numberNode;
    }
    private appendOperatorNode(token: Token): void {
        if (!this._currentNode) {
            // TODO error
            return;
        }
        const operatorNode = new BinaryNode([token]);
        if (!this._currentNode.parent) {
            operatorNode.left = this._currentNode;
            this._currentNode = operatorNode;
            return;
        }
        let current: ParseTreeNode | undefined = this._currentNode;
        while (current) {
            if (!current.parent) {
                operatorNode.left = current;
                break;
            } else if (current.parent.nodeType === 'paren') {
                const parenNode = current.parent as ParenNode;
                operatorNode.left = parenNode.childrenRoot as ParseTreeNode;
                parenNode.childrenRoot = operatorNode;
                break;
            } else if (current.parent.nodeType === 'binary') {
                const binaryNode = current.parent as BinaryNode;
                if (token.isPrimaryOperator) {
                    if (binaryNode.value[0].isSecondaryOperator) {
                        operatorNode.left = binaryNode.right as ParseTreeNode;
                        binaryNode.right = operatorNode;
                        break;
                    }
                }
            }
            current = current.parent;
        }
        this._currentNode = operatorNode;
    }
    private appendParenStart(token: Token): void {
        const parenNode = this.sign
            ? new ParenNode([this.sign, token])
            : new ParenNode([token]);
        this.sign = null;
        if (this._currentNode) {
            if (this._currentNode.nodeType === 'binary') {
                (this._currentNode as BinaryNode).right = parenNode;
            } else if (this._currentNode.nodeType === 'paren') {
                (this._currentNode as ParenNode).childrenRoot = parenNode;
            } else {
                // TODO error
            }
        }
        this._currentNode = parenNode;
    }
    private appendParenEnd(token: Token): void {
        let current = this._currentNode;
        while (current) {
            if (current?.nodeType === 'paren') {
                (current as ParenNode).parenEnd = token;
                break;
            }
            current = current.parent;
        }
        if (!current) {
            // TODO error
        }
        this._currentNode = current;
    }
}
