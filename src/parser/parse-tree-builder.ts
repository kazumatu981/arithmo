import type { Token, TokenType } from '../tokenizer';
import {
    ParseTreeNode,
    SingleNode,
    BinaryNode,
    ParenNode,
} from './pase-tree-nodes';
import type { ErrorCode } from '../common/error-messages';
import { ParserError } from './parser-error';

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
            rightParen: ((token: Token): void => {
                this.throwParseError('unexpected-right-paren', token);
            }).bind(this),
            operator: this.appendSign.bind(this),
        },
        WaitForNumber: {
            number: this.appendNumberNode.bind(this),
            leftParen: this.appendParenStart.bind(this),
            rightParen: ((token: Token): void => {
                this.throwParseError('unexpected-right-paren', token);
            }).bind(this),
            operator: ((token: Token): void => {
                this.throwParseError('unexpected-operator', token);
            }).bind(this),
        },
        WaitForOperator: {
            number: ((token: Token): void => {
                this.throwParseError('unexpected-number', token);
            }).bind(this),
            leftParen: ((token: Token): void => {
                this.throwParseError('unexpected-left-paren', token);
            }).bind(this),
            rightParen: this.appendParenEnd.bind(this),
            operator: this.appendOperatorNode.bind(this),
        },
    };
    public addToken(token: Token): this {
        const action = this.stateActionTable[this.state][token.type];
        const nextState = this.nextStateTable[this.state][token.type];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        action!(token);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.state = nextState!;
        return this;
    }
    public findRootNode(): ParseTreeNode | undefined {
        return ParseTreeNode.findRootNode(this._currentNode);
    }
    public build(): ParseTreeNode | undefined {
        return this.findRootNode()?.validate();
    }

    private throwParseError(code: ErrorCode, token: Token): void {
        throw new ParserError(code, { token });
    }
    private appendSign(token: Token): void {
        if (token.isNegativeSign) {
            this.sign = token;
        } else {
            throw new ParserError('unexpected-sign', { token });
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
                throw new ParserError('unexpected', {
                    token,
                    appendixMessage:
                        '現在のノードに数字ノードを追加しようとたが、子ノードを持てないノードである(バグの可能性がある)',
                });
            }
        }
        this._currentNode = numberNode;
    }
    private appendOperatorNode(token: Token): void {
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
                throw new ParserError('unexpected', {
                    token,
                    appendixMessage:
                        '現在のノードに括弧ノードを追加しようとたが、子ノードを持てないノードである(バグの可能性がある)',
                });
            }
        }
        this._currentNode = parenNode;
    }
    private appendParenEnd(token: Token): void {
        const parenNode = ParenNode.findParenNode(this._currentNode);
        if (!parenNode) {
            throw new ParserError('unexpected-right-paren', { token });
        }
        parenNode.parenEnd = token;
        this._currentNode = parenNode;
    }
}
