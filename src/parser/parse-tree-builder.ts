import type { Token, TokenType } from '../tokenizer';
import {
    ParseTreeNode,
    SingleNode,
    BinaryNode,
    ParenNode,
} from './parse-tree-nodes';
import type { ErrorCode } from '../common/error-messages';
import { ParserError } from './parser-error';
import { UnexpectedError } from '../common/unexpected-error';

/**
 * 構文解析木の状態
 */
type ParseState = 'initial' | 'waitForNumber' | 'waitForOperator';
/**
 * 構文解析木の状態に応じたアクション
 */
type StateAction = (token: Token) => void;

/**
 * 状態に応じた決定テーブルレコード(行)
 */
type ParseTreeStateTableRecord<T> = Record<TokenType, T>;
/**
 * 状態に応じた決定テーブル
 */
type ParseTreeStateTable<T> = Record<ParseState, ParseTreeStateTableRecord<T>>;

/**
 * 状態遷移テーブル
 */
type StateTable = ParseTreeStateTable<ParseState | undefined>;
/**
 * アクションテーブル
 */
type ActionTable = ParseTreeStateTable<StateAction>;

/**
 * 構文解析木を構築するクラス
 */
export class ParseTreeBuilder {
    // #region private fields
    /**
     * 現在のノード
     */
    private _currentNode?: ParseTreeNode;
    /**
     * 現在の状態
     */
    private _state: ParseState = 'initial';
    /**
     * 符号のキャッシュ
     */
    private _sign: Token | null = null;
    /**
     * 状態遷移テーブル
     */
    private readonly _stateTable: StateTable = {
        initial: {
            number: 'waitForOperator',
            leftParen: 'initial',
            rightParen: undefined,
            operator: 'waitForNumber',
        },
        waitForNumber: {
            number: 'waitForOperator',
            leftParen: 'initial',
            rightParen: undefined,
            operator: undefined,
        },
        waitForOperator: {
            number: undefined,
            leftParen: undefined,
            rightParen: 'waitForOperator',
            operator: 'waitForNumber',
        },
    };
    /**
     * アクションテーブル
     */
    private readonly _actionTable: ActionTable = {
        initial: {
            number: this._appendNumberNode.bind(this),
            leftParen: this._appendParenStart.bind(this),
            rightParen: ((token: Token): void => {
                this._throwParseError('unexpected-right-paren', token);
            }).bind(this),
            operator: this._appendSign.bind(this),
        },
        waitForNumber: {
            number: this._appendNumberNode.bind(this),
            leftParen: this._appendParenStart.bind(this),
            rightParen: ((token: Token): void => {
                this._throwParseError('unexpected-right-paren', token);
            }).bind(this),
            operator: ((token: Token): void => {
                this._throwParseError('unexpected-operator', token);
            }).bind(this),
        },
        waitForOperator: {
            number: ((token: Token): void => {
                this._throwParseError('unexpected-number', token);
            }).bind(this),
            leftParen: ((token: Token): void => {
                this._throwParseError('unexpected-left-paren', token);
            }).bind(this),
            rightParen: this._appendParenEnd.bind(this),
            operator: this._appendOperatorNode.bind(this),
        },
    };
    // #endregion

    /**
     * 構文解析木を初期化する
     */
    public initialize(): void {
        this._currentNode = undefined;
        this._state = 'initial';
        this._sign = null;
    }

    /**
     * 構文木にトークンを追加する
     * @param token - 追加するトークン
     * @returns 構文解析木
     */
    public addToken(token: Token): this {
        // テーブル上のアクションを実行
        this._actionTable[this._state][token.type](token);

        // 次の状態へ移行する
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._state = this._stateTable[this._state][token.type]!;

        return this;
    }

    /**
     * 構文木のルートノードを返却する
     * @returns ルートノード
     */
    public findRootNode(): ParseTreeNode | undefined {
        return ParseTreeNode.findRootNode(this._currentNode);
    }

    /**
     * ツリーを検証して構文解析木を返却する
     * @returns 構文解析木
     */
    public build(): ParseTreeNode | undefined {
        const rootNode = this.findRootNode();
        rootNode?.test();
        return rootNode;
    }

    // #region private methods
    private _appendSign(token: Token): void {
        if (token.isNegativeSign) {
            this._sign = token;
        } else {
            throw new ParserError('unexpected-sign', { token });
        }
    }
    private _appendNumberNode(token: Token): void {
        const numberNode = this._sign
            ? new SingleNode([this._sign, token])
            : new SingleNode([token]);
        this._sign = null;
        if (this._currentNode) {
            if (this._currentNode.nodeType === 'binary') {
                (this._currentNode as BinaryNode).right = numberNode;
            } else if (this._currentNode.nodeType === 'paren') {
                (this._currentNode as ParenNode).childrenRoot = numberNode;
            } else {
                throw new UnexpectedError('parser', {
                    appendixMessage:
                        '現在のノードに数字ノードを追加しようとたが、子ノードを持てないノードである',
                });
            }
        }
        this._currentNode = numberNode;
    }
    private _appendOperatorNode(token: Token): void {
        this._currentNode = new BinaryNode([token]).attachTo(this._currentNode);
    }
    private _appendParenStart(token: Token): void {
        const parenNode = this._sign
            ? new ParenNode([this._sign, token])
            : new ParenNode([token]);
        this._sign = null;
        if (this._currentNode) {
            if (this._currentNode.nodeType === 'binary') {
                (this._currentNode as BinaryNode).right = parenNode;
            } else if (this._currentNode.nodeType === 'paren') {
                (this._currentNode as ParenNode).childrenRoot = parenNode;
            } else {
                throw new UnexpectedError('parser', {
                    appendixMessage:
                        '現在のノードに括弧ノードを追加しようとたが、子ノードを持てないノードである',
                });
            }
        }
        this._currentNode = parenNode;
    }
    private _appendParenEnd(token: Token): void {
        const parenNode = ParenNode.findParenNode(this._currentNode);
        if (!parenNode) {
            throw new ParserError('unexpected-right-paren', { token });
        }
        parenNode.parenEnd = token;
        this._currentNode = parenNode;
    }
    private _throwParseError(code: ErrorCode, token: Token): void {
        throw new ParserError(code, { token });
    }
    // #endregion
}
