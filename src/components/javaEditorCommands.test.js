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
      "    public static void main(String[] args) {",
      "        System.out.println(\"Hej\");",
      "    }",
      "}",
    ].join("\n"));
  });

  it("keeps braces inside strings out of indentation calculations", () => {
    const source = [
      "class Main {",
      "System.out.println(\"{ nie otwiera bloku\");",
      "}",
    ].join("\n");

    expect(formatJavaSource(source)).toContain("    System.out.println(\"{ nie otwiera bloku\");");
    expect(formatJavaSource(source).split("\n")[2]).toBe("}");
  });

  it("adds IntelliJ-style spaces around operators and delimiters", () => {
    expect(formatJavaSource("int x=5;x=x+1;if(x==6&&x!=7){x+=2;}"))
      .toBe("int x = 5; x = x + 1; if (x == 6 && x != 7) {x += 2; }");
    expect(formatJavaSource("for(int i=0;i<x;i++){sum+=i;}"))
      .toBe("for (int i = 0; i < x; i++) {sum += i; }");
    expect(formatJavaSource("y=(a<b)?a:b;z=a*-b;return -z;"))
      .toBe("y = (a < b) ? a : b; z = a * -b; return -z;");
  });

  it("keeps generics, calls, arrays and literals intact", () => {
    expect(formatJavaSource("List<String> names=new ArrayList<>();"))
      .toBe("List<String> names = new ArrayList<>();");
    expect(formatJavaSource("int[] a={1,2,3};m(x,y,z);a[i+1]=a[i];"))
      .toBe("int[] a = {1, 2, 3}; m(x, y, z); a[i + 1] = a[i];");
    expect(formatJavaSource("String s=\"x=1 , { }\";boolean b=!ok;"))
      .toBe("String s = \"x=1 , { }\"; boolean b = !ok;");
    expect(formatJavaSource("x++;--y;int n=(int) v;"))
      .toBe("x++; --y; int n = (int) v;");
  });

  it("does not touch text after a line comment", () => {
    expect(formatJavaSource("int x=1; // y=2 {"))
      .toBe("int x = 1; // y=2 {");
  });
});
