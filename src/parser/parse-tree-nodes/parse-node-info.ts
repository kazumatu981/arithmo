/** ノード情報のタイプ */
export type NodeType = 'single' | 'binary' | 'paren';

/** ノード情報 */
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
