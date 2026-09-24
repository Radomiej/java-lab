const JAVA_KEYWORDS = [
  ["class", "Definicja klasy"],
  ["public", "Dostęp publiczny"],
  ["private", "Dostęp tylko wewnątrz klasy"],
  ["protected", "Dostęp dla pakietu i klas potomnych"],
  ["static", "Element należący do klasy"],
  ["final", "Wartość lub klasa, której nie zmieniamy"],
  ["void", "Metoda nie zwraca wartości"],
  ["int", "Liczba całkowita"],
  ["double", "Liczba zmiennoprzecinkowa"],
  ["boolean", "Wartość true albo false"],
  ["char", "Pojedynczy znak"],
  ["String", "Tekst"],
  ["new", "Utwórz nowy obiekt"],
  ["return", "Zwróć wartość z metody"],
  ["if", "Warunek"],
  ["else", "Alternatywna gałąź warunku"],
  ["for", "Pętla for"],
  ["while", "Pętla while"],
  ["do", "Pętla do-while"],
  ["switch", "Wybór jednej z gałęzi"],
  ["case", "Gałąź instrukcji switch"],
  ["break", "Zakończ pętlę albo switch"],
  ["continue", "Przejdź do następnego obrotu pętli"],
  ["this", "Bieżący obiekt"],
  ["extends", "Dziedziczenie po klasie"],
  ["implements", "Implementowanie interfejsu"],
  ["true", "Wartość logiczna"],
  ["false", "Wartość logiczna"],
  ["null", "Brak referencji do obiektu"],
].map(([label, detail]) => ({ label, detail, type: "keyword", insertText: label }));

const JAVA_SNIPPETS = [
  {
    label: "main",
    detail: "Punkt startowy programu",
    type: "snippet",
    insertText: "public static void main(String[] args) {\n\t$0\n}",
  },
  {
    label: "println",
    detail: "Wypisz tekst i przejdź do nowej linii",
    type: "snippet",
    insertText: "System.out.println($1);",
  },
  {
    label: "for",
    detail: "Pętla z licznikiem",
    type: "snippet",
    insertText: "for (int i = 0; i < $1; i++) {\n\t$0\n}",
  },
  {
    label: "if",
    detail: "Instrukcja warunkowa",
    type: "snippet",
    insertText: "if ($1) {\n\t$0\n}",
  },
  {
    label: "class",
    detail: "Szkielet klasy",
    type: "snippet",
    insertText: "class ${1:Name} {\n\t$0\n}",
  },
];

const SYSTEM_SHORTCUTS = [
  {
    label: "System.out",
    detail: "Wyjście na konsolę",
    type: "snippet",
    insertText: "System.out",
  },
  {
    label: "System",
    detail: "Klasa systemowa Javy",
    type: "class",
    insertText: "System",
  },
];

const CONSOLE_METHODS = [
  {
    label: "println",
    detail: "System.out.println(...)",
    type: "method",
    insertText: "println($1)",
  },
  {
    label: "print",
    detail: "System.out.print(...)",
    type: "method",
    insertText: "print($1)",
  },
];

const SYSTEM_MEMBERS = [
  {
    label: "out",
    detail: "Strumień wyjściowy konsoli",
    type: "variable",
    insertText: "out",
  },
];

function contextItems(line) {
  const consoleMatch = line.match(/System\.out\.([A-Za-z]*)$/);
  if (consoleMatch) {
    return { items: CONSOLE_METHODS, filterWord: consoleMatch[1] };
  }

  const systemMatch = line.match(/System\.([A-Za-z]*)$/);
  if (systemMatch) {
    return { items: SYSTEM_MEMBERS, filterWord: systemMatch[1] };
  }

  return { items: [...SYSTEM_SHORTCUTS, ...JAVA_KEYWORDS, ...JAVA_SNIPPETS], filterWord: null };
}

export function createJavaCompletionProvider(monaco) {
  const completionKinds = monaco.languages.CompletionItemKind;
  const insertAsSnippet = monaco.languages.CompletionItemInsertTextRule?.InsertAsSnippet;
  const kindByType = {
    keyword: completionKinds.Keyword,
    snippet: completionKinds.Snippet ?? completionKinds.Function,
    method: completionKinds.Method ?? completionKinds.Function,
    variable: completionKinds.Variable,
    class: completionKinds.Class ?? completionKinds.Keyword,
  };

  return {
    triggerCharacters: [".", " ", "@"],

    provideCompletionItems(model, position) {
      const line = model.getLineContent(position.lineNumber).slice(0, position.column - 1);
      const word = model.getWordUntilPosition(position);
      const { items, filterWord } = contextItems(line);
      const query = (filterWord ?? word.word ?? "").toLowerCase();
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: items
          .filter((item) => item.label.toLowerCase().startsWith(query))
          .map((item) => ({
            ...item,
            kind: kindByType[item.type] ?? completionKinds.Keyword,
            range,
            ...(item.type === "snippet" && insertAsSnippet
              ? { insertTextRules: insertAsSnippet }
              : {}),
          })),
      };
    },
  };
}
