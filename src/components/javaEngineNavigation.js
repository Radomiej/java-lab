const docs = {
  'CharacterController2D.move': 'Ustawia kierunek ruchu (`x`, `y`), nie pozycję. Silnik normalizuje kierunek, więc przekątna nie przyspiesza ruchu. `double speed` określa prędkość w pikselach na sekundę. Wariant bez speed używa 200. Kierunek (0, 0) zatrzymuje ruch. Silnik uwzględnia delta — nie mnoż kierunku przez czas. Zwraca void.\n\n```java\nrequireComponent(CharacterController2D.class).move(x, y, 120);\n```',
  'Component.requireComponent': 'Pobiera wymagany komponent z tego samego GameObject; nie tworzy nowego. `Class<T> type` określa typ: `CharacterController2D.class` oznacza klasę komponentu, a wynik T jest typu CharacterController2D. Brak komponentu powoduje `IllegalArgumentException`.\n\n```java\nCharacterController2D controller = requireComponent(CharacterController2D.class);\ncontroller.move(x, y, 120);\n```\nWywołanie łańcuchowe najpierw pobiera komponent, następnie uruchamia jego metodę move.',
  getComponent: 'Pobiera komponent podanego typu z obiektu. Zwraca null, jeśli go nie ma. Argument .class określa szukany typ.',
  addComponent: 'Dodaje komponent do obiektu i zwraca dodaną instancję.',
  hasComponent: 'Sprawdza, czy obiekt ma komponent podanego typu. Zwraca boolean.',
  isKeyDown: 'Sprawdza, czy klawisz jest obecnie wciśnięty.',
  createObject: 'Tworzy obiekt gry i dodaje go do sceny.',
};

export function resolveEngineSymbol(sources, model, position) {
  const token = model?.getWordAtPosition(position);
  if (!token) return null;
  const word = token.word;
  const file = `${word}.java`;
  if (Object.hasOwn(sources, file)) {
    const line = sources[file].split('\n').findIndex(text => new RegExp(`\\b(class|interface)\\s+${word}\\b`).test(text)) + 1;
    return {file, word, line:line || 1, column:1, signatures:[]};
  }
  const content = model.getValue?.() ?? '';
  const text = model.getLineContent?.(position.lineNumber) ?? '';
  const prefix = text.slice(0, (token.startColumn ?? text.indexOf(word) + 1) - 1);
  let owner = prefix.match(/(?:requireComponent|getComponent)\s*\(\s*(\w+)\.class\s*\)\s*\.\s*$/)?.[1];
  if (!owner) {
    const receiver = prefix.match(/(\w+)\s*\.\s*$/)?.[1];
    if (receiver) {
      if (Object.hasOwn(sources, `${receiver}.java`)) owner = receiver;
      else if (receiver === 'gameObject' && /extends\s+(Component|PlayerController2D)\b/.test(content)) owner = 'GameObject';
      else owner = content.match(new RegExp(`\\b(\\w+)\\s+${receiver}\\b`))?.[1];
    } else owner = content.match(/\bclass\s+\w+\s+extends\s+(\w+)/)?.[1] ?? content.match(/\bclass\s+(\w+)/)?.[1];
  }
  const visited = new Set();
  while (owner && Object.hasOwn(sources, `${owner}.java`) && !visited.has(owner)) {
    visited.add(owner);
    const targetFile = `${owner}.java`;
    const matches = sources[targetFile].split('\n').flatMap((text, index) => {
      const signature = text.trim().match(/^(?:public|protected)\s+.*?\([^)]*\)/)?.[0];
      return signature && new RegExp(`\\b${word}\\s*\\(`).test(signature)
        ? [{line:index + 1,column:text.indexOf(word) + 1,signature}] : [];
    });
    if (matches.length) return {file:targetFile,owner,word,line:matches[0].line,column:matches[0].column,signatures:matches.map(item => item.signature)};
    owner = sources[targetFile].match(/\bextends\s+(\w+)/)?.[1];
  }
  return null;
}

export function createEngineDefinitionProvider(sources, getModel, ownsModel = () => true) {
  return {
    provideDefinition(model, position) {
      if (!ownsModel(model)) return null;
      const symbol = resolveEngineSymbol(sources, model, position);
      if (!symbol) return null;
      return {uri:getModel(symbol.file).uri,range:{startLineNumber:symbol.line,startColumn:symbol.column,endLineNumber:symbol.line,endColumn:symbol.column + symbol.word.length}};
    },
  };
}

export function createEngineHoverProvider(sources, ownsModel = () => true) {
  return {provideHover(model, position) {
    if (!ownsModel(model)) return null;
    const symbol = resolveEngineSymbol(sources, model, position);
    if (!symbol) return null;
    const token = model.getWordAtPosition(position);
    return {range:{startLineNumber:position.lineNumber,endLineNumber:position.lineNumber,startColumn:token.startColumn,endColumn:token.endColumn},
      contents:[{value:`\`\`\`java\n${symbol.signatures.join('\n') || symbol.word}\n\`\`\``},
        {value:docs[`${symbol.owner}.${symbol.word}`] ?? docs[symbol.word] ?? `API silnika: ${symbol.file}. Ctrl+klik lub F12 otwiera źródło tylko do odczytu.`}]};
  }};
}
