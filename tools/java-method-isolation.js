// Diagnostic only: retain API signatures and constructors, replace method bodies.
function closingBrace(source, start) {
  let depth = 1, quote = null;
  for (let i = start + 1; i < source.length; i++) {
    const character = source[i];
    if (quote) {
      if (character === "\\") i++;
      else if (character === quote) quote = null;
    } else if (character === '"' || character === "'") quote = character;
    else if (character === "{") depth++;
    else if (character === "}" && --depth === 0) return i;
  }
  throw new Error("Unclosed diagnostic source");
}

export function isolateJavaMethods(files) {
  const methods = [];
  for (const [file, source] of Object.entries(files)) {
    const pattern = /^[ \t]*((?:(?:public|private|protected|static|final)\s+)*(?:<[^>]+>\s+)?[\w.$<>?,\[\] ]+\s+\w+\s*\([^{};]*\)\s*)\{/gm;
    let match;
    while ((match = pattern.exec(source))) {
      const signature = match[1].trim();
      const name = /(\w+)\s*\(/.exec(signature)?.[1];
      if (!name || name === file.replace('.java', '')) continue;
      const normalized = signature.replace(/^(?:(?:public|private|protected|static|final)\s+)*/, '').replace(/^<[^>]+>\s+/, '');
      const returnType = normalized.slice(0, normalized.indexOf(name)).trim();
      const start = pattern.lastIndex - 1;
      const end = closingBrace(source, start);
      const stub = returnType === 'void' ? '{}' : returnType === 'boolean' ? '{ return false; }' : ['int', 'double', 'float', 'long', 'short', 'byte', 'char'].includes(returnType) ? '{ return 0; }' : '{ return null; }';
      methods.push({ file, name, start, end, stub });
      pattern.lastIndex = end + 1;
    }
  }
  const variant = (keep = () => false) => Object.fromEntries(Object.entries(files).map(([file, source]) => {
    let next = source;
    for (const method of methods.filter(item => item.file === file).reverse()) {
      if (!keep(method)) next = next.slice(0, method.start) + method.stub + next.slice(method.end + 1);
    }
    return [file, next];
  }));
  return { methods, variant };
}
