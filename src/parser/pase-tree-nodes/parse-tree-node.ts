import { type Token } from '../../tokenizer';

export type NodeType = 'single' | 'binary' | 'paren';
export type StringifyType = 'thisNode' | 'resolving' | 'resolved';

export interface IParseTreeNode {
    value: string;
    type: NodeType;
    right?: IParseTreeNode;
    left?: IParseTreeNode;
    childrenRoot?: IParseTreeNode;
}

export abstract class PaseTreeNode {
    private readonly _type: NodeType;
    private readonly _value: Token[];
    private _parent?: PaseTreeNode;

    /**
     * @param type ノードの型
     * @param tokens 使われた字句の配列
     */
    constructor(type: NodeType, tokens: Token[]) {
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
    public get parent(): PaseTreeNode | undefined {
        return this._parent;
    }
    /**
     * この ParseTreeNodes の親 ParseTreeNodes を設定します
     * @param value 設定する親 ParseTreeNodes
     */
    public set parent(value: PaseTreeNode | undefined) {
        this._parent = value;
    }

    public abstract toString(type: StringifyType): string;
}
