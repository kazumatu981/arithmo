import { type Token } from '../../tokenizer';
import { type ErrorCode } from '../../common/error-messages';
import { ParserError } from '../parser-error';
import type { NodeType, ParseNodeInfo } from './parse-node-info';

export type StringifyType = 'thisNode' | 'resolving' | 'resolved';

export interface ValidationError {
    code: ErrorCode;
    node: ParseTreeNode;
    appendixMessage?: string;
}

export type ValidationRule = (
    node: ParseTreeNode,
) => ValidationError | undefined;

export function simpleValidationRule(
    isValid: (node: ParseTreeNode) => boolean,
    code: ErrorCode,
    appendixMessage?: string,
): ValidationRule {
    return (node: ParseTreeNode): ValidationError | undefined => {
        if (isValid(node)) return undefined;
        return { code, node, appendixMessage };
    };
}

export abstract class ParseTreeNode {
    private readonly _type: NodeType;
    private readonly _value: Token[];
    private _parent?: ParseTreeNode;
    abstract validations: ValidationRule[];

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

    public validate(): this {
        const validationErrors = this.validations
            .map((v) => v(this))
            .filter((v) => v !== undefined) as ValidationError[];
        if (validationErrors.length > 0) {
            throw new ParserError(validationErrors[0].code, {
                token: validationErrors[0].node.value[0],
                appendixMessage: validationErrors[0].appendixMessage,
            });
        }
        return this;
    }

    public abstract toString(type: StringifyType): string;
    public abstract toNodeInfo(): ParseNodeInfo;
}

export type * from './parse-node-info';
