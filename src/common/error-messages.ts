/* eslint-disable @typescript-eslint/naming-convention */
/**
 * エラーコード
 */
export type ErrorCode =
    // tokenizer
    | 'unknown-character'
    | 'type-mismatch'
    // parser
    | 'unexpected-number'
    | 'unexpected-operator'
    | 'unexpected-right-paren'
    | 'unexpected-left-paren'
    | 'unexpected-sign'
    // parse-tree-nodes
    | 'sign-must-be-negative'
    | 'single-node-must-have-single-token'
    | 'single-node-must-be-number-token'
    | 'paren-node-must-have-2-token'
    | 'paren-node-must-be-closed'
    | 'paren-node-must-start-with-left-paren'
    | 'paren-node-must-have-children'
    | 'binary-node-must-have-1-token'
    | 'binary-node-must-be-operator-token'
    | 'binary-node-must-have-left'
    | 'binary-node-must-have-right'
    // 共通
    | 'unexpected';

/**
 * エラーメッセージ
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    // tokenizer
    'unknown-character': '予期せぬ文字を検出しました。',
    'type-mismatch': '型と値の形式が一致しません。',
    // parser
    'unexpected-number': '予期せぬ数字を検出しました。',
    'unexpected-operator': '予期せぬ演算子を検出しました。',
    'unexpected-right-paren': '予期せぬ右括弧を検出しました。',
    'unexpected-left-paren': '予期せぬ左括弧を検出しました。',
    'unexpected-sign': '子の演算子は符号として利用できません。',
    // parse-tree-nodes
    'sign-must-be-negative': '符号はマイナスである必要があります。',
    'single-node-must-have-single-token':
        '単項ノードは複数の字句を持てません。',
    'single-node-must-be-number-token':
        '単項ノードは数字の字句を持つ必要があります。',
    'paren-node-must-have-2-token':
        '括弧ノードは2つの字句を持つ必要があります。',
    'paren-node-must-be-closed': '括弧ノードは閉じられる必要があります。',
    'paren-node-must-start-with-left-paren':
        '括弧ノードは左括弧で始まる必要があります。',
    'paren-node-must-have-children':
        '括弧ノードは子ノードを持つ必要があります。',
    'binary-node-must-have-1-token':
        '演算子ノードは1の字句を持つ必要があります。',
    'binary-node-must-be-operator-token':
        '演算子ノードは演算子の字句を持つ必要があります。',
    'binary-node-must-have-left': '演算子ノードに左の子ノードがありません。',
    'binary-node-must-have-right': '演算子ノードに右の子ノードがありません。',
    // 共通エラー
    unexpected: '予期せぬエラーが発生しました。',
};
