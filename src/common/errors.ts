type ModuleName = 'tokenizer' | 'parser' | 'unknown';
export type ErrorCodes =
    | 'unknown-character'
    | 'no-token'
    | 'paren-must-be-expected'
    | 'operator-must-be-expected'
    | 'operator-must-not-be-last'
    | 'unexpected-token'
    | 'unknown-error';
const MessageDictionary: Record<ErrorCodes, string> = {
    // tokenizer errors
    'unknown-character': '不明な文字を検出しました',
    // parser errors
    'no-token': 'トークンがありません',
    'paren-must-be-expected': '括弧が期待されますが、括弧が見つかりません',
    'operator-must-be-expected': '演算子が期待されますが、演算子が見つかりません',
    'operator-must-not-be-last': '演算子は最後に来てはなりません',
    'unexpected-token': '予期せぬトークンを検出しました',
    'unknown-error': '不明なエラー',
};

export class CalcErrorBase extends Error {
    /**
     * エラーが発生したモジュール名
     */
    private _moduleName: ModuleName = 'unknown';
    public get moduleName(): ModuleName {
        return this._moduleName;
    }
    protected set moduleName(moduleName: ModuleName) {
        this._moduleName = moduleName;
    }

    /**
     * エラーコード
     */
    public readonly code: ErrorCodes;
    /**
     * エラーの補足メッセージ
     */
    public readonly appendixMessage?: string;
    public constructor(code: ErrorCodes, appendixMessage?: string) {
        const message: string = MessageDictionary[code] ?? MessageDictionary['unknown-error'];
        super(message);
        this.code = code;
        this.appendixMessage = appendixMessage;
    }
}

export class TokenizerError extends CalcErrorBase {
    /**
     * トークンの位置(何文字目で検出したか)
     */
    public readonly position?: number;
    public constructor(code: ErrorCodes, appendixMessage?: string, position?: number) {
        super(code, appendixMessage);
        this.moduleName = 'tokenizer';
        this.position = position;
    }
}

export class ParserError extends CalcErrorBase {
    public constructor(code: ErrorCodes, appendixMessage?: string) {
        super(code, appendixMessage);
        this.moduleName = 'parser';
    }
}
