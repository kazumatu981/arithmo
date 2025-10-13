#!/usr/bin/env node
const ts = require('typescript');
const fs = require('fs');
const path = require('path');

function readAllFiles(dir, exts = ['.ts']) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readAllFiles(full, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function fileMetrics(sourceText) {
  const lines = sourceText.split(/\r?\n/);
  const total = lines.length;
  let commentLines = 0;
  let emptyLines = 0;
  let inBlock = false;
  for (const l of lines) {
    const t = l.trim();
    if (t === '') {
      emptyLines++;
      continue;
    }
    if (inBlock) {
      commentLines++;
      if (t.includes('*/')) inBlock = false;
      continue;
    }
    if (t.startsWith('//')) {
      commentLines++;
      continue;
    }
    if (t.startsWith('/*')) {
      commentLines++;
      if (!t.includes('*/')) inBlock = true;
      continue;
    }
  }
  const execLines = total - commentLines - emptyLines;
  return { total, commentLines, emptyLines, execLines };
}

function analyzeFile(filePath) {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const metrics = fileMetrics(sourceText);

  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.ESNext, true);

  const functions = [];
  const classes = [];

  function visit(node) {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node)
    ) {
      const name = node.name ? node.name.getText(sourceFile) : '<anonymous>';
      const start = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line + 1;
      const bodyText = node.getText(sourceFile);
      const fm = fileMetrics(bodyText);
      const params = node.parameters ? node.parameters.length : 0;
      const nesting = computeMaxNesting(node);
      const cc = computeCyclomatic(node);
      functions.push({ name, start, end, lines: end - start + 1, params, nesting, cyclomatic: cc, commentLines: fm.commentLines, emptyLines: fm.emptyLines, execLines: fm.execLines });
    }

    if (ts.isClassDeclaration(node)) {
      const name = node.name ? node.name.getText(sourceFile) : '<anonymous-class>';
      classes.push(name);
    }

    ts.forEachChild(node, visit);
  }

  function computeMaxNesting(node) {
    let maxDepth = 0;
    function walk(n, depth) {
      maxDepth = Math.max(maxDepth, depth);
      n.forEachChild(child => {
        if (ts.isBlock(child) || ts.isIfStatement(child) || ts.isForStatement(child) || ts.isWhileStatement(child) || ts.isForOfStatement(child) || ts.isForInStatement(child) || ts.isSwitchStatement(child) || ts.isTryStatement(child)) {
          walk(child, depth + 1);
        } else {
          walk(child, depth);
        }
      });
    }
    walk(node, 0);
    return maxDepth;
  }

  function computeCyclomatic(node) {
    let cc = 1;
    function walk(n) {
      if (ts.isIfStatement(n) || ts.isForStatement(n) || ts.isForOfStatement(n) || ts.isForInStatement(n) || ts.isWhileStatement(n) || ts.isDoStatement(n) || ts.isCaseClause(n) || ts.isConditionalExpression(n) || ts.isCatchClause(n)) {
        cc++;
      }
      if (ts.isBinaryExpression(n) && (n.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken || n.operatorToken.kind === ts.SyntaxKind.BarBarToken)) {
        cc++;
      }
      n.forEachChild(child => walk(child));
    }
    walk(node);
    return cc;
  }

  visit(sourceFile);

  return {
    filePath,
    metrics,
    functions,
    classesCount: classes.length,
    fileSize: fs.statSync(filePath).size,
  };
}

function toMarkdown(report, baseSrcDir) {
  const rel = path.relative(baseSrcDir, report.filePath).replace(/\\/g, '/');
  const fileName = path.basename(report.filePath, path.extname(report.filePath));
  let md = `# ${rel}\n\n`;
  md += `## ファイルメトリクス\n\n`;
  md += `| メトリクス       | 値               |\n`;
  md += `|------------------|------------------|\n`;
  md += `| 行数             | ${report.metrics.total}           |\n`;
  md += `| コメント行数     | ${report.metrics.commentLines}   |\n`;
  md += `| 空行数           | ${report.metrics.emptyLines}         |\n`;
  const commentRate = ((report.metrics.commentLines / report.metrics.total) * 100).toFixed(2);
  const emptyRate = ((report.metrics.emptyLines / report.metrics.total) * 100).toFixed(2);
  md += `| コメント率       | ${commentRate}%    |\n`;
  md += `| 空行率  | ${emptyRate}% |\n`;
  md += `| 実行行数         | ${report.metrics.execLines}       |\n`;
  md += `| 関数/メソッド数  | ${report.functions.length}|\n`;
  md += `| クラス数         | ${report.classesCount}       |\n`;
  md += `| ファイルサイズ   | ${report.fileSize} バイト |\n\n`;

  md += `## 関数/メソッドメトリクス\n\n`;
  md += `| 関数/メソッド名 | 行数 | コメント行数 | 空行数 | コメント率 | 空行率 | 実行行数 | 引数の数 | ネストの深さ | Cyclomatic Complexity |\n`;
  md += `|------------------|------|--------------|--------|------------|--------|----------|----------|--------------|-----------------------|\n`;
  for (const f of report.functions) {
    const total = f.lines;
    const cRate = ((f.commentLines / Math.max(1, total)) * 100).toFixed(2);
    const eRate = ((f.emptyLines / Math.max(1, total)) * 100).toFixed(2);
    md += `| ${f.name} | ${total} | ${f.commentLines} | ${f.emptyLines} | ${cRate}% | ${eRate}% | ${f.execLines} | ${f.params} | ${f.nesting} | ${f.cyclomatic} |\n`;
  }

  // readability
  md += `\n## 可読性評価\n`;
  const avgFuncLines = report.functions.length ? (report.functions.reduce((s, x) => s + x.lines, 0) / report.functions.length) : 0;
  const highComplex = report.functions.filter(f => f.cyclomatic >= 10);
  const deepNest = report.functions.filter(f => f.nesting >= 3);
  let overall = '普通';
  if ((report.metrics.commentLines / report.metrics.total) < 0.05 || avgFuncLines >= 50 || highComplex.length > 0 || deepNest.length > 0) overall = '低い';
  md += `- 全体の可読性評価: ${overall}\n`;
  md += `- 評価が低い関数/メソッド:\n`;
  for (const f of [...highComplex, ...deepNest]) {
    md += `  - ${f.name}: Cyclomatic=${f.cyclomatic}, Nesting=${f.nesting}, 行数=${f.lines}\n`;
  }

  md += `\n## 改善案\n`;
  md += `- Cyclomatic Complexity が高い関数は、処理ごとに小さな関数に分割してください。\n`;
  md += `- ネストが深い箇所は早期リターンやガード節を使ってネストを浅くしてください。\n`;
  md += `- コメント率が低い場合、主要な処理の意図を説明するコメントや JSDoc を追加してください。\n`;

  return { md, rel, fileName };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const base = path.resolve(process.cwd(), 'src');
  const outBase = path.resolve(process.cwd(), 'metrics');
  ensureDir(outBase);
  const files = readAllFiles(base, ['.ts']);
  for (const f of files) {
    try {
      const report = analyzeFile(f);
      const { md, rel, fileName } = toMarkdown(report, base);
      const outPath = path.join(outBase, rel.replace(/\.ts$/, '_metrics_report.md'));
      ensureDir(path.dirname(outPath));
      fs.writeFileSync(outPath, md, 'utf8');
      console.log('Wrote', outPath);
    } catch (e) {
      console.error('Failed', f, e);
    }
  }
}

if (require.main === module) main();
