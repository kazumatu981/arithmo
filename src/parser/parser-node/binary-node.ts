import { ParserNode, type StringifyType } from './parser-node';
import { Token } from '../../tokenizer';
import { resolveNode } from '../../resolver/node-resolver';

/**
 * 二項演算子のノード
 */
export class BinaryNode extends ParserNode {
    public left: ParserNode;
    public right: ParserNode;
    public get operator() {
        return this.tokens[0].value;
    }

    /**
     * @param operatorToken 演算子
     * @param left 左の項
     * @param right 右の項
     */
    constructor(operatorToken: Token, left: ParserNode, right: ParserNode) {
        super('binary', [operatorToken]);
        this.left = left;
        this.right = right;
    }

    /**
     * 右の項に nodeToBeConnected を operatorToken でつなげて、新しいノードを生成する
     * @param operatorToken 演算子
     * @param nodeToBeConnected つなげるノード
     * @returns 生成された新しい BinaryNode
     * @description
     *  operatorToken が二項演算子の場合は this と nodeToBeConnected を operatorToken でつなげて、新しい BinaryNode を生成する
     *  しかし、 operatorToken が掛け算や割り算の場合は this の右の子に nodeToBeConnected を operatorToken でつなげて、新しい BinaryNode を生成する
     */
    public connectToTail(operatorToken: Token, nodeToBeConnected: ParserNode): BinaryNode {
        if (operatorToken.isSecondaryOperator) {
            return new BinaryNode(operatorToken, this, nodeToBeConnected);
        } else {
            // 掛け算や割り算の場合は右の子に接続する
            const newNode = new BinaryNode(operatorToken, this.right, nodeToBeConnected);
            this.right = newNode;
            return this;
        }
    }

    /**
     * ノードの文字列表現を取得する
     * @returns ノードの文字列表現
     * @description
     *  左の項、演算子、右の項を連結した文字列を取得する
     */
    public toString(stringifyType?: StringifyType): string {
        stringifyType = stringifyType ?? 'thisNode';
        switch (stringifyType) {
            case 'thisNode':
                return this.operator;
            case 'executing':
                return `${this.left.toString('resolved')} ${this.operator} ${this.right.toString('resolved')}`;
            case 'resolved':
                return resolveNode(this).toString();
        }
    }
}
