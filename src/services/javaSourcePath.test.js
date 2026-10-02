import { expect, it } from "vitest";
import { prepareJavaSources } from "../../public/vendor/teavm/source-path.js";

it("expands supplied package imports without changing standard imports", () => {
  const sources = Object.fromEntries(prepareJavaSources({
    "Component.java": "package engine; public class Component {}",
    "GameObject.java": "/* note */ package engine; public class GameObject {}",
    "Main.java": "import engine.*;\nimport java.util.*;\nclass Main {}",
  }));
  expect(sources["Main.java"]).toBe("import engine.Component;\nimport engine.GameObject;\nimport java.util.*;\nclass Main {}");
  expect(sources["Component.java"]).toBe("package engine; public class Component {}");
});
