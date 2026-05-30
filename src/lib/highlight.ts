// Tiny, zero-dependency syntax highlighter for SQL / JS / CSS / HTML.
// Returns HTML using the .sql-* color classes defined in globals.css.

export type CodeLang = "sql" | "javascript" | "css" | "html";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const SQL_KW = [
  "SELECT","FROM","WHERE","AND","OR","NOT","IN","BETWEEN","LIKE","IS","NULL",
  "ORDER","BY","GROUP","HAVING","LIMIT","OFFSET","DISTINCT","AS","ON","JOIN",
  "INNER","LEFT","RIGHT","FULL","OUTER","CROSS","SELF","UNION","ALL","WITH","RECURSIVE",
  "INSERT","INTO","VALUES","UPDATE","SET","DELETE","TRUNCATE","CREATE","REPLACE","VIEW",
  "INDEX","DROP","TABLE","EXPLAIN","START","TRANSACTION","COMMIT","ROLLBACK",
  "CASE","WHEN","THEN","ELSE","END","IF","EXISTS","ANY","SOME","DATE","INTERVAL","DAY","MONTH","YEAR",
  "OVER","PARTITION","ASC","DESC","USING","NULLIF","IFNULL",
];
const SQL_FN = [
  "COUNT","SUM","AVG","MIN","MAX","CONCAT","CONCAT_WS","LENGTH","CHAR_LENGTH","SUBSTRING","SUBSTR","MID",
  "UPPER","LOWER","UCASE","LCASE","TRIM","NOW","CURDATE","CURTIME","DATEDIFF","DATE_ADD","DATE_SUB",
  "DATE_FORMAT","LOCATE","INSTR","ROW_NUMBER","RANK","DENSE_RANK","NTILE","LAG","LEAD","COALESCE","ROUND",
];

const JS_KW = [
  "const","let","var","function","return","if","else","for","while","do","switch","case","default",
  "break","continue","new","class","extends","super","this","typeof","instanceof","in","of","try",
  "catch","finally","throw","async","await","yield","import","export","from","default","delete","void",
  "null","undefined","true","false","NaN",
];

function wrapKeywords(out: string, words: string[], cls: string): string {
  const re = new RegExp(`\\b(${words.join("|")})\\b`, "g");
  return out.replace(re, `<span class="${cls}">$1</span>`);
}

function common(out: string): string {
  // strings (single or double quoted) and template literals
  out = out.replace(/(['"`])((?:\\.|(?!\1).)*)\1/g, (m) => `<span class="sql-str">${m}</span>`);
  // numbers
  out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="sql-num">$1</span>');
  return out;
}

function highlightSql(code: string): string {
  let out = esc(code);
  out = out.replace(/('(?:[^']|'')*')/g, (m) => `<span class="sql-str">${m}</span>`);
  out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="sql-num">$1</span>');
  out = out.replace(/(--[^\n]*)/g, '<span class="sql-com">$1</span>');
  out = wrapKeywords(out, SQL_FN, "sql-fn");
  out = wrapKeywords(out, SQL_KW, "sql-kw");
  return out;
}

function highlightJs(code: string): string {
  let out = esc(code);
  out = out.replace(/(\/\/[^\n]*)/g, '<span class="sql-com">$1</span>');
  out = common(out);
  out = wrapKeywords(out, JS_KW, "sql-kw");
  return out;
}

function highlightCss(code: string): string {
  let out = esc(code);
  out = out.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sql-com">$1</span>');
  // property names (word before a colon)
  out = out.replace(/([\w-]+)(\s*:)/g, '<span class="sql-fn">$1</span>$2');
  // at-rules and selectors hint
  out = out.replace(/(@[\w-]+)/g, '<span class="sql-kw">$1</span>');
  out = out.replace(/(['"][^'"]*['"])/g, (m) => `<span class="sql-str">${m}</span>`);
  out = out.replace(/\b(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|deg|fr)?)\b/g, '<span class="sql-num">$1</span>');
  return out;
}

function highlightHtml(code: string): string {
  let out = esc(code);
  // comments
  out = out.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="sql-com">$1</span>');
  // tags: &lt;tagname ... &gt;
  out = out.replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="sql-tag">$2</span>');
  // attribute names
  out = out.replace(/([\w-]+)(=)(&quot;[^&]*&quot;|"[^"]*")/g, '<span class="sql-attr">$1</span>$2<span class="sql-str">$3</span>');
  return out;
}

export function highlight(code: string, lang: CodeLang = "sql"): string {
  switch (lang) {
    case "javascript":
      return highlightJs(code);
    case "css":
      return highlightCss(code);
    case "html":
      return highlightHtml(code);
    default:
      return highlightSql(code);
  }
}
