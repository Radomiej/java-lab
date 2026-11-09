function countCodeBraces(line, state) {
  let opening = 0;
  let closing = 0;
  let quote = null;
  let escaped = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (state.inBlockComment) {
      if (character === "*" && nextCharacter === "/") {
        state.inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "/" && nextCharacter === "/") {
      break;
    } else if (character === "/" && nextCharacter === "*") {
      state.inBlockComment = true;
      index += 1;
    } else if (character === "{") {
      opening += 1;
    } else if (character === "}") {
      closing += 1;
    }
  }

  return { opening, closing };
}

function leadingClosingBraces(line) {
  let count = 0;
  for (const character of line) {
    if (character !== "}") break;
    count += 1;
  }
  return count;
}

// Rozdziela <> generyków od porównań i rozstawia '?' operatora trójargumentowego.
// Generyk: identyfikator z wielkiej litery przed '<' i typ/wildcard zaraz po.
function angleSpacing(source) {
  let out = "";
  let genericDepth = 0;
  for (let i = 0; i < source.length; i += 1) {
    const character = source[i];
    if (character === "<" && source[i + 1] !== "=" && source[i + 1] !== "<") {
      const before = source.slice(0, i).match(/([A-Za-z_$][\w$]*)\s*$/);
      const after = source.slice(i + 1).match(/^\s*([A-Za-z_$?>])/);
      if (before && /^[A-Z]/.test(before[1]) && after && /^[A-Z?>]/.test(after[1])) {
        genericDepth += 1;
        out += "<";
      } else out += " < ";
    } else if (character === ">" && !/[-=>]/.test(source[i - 1] || "")) {
      if (genericDepth > 0) {
        genericDepth -= 1;
        out += ">";
      } else out += " > ";
    } else if (character === "?" && genericDepth === 0) {
      out += " ? ";
    } else out += character;
  }
  return out;
}

// Spacje w stylu domyślnego IntelliJ dla Javy — bez ruszania literalów i komentarzy.
function spaceJavaCode(code) {
  const slots = [];
  const stash = (text) => { slots.push(text); return `${slots.length - 1}`; };
  let s = code.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?(?:\*\/|$)/g, stash);
  const comment = s.match(/\/\/.*$/);
  if (comment) s = s.slice(0, comment.index).trimEnd();

  s = s.replace(/\s*\.\s*/g, ".").replace(/@\s+/g, "@")
    .replace(/\s*(::|\+\+|--)\s*/g, (m, op) => stash(op))
    .replace(/\s*->\s*/g, () => stash(" -> "));
  const multiOps = [">>>=", ">>>", ">>=", "<<=", "<<", ">>", "&&", "||", "==", "!=", ">=", "<=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^="];
  for (const op of multiOps) s = s.split(op).join(` ${stash(op)} `);
  s = s.replace(/!(?!=)\s*/g, "!").replace(/\s*~\s*/g, "~");
  s = s.replace(/\s*([=+%^])\s*/g, " $1 ");
  s = s.replace(/([\w)\]]+)\s*([-&|*/])\s*/g, "$1 $2 ");
  s = s.replace(/([(,\[=?:]|^|\b(?:return|throw|case)\b)(\s*)-\s+/g, "$1$2-");
  s = angleSpacing(s);
  s = s.replace(/\s*,\s*/g, ", ").replace(/\s*;\s*/g, "; ");
  s = s.replace(/(for\s*\([^)]*?)\s*:\s*([^)]*\))/g, "$1 : $2");
  if (/ \? /.test(s) && !/\b(case|default)\b/.test(s)) s = s.replace(/\s*:\s*/g, " : ");
  s = s.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/\s+\[/g, "[")
    .replace(/; ;/g, ";;").replace(/\(\s*\)/g, "()")
    .replace(/([\w$\]]+)\s*\(/g, "$1(")
    .replace(/](?=[A-Za-z_$])/g, "] ").replace(/>(?=[A-Za-z_$])/g, "> ");
  s = s.replace(/\b(if|for|while|switch|catch|synchronized|try|assert|return|throw|new)\(/g, "$1 (")
    .replace(/\)\s*\{/g, ") {")
    .replace(/([)\w$=])\s*\{/g, "$1 {")
    .replace(/\}\s*(else|catch|finally|while|try)\b/g, "} $1");
  s = s.replace(/\((int|long|double|float|boolean|char|byte|short|String|var|[A-Z][\w$]*(?:<[^>]*>)?(?:\[\])*)\)\s*(?=[\w$'(!~])/g, "($1) ");
  s = s.replace(/\)\s*(?=[A-Za-z_$])/g, ") ");
  s = s.replace(/ {2,}/g, " ").trimEnd();
  if (comment) s = `${s} ${comment[0]}`;
  return s.replace(/(\d+)/g, (m, i) => slots[+i]);
}

export function formatJavaSource(source) {
  let indentLevel = 0;
  const state = { inBlockComment: false };

  return source.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "";

    const wasInComment = state.inBlockComment;
    const leadingClosers = leadingClosingBraces(trimmed);
    const { opening, closing } = countCodeBraces(trimmed, state);
    indentLevel = Math.max(0, indentLevel - leadingClosers);
    const body = wasInComment || trimmed.startsWith("//") ? trimmed : spaceJavaCode(trimmed);
    const formatted = `${"    ".repeat(indentLevel)}${body}`;
    const remainingClosers = Math.max(0, closing - leadingClosers);
    indentLevel = Math.max(0, indentLevel + opening - remainingClosers);
    return formatted;
  }).join("\n");
}

export function triggerEditorAction(editor, actionId) {
  editor.trigger("java-lab-shortcut", actionId, null);
}
