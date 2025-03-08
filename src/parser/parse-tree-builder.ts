import { Token } from '../tokenizer';
import {
    ParseTreeNode,
    SingleNode,
    BinaryNode,
    ParenNode,
} from './pase-tree-nodes';

type ParseState = 'Initial' | 'WaitForNumber' | 'WaitForOperator';
export class ParseTreeBuilder {
    private _currentNode?: ParseTreeNode;
    private state: ParseState = 'Initial';
    private sign: Token | null = null;
    public addToken(token: Token): this {
        switch (this.state) {
            case 'Initial':
                this.onInitial(token);
                break;
            case 'WaitForNumber':
                this.onWaitForNumber(token);
                break;
            case 'WaitForOperator':
                this.onWaitForOperator(token);
                break;
        }
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
        } else if (token.isLeftParen) {
            this.state = 'Initial';
            this.appendParenStart(token);
        } else if (token.isNegativeSign) {
            this.state = 'WaitForNumber';
        } else {
            // TODO error
        }
    }
    private onWaitForNumber(token: Token): void {
        if (token.isNumber) {
            this.state = 'WaitForOperator';
            this.appendNumberNode(token);
        } else if (token.isLeftParen) {
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
            this.state = 'WaitForOperator';
            this.appendParenEnd(token);
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
        this._currentNode = new BinaryNode([token]).attachTo(this._currentNode);
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
        const parenNode = ParenNode.findParenNode(this._currentNode);
        if (!parenNode) {
            throw new Error('予期せぬ閉じ括弧が検出されました');
        }
        parenNode.parenEnd = token;
        this._currentNode = parenNode;
    }
}
