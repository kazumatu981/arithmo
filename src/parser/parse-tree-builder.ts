import type { Token, TokenType } from '../tokenizer';
import {
    ParseTreeNode,
    SingleNode,
    BinaryNode,
    ParenNode,
} from './pase-tree-nodes';

type ParseState = 'Initial' | 'WaitForNumber' | 'WaitForOperator';

type ParseTreeStateTableRecord<T> = Record<TokenType, T>;
type ParseTreeStateTable<T> = Record<ParseState, ParseTreeStateTableRecord<T>>;

type StateAction = (token: Token) => void;

export class ParseTreeBuilder {
    private _currentNode?: ParseTreeNode;
    private state: ParseState = 'Initial';
    private sign: Token | null = null;

    private nextStateTable: ParseTreeStateTable<ParseState | undefined> = {
        Initial: {
            number: 'WaitForOperator',
            leftParen: 'Initial',
            rightParen: undefined,
            operator: 'WaitForNumber',
        },
        WaitForNumber: {
            number: 'WaitForOperator',
            leftParen: 'Initial',
            rightParen: undefined,
            operator: undefined,
        },
        WaitForOperator: {
            number: undefined,
            leftParen: undefined,
            rightParen: 'WaitForOperator',
            operator: 'WaitForNumber',
        },
    };

    private stateActionTable: ParseTreeStateTable<StateAction | undefined> = {
        Initial: {
            number: this.appendNumberNode.bind(this),
            leftParen: this.appendParenStart.bind(this),
            rightParen: undefined,
            operator: this.appendSign.bind(this),
        },
        WaitForNumber: {
            number: this.appendNumberNode.bind(this),
            leftParen: this.appendParenStart.bind(this),
            rightParen: undefined,
            operator: undefined,
        },
        WaitForOperator: {
            number: undefined,
            leftParen: undefined,
            rightParen: this.appendParenEnd.bind(this),
            operator: this.appendOperatorNode.bind(this),
        },
    };

    public addToken(token: Token): this {
        const nextState = this.nextStateTable[this.state][token.type];
        const action = this.stateActionTable[this.state][token.type];
        if (nextState === undefined || action === undefined) {
            throw new Error('予期せぬトークン');
        }
        this.state = nextState;
        action(token);
        return this;
    }
    public findRootNode(): ParseTreeNode | undefined {
        return ParseTreeNode.findRootNode(this._currentNode);
    }
    public build(): ParseTreeNode | undefined {
        return this.findRootNode()?.validate();
    }

    private appendSign(token: Token): void {
        if (token.isNegativeSign) {
            this.sign = token;
        } else {
            throw new Error('予期せぬマイナス記号');
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
                throw new Error('予期せぬトークン: 連続的な数値');
            }
        }
        this._currentNode = numberNode;
    }
    private appendOperatorNode(token: Token): void {
        if (!this._currentNode) {
            throw new Error('予期せぬ演算子');
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
                throw new Error('予期せぬトークン: 数値の後の括弧');
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
