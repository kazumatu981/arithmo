import { type Token } from '../../tokenizer';
import type { NodeType, ParseNodeInfo } from './parse-node-info';
import { Testable, type Rule } from '../../common/testable';

/** ノードの文字列化するタイプ */
export type StringifyType = 'thisNode' | 'includeChildren';

/**
 * 構文解析木のノード
 */
export abstract class ParseTreeNode extends Testable<ParseTreeNode> {
    // #region private fields
    private readonly _type: NodeType;
    private readonly _value: Token[];
    private _parent?: ParseTreeNode;
    // #endregion

    /**
     * コンストラクタ(直接呼ばれることはない)
     * @param type - ノードの型
     * @param tokens - 使われた字句の配列
     */
    constructor(type: NodeType, tokens: Token[]) {
        super();
        this._type = type;
        this._value = tokens;
    }

    /**
     * ノードの型を取得します
     * @returns ノードの型
     */
    public get nodeType(): NodeType {
        return this._type;
    }

    /**
     * このノードの値(Token配列)を取得します
     * @returns 値を表すToken配列
     */
    public get value(): Token[] {
        return this._value;
    }

    /**
     * このノードの親ノードを取得します
     * @returns 親ノード
     */
    public get parent(): ParseTreeNode | undefined {
        return this._parent;
    }
    /**
     * このノードの親ノードを設定します
     * @param value - 設定する親ノード
     */
    public set parent(value: ParseTreeNode | undefined) {
        this._parent = value;
    }

    // #region static methods
    /**
     * ルートノードを返却します
     * @param node - 対象のノード
     * @returns ルートノード
     */
    public static findRootNode(
        node: ParseTreeNode | undefined,
    ): ParseTreeNode | undefined {
        if (node === undefined) return undefined;
        while (node.parent !== undefined) node = node.parent;
        return node;
    }
    // #endregion

    // #region abstracts
    abstract rules: Rule<ParseTreeNode>[];
    public abstract toString(type: StringifyType): string;
    public abstract toNodeInfo(): ParseNodeInfo;
    // #endregion
}

export type * from './parse-node-info';
