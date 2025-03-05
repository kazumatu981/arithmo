import { ParserError } from '../../common/errors';
import { BinaryNode } from './binary-node';
import { Token } from '../../tokenizer/token';

export type NodeType = 'single' | 'binary' | 'paren';
export type StringifyType = 'thisNode' | 'executing' | 'resolved';
/**
 * ノード
 */
export abstract class ParserNode {
    public readonly nodeType: NodeType;
    public readonly tokens: Token[];

    /**
     * @param nodeType ノードの型
     * @param tokens 使われた字句の配列
     */
    public constructor(nodeType: NodeType, tokens: Token[]) {
        this.nodeType = nodeType;
        this.tokens = tokens;
    }

    /**
     * 右の項に nodeToBeConnected を operatorToken でつなげて、新しい BinaryNode を生成する
     * @param operatorToken 演算子
     * @param nodeToBeConnected つなげるノード
     * @returns 生成された新しい BinaryNode
     */
    public connectToTail(operatorToken: Token, nodeToBeConnected: ParserNode): BinaryNode {
        return new BinaryNode(operatorToken, this, nodeToBeConnected);
    }

    /**
     * 2つのノードを operatorToken でつなげて、新しいノードを生成する
     * @param node1 つなげる左のノード
     * @param node2 つなげる右のノード
     * @param operatorToken つなげる演算子
     * @returns 生成された新しいノード
     * @throws {ParserError} operatorToken が undefined の場合
     */
    public static connectTwoNodes(
        node1: ParserNode | undefined,
        operatorToken: Token | undefined,
        node2: ParserNode,
    ): ParserNode {
        if (node1 === undefined) {
            return node2;
        } else {
            if (operatorToken === undefined) {
                throw new ParserError('operator-must-be-expected');
            }

            return node1.connectToTail(operatorToken, node2);
        }
    }
    abstract toString(stringifyType?: StringifyType): string;
}
