import { describe, expect, it } from "vitest";
import { createJavaCompletionProvider } from "./javaIntellisense.js";

const monaco = {
  languages: {
    CompletionItemKind: {
      Keyword: "keyword",
      Class: "class",
      Function: "function",
      Method: "method",
      Variable: "variable",
      Snippet: "snippet",
    },
    CompletionItemInsertTextRule: { InsertAsSnippet: "snippet" },
  },
};

function modelFor(line) {
  return {
    getLineContent: () => line,
    getWordUntilPosition: () => ({
      word: line.trim().split(/\s+/).at(-1) || "",
      startColumn: Math.max(1, line.length),
      endColumn: line.length + 1,
    }),
  };
}

describe("Java educational IntelliSense", () => {
  it("suggests Java keywords and the main snippet", () => {
    const provider = createJavaCompletionProvider(monaco);
    const keywordResult = provider.provideCompletionItems(modelFor("pub"), {
      lineNumber: 1,
      column: 4,
    });
    const snippetResult = provider.provideCompletionItems(modelFor(""), {
      lineNumber: 1,
      column: 1,
    });

    expect(keywordResult.suggestions.map((item) => item.label)).toContain("public");
    expect(snippetResult.suggestions.map((item) => item.label)).toContain("main");
  });

  it("suggests the console shortcut while typing System.out", () => {
    const provider = createJavaCompletionProvider(monaco);
    const result = provider.provideCompletionItems(modelFor("sys"), {
      lineNumber: 1,
      column: 4,
    });

    expect(result.suggestions.map((item) => item.label)).toContain("System.out");
  });

  it("suggests console methods after System.out.", () => {
    const provider = createJavaCompletionProvider(monaco);
    const result = provider.provideCompletionItems(modelFor("System.out."), {
      lineNumber: 1,
      column: 13,
    });

    expect(result.suggestions.map((item) => item.label)).toEqual(
      expect.arrayContaining(["println", "print"]),
    );
  });
});
