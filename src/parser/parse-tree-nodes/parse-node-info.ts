/**
 * ノード情報のタイプ
 * @group Parser
 */
export type NodeType = 'single' | 'binary' | 'paren';

/**
 * ノード情報
 * @group Parser
 */
export interface ParseNodeInfo {
    /** 値 */
    value: string;
    /** ノードの型 */
    type: NodeType;
    /** 右ノード */
    right?: ParseNodeInfo;
    /** 左ノード */
    left?: ParseNodeInfo;
    /** 子ノード */
    childrenRoot?: ParseNodeInfo;
}
