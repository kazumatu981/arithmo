export type ErrorCode =
    // tokenizer
    | 'unknown-character'
    // parser
    | 'unexpected-number'
    | 'unexpected-operator'
    | 'unexpected-right-paren'
    | 'unexpected-left-paren'
    | 'unexpected-sign'
    // parse-tree-nodes
    | 'single-node-must-have-1-or-2-tokens'
    | 'paren-node-must-have-2-or-3-tokens'
    | 'paren-node-must-be-closed'
    | 'paren-node-must-have-children'
    | 'binary-node-must-have-1-token'
    | 'binary-node-must-have-left'
    | 'binary-node-must-have-right'
    // 共通
    | 'unexpected';

export const unexpected = '予期せぬエラーが発生しました。';

export const ErrorMessageDictionary: Record<ErrorCode, string> = {
    // tokenizer
    'unknown-character': '予期せぬ文字を検出しました。',
    // parser
    'unexpected-number': '予期せぬ数字を検出しました。',
    'unexpected-operator': '予期せぬ演算子を検出しました。',
    'unexpected-right-paren': '予期せぬ右括弧を検出しました。',
    'unexpected-left-paren': '予期せぬ左括弧を検出しました。',
    'unexpected-sign': '子の演算子は符号として利用できません。',
    // parse-tree-nodes
    'single-node-must-have-1-or-2-tokens':
        '数値ノードは1または2の字句を持つ必要があります。',
    'paren-node-must-have-2-or-3-tokens':
        '括弧ノードは2または3の字句を持つ必要があります。',
    'paren-node-must-be-closed': '括弧ノードは閉じられる必要があります。',
    'paren-node-must-have-children':
        '括弧ノードは子ノードを持つ必要があります。',
    'binary-node-must-have-1-token':
        '演算子ノードは1の字句を持つ必要があります。',
    'binary-node-must-have-left': '演算子ノードに左の子ノードがありません。',
    'binary-node-must-have-right': '演算子ノードに右の子ノードがありません。',
    // 共通エラー
    unexpected: unexpected,
};
