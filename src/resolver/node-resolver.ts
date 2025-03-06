import { SingleNode, ParenNode, BinaryNode, ParserNode } from '../parser';
import { ResolveEventHandler } from './resolve-event-handler';
import { stringToNum } from './string-to-num';

/**
 * 構文木を解決して結果を返却する
 * @param rootNode 構文木
 * @param eventHandler イベントハンドラ
 * @returns 計算結果
 */
export function resolveNode(rootNode: ParserNode, eventHandler?: ResolveEventHandler): number {
    if (rootNode.nodeType === 'single') {
        return resolveSingleNode(rootNode as SingleNode, eventHandler);
    } else if (rootNode.nodeType === 'binary') {
        return resolveBinaryNode(rootNode as BinaryNode as BinaryNode, eventHandler);
    } else {
        return resolveParenNode(rootNode as ParenNode, eventHandler);
    }
}

/**
 * 単項のノードを解決して結果を返却する
 * @param node 単項のノード
 * @param eventHandler イベントハンドラ
 * @returns 計算結果
 */
function resolveSingleNode(node: SingleNode, eventHandler?: ResolveEventHandler): number {
    eventHandler = eventHandler || (() => {});
    let value = stringToNum(node.value);
    if (node.isNegative) {
        value *= -1;
    }

    eventHandler('read_num', {
        node: node,
        result: value,
    });
    return value;
}

/**
 * 構文木を解決して結果を返却する(演算子ノードの中身を解決する)
 * @param node 2項演算子のノード
 * @param eventHandler イベントハンドラ
 * @returns 計算結果
 */
function resolveBinaryNode(node: BinaryNode, eventHandler?: ResolveEventHandler): number {
    eventHandler = eventHandler || (() => {});
    const left = resolveNode(node.left, eventHandler);
    const right = resolveNode(node.right, eventHandler);
    let calculate = (number1: number, number2: number) => number1 + number2;
    switch (node.operator) {
        case '+':
            calculate = (number1: number, number2: number) => number1 + number2;
            break;
        case '-':
            calculate = (number1: number, number2: number) => number1 - number2;
            break;
        case '*':
            calculate = (number1: number, number2: number) => number1 * number2;
            break;
        case '/':
            calculate = (number1: number, number2: number) => number1 / number2;
            break;
    }

    const result = calculate(left, right);
    eventHandler!('operate', {
        node: node,
        operator: node.operator,
        left,
        right,
        result,
    });

    return result;
}

/**
 * 構文木を解決して結果を返却する(カッコノードの中身を解決する)
 * @param node パース木
 * @param eventHandler イベントハンドラ
 * @returns パース結果
 */
function resolveParenNode(node: ParenNode, eventHandler?: ResolveEventHandler): number {
    eventHandler = eventHandler || (() => {});
    const result = resolveNode(node.childRoot, eventHandler);
    eventHandler!('execute_paren', {
        node: node,
        result,
    });
    return result;
}
