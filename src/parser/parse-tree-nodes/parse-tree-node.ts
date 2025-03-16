import { type Token } from '../../tokenizer';
import type { NodeType, ParseNodeInfo } from './parse-node-info';
import { Testable, type Rule } from '../../common/testable';

export type StringifyType = 'thisNode' | 'includeChildren';

export abstract class ParseTreeNode extends Testable<ParseTreeNode> {
    private readonly _type: NodeType;
    private readonly _value: Token[];
    private _parent?: ParseTreeNode;
    abstract rules: Rule<ParseTreeNode>[];

    /**
     * @param type ノードの型
     * @param tokens 使われた字句の配列
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
     * この ParseTreeNodes の値を取得します
     * @returns この ParseTreeNodes の値
     */
    public get value(): Token[] {
        return this._value;
    }

    /**
     * この ParseTreeNodes の親 ParseTreeNodes を取得します
     * @returns 親 ParseTreeNodes
     */
    public get parent(): ParseTreeNode | undefined {
        return this._parent;
    }
    /**
     * この ParseTreeNodes の親 ParseTreeNodes を設定します
     * @param value 設定する親 ParseTreeNodes
     */
    public set parent(value: ParseTreeNode | undefined) {
        this._parent = value;
    }

    public static findRootNode(
        node: ParseTreeNode | undefined,
    ): ParseTreeNode | undefined {
        if (node === undefined) return undefined;
        while (node.parent !== undefined) node = node.parent;
        return node;
    }

    public abstract toString(type: StringifyType): string;
    public abstract toNodeInfo(): ParseNodeInfo;
}

export type * from './parse-node-info';
