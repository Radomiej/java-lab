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

export function formatJavaSource(source) {
  let indentLevel = 0;
  const state = { inBlockComment: false };

  return source.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "";

    const leadingClosers = leadingClosingBraces(trimmed);
    const { opening, closing } = countCodeBraces(trimmed, state);
    indentLevel = Math.max(0, indentLevel - leadingClosers);
    const formatted = `${"  ".repeat(indentLevel)}${trimmed}`;
    const remainingClosers = Math.max(0, closing - leadingClosers);
    indentLevel = Math.max(0, indentLevel + opening - remainingClosers);
    return formatted;
  }).join("\n");
}

export function triggerEditorAction(editor, actionId) {
  editor.trigger("java-lab-shortcut", actionId, null);
}
