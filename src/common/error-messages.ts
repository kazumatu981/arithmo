export type ErrorCode = 'unknown-character' | 'unexpected';

export const unexpected = '予期せぬエラーが発生しました。';

export const ErrorMessageDictionary: Record<ErrorCode, string> = {
    // tokenizer
    'unknown-character': '予期せぬ文字を検出しました。',
    // parser
    // 共通エラー
    unexpected: unexpected,
};
