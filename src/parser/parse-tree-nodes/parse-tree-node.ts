import { type Token } from '../../tokenizer';
import type { NodeType, ParseNodeInfo } from './parse-node-info';
import { Testable } from '../../common/testable';

/**
 *  ノードの文字列化するタイプ
 * @group Parser
 */
export type StringifyType = 'thisNode' | 'includeChildren';

/**
 * 構文解析木のノード
 * @group Parser
 */
export abstract class ParseTreeNode extends Testable<ParseTreeNode> {
    protected readonly moduleName = 'parser';
    // #region private fields
    public readonly type: NodeType;
    public readonly tokens: Token[];
    public parent?: ParseTreeNode;
    // #endregion

    /**
     * コンストラクタ(直接呼ばれることはない)
     * @param type - ノードの型
     * @param tokens - 使われた字句の配列
     */
    constructor(type: NodeType, tokens: Token[]) {
        super();
        this.type = type;
        this.tokens = tokens;
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
    public abstract toString(type: StringifyType): string;
    public abstract toNodeInfo(): ParseNodeInfo;
    // #endregion
}

export type * from './parse-node-info';
