# Arithmo

Arithmo は、四則演算を解析して式を評価するためのライブラリです。

## インストール

```bash
npm install arithmo
```

## 使い方

```typescript
import { tokenize, parse } from 'arithmo';

const tokens = tokenize('(1 + 2) * 3');
console.log(tokens.map((t) => t.toString()));
// [ '(', '1', '+',  '2', ')', '*', '3' ]

const tree = parse(tokens);
console.log(tree.toNodeInfo());
// 構文の木構造がJSON形式で表示される。
```

## ライセンス

MIT
