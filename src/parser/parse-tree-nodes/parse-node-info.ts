export type NodeType = 'single' | 'binary' | 'paren';
export interface ParseNodeInfo {
    value: string;
    type: NodeType;
    right?: ParseNodeInfo;
    left?: ParseNodeInfo;
    childrenRoot?: ParseNodeInfo;
}
