import { Token } from '../tokenizer/token';
import { ParserNode, SingleNode, ParenNode } from './parser-node';
import { __assert } from '../common/assert';
import { ParserError } from '../common/errors';

/**
 * 解析モード
 */
type ParseMode = 'normal' | 'paren';

export interface ParserOptions {
    /**
     * 解析開始位置
     */
    startIndex?: number;
    /**
     * 解析モード
     */
    mode?: ParseMode;
}

/**
 * 構文解析エンジン
 */
export class Parser {
    private _startIndex: number;
    private _tokens: Token[];
    private _currentIndex: number;
    private _mode: ParseMode;

    /**
     * @param tokens 字句配列
     * @param options オプション
     * @param options.startIndex 解析開始位置
     * @param options.mode 解析モード
     */
    public constructor(tokens: Token[], options?: ParserOptions) {
        this._tokens = tokens;
        this._mode = options?.mode ?? 'normal';
        this._startIndex = options?.startIndex ?? 0;
        this._currentIndex = this._startIndex;
    }

    /**
     * 字句配列を構文木に変換する
     * @returns 構文木
     */
    public parse(): ParserNode {
        this._currentIndex = this._startIndex;
        let isFist = true;
        let rootNode: ParserNode | undefined = undefined;
        while (this._isNotEnd()) {
            const { operatorToken, node } = this._readNextOperatorAndNode(isFist);
            if (isFist) {
                isFist = false;
            }
            rootNode = ParserNode.connectTwoNodes(rootNode, operatorToken, node);
        }

        // 構文木を構築できなかった場合、エラーを返却する
        __assert(ParserError).notUndefined(rootNode, 'no-token');
        if (this._mode === 'paren') {
            // 括弧モードの場合、最後が右括弧でない場合はエラーを返却する
            __assert(ParserError).toTrue(this.endWithRightParen, 'paren-must-be-expected');
        }

        return rootNode as ParserNode;
    }

    /**
     * 現在の位置にある字句を取得する
     * @returns 現在の位置にある字句
     */
    public get currentToken(): Token | undefined {
        return this._safeReadTokenAt(this._currentIndex);
    }

    /**
     * 次の位置にある字句を取得する
     * @returns 次の位置にある字句
     */
    public get nextToken(): Token | undefined {
        return this._safeReadTokenAt(this._currentIndex + 1);
    }

    /**
     * 現在の位置が末尾かどうかを判定する
     * @returns 末尾かどうかを表す真偽値
     */
    private _isNotEnd() {
        if (this._mode !== 'paren') {
            return this.currentToken !== undefined;
        } else {
            if (this.currentToken === undefined) {
                // 末尾に到達
                return false;
            }
            return !this.endWithRightParen;
        }
    }

    /**
     * 現在の位置が右括弧で終わってるかどうか
     * @returns 右括弧で終わってるかどうかを表す真偽値
     */
    private get endWithRightParen(): boolean {
        return this.currentToken?.isRightParen === true;
    }

    /**
     * 次の位置にある演算子と数式を取得する
     * @param isFirst 最初の呼び出しかどうか
     * @returns 次の位置にある演算子と数式
     */
    private _readNextOperatorAndNode(isFirst: boolean = false): {
        operatorToken?: Token;
        node: ParserNode;
    } {
        let operatorToken: Token | undefined = undefined;
        let node: ParserNode | undefined = undefined;

        if (!isFirst) {
            operatorToken = this._readAsOperatorToken();
        }

        __assert(ParserError).notUndefined(this.currentToken, 'operator-must-not-be-last');

        if (this.currentToken!.isNumber || this.currentToken!.isNegativeSign) {
            node = this._readAsSingleNode();
        } else if (this.currentToken!.isLeftParen) {
            node = this._readAsParenNode();
        }

        __assert(ParserError).notUndefined(node, 'unexpected-token');

        return { operatorToken, node: node as ParserNode };
    }

    /**
     * 現在の位置にある字句が演算子である場合、取得する
     * @returns 取得した演算子字句
     * @throws {ParserError} 現在の位置にある字句が演算子でない場合
     */
    private _readAsOperatorToken(): Token | undefined {
        let operatorToken: Token | undefined = undefined;

        __assert(ParserError).notUndefined(this.currentToken, 'no-token');
        __assert(ParserError).toTrue(this.currentToken!.isOperator, 'operator-must-be-expected');

        operatorToken = this.currentToken;
        this._currentIndex++;

        return operatorToken;
    }

    /**
     * 現在の位置にある字句が単一の数字かマイナス記号かどうかを判定し、
     * その値をSingleNodeに変換して返す
     * @returns 取得したSingleNode
     * @throws {ParserError} 現在の位置にある字句がマイナス記号か数字でない場合
     */
    private _readAsSingleNode(): SingleNode {
        let node: SingleNode | undefined = undefined;

        // 現在のトークンがないといけない
        __assert(ParserError).notUndefined(this.currentToken, 'no-token');

        if (this.currentToken!.isNumber) {
            // 現在のトークンが数字だった場合
            node = new SingleNode([this.currentToken!]);
            this._currentIndex++;
        } else if (this.currentToken!.isNegativeSign) {
            // 次のトークンが数字でなければエラー
            __assert(ParserError).notUndefined(this.nextToken, 'no-token');
            __assert(ParserError).toTrue(this.nextToken!.isNumber, 'unexpected-token');

            // 現在のトークンがマイナス記号であった場合
            node = new SingleNode([this.currentToken!, this!.nextToken!]);
            this._currentIndex += 2;
        }

        // 現在のトークンが数字でも、マイナス記号でもなければエラー
        __assert(ParserError).notUndefined(node, 'unexpected-token');

        return node as SingleNode;
    }

    /**
     * 現在の位置にある字句が左括弧である場合、パースする
     * @returns パースしたParenNode
     * @throws {ParserError} 現在の位置にある字句が左括弧でない場合
     */
    private _readAsParenNode(): ParenNode {
        const parenStartToken = this.currentToken as Token;
        const childParser = new Parser(this._tokens, {
            startIndex: this._currentIndex + 1,
            mode: 'paren',
        });
        const childRoot = childParser.parse();
        const parenEndToken = childParser.currentToken as Token;
        this._currentIndex = childParser._currentIndex + 1;

        return new ParenNode([parenStartToken, parenEndToken], childRoot);
    }

    /**
     * 安全に字句を取得する
     * @param index 取得する字句のインデックス
     * @returns 取得した字句 or undefined
     */
    private _safeReadTokenAt(index: number): Token | undefined {
        if (index < this._tokens.length) {
            return this._tokens[index];
        }
    }
}
