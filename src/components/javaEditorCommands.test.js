import { describe, expect, it } from "vitest";
import { formatJavaSource } from "./javaEditorCommands.js";

describe("Java editor commands", () => {
  it("formats the indentation of Java blocks without changing the code", () => {
    const source = [
      "public class Main {",
      "public static void main(String[] args) {",
      "System.out.println(\"Hej\");",
      "}",
      "}",
    ].join("\n");

    expect(formatJavaSource(source)).toBe([
      "public class Main {",
      "  public static void main(String[] args) {",
      "    System.out.println(\"Hej\");",
      "  }",
      "}",
    ].join("\n"));
  });

  it("keeps braces inside strings out of indentation calculations", () => {
    const source = [
      "class Main {",
      "System.out.println(\"{ nie otwiera bloku\");",
      "}",
    ].join("\n");

    expect(formatJavaSource(source)).toContain("  System.out.println(\"{ nie otwiera bloku\");");
    expect(formatJavaSource(source).split("\n")[2]).toBe("}");
  });
});
