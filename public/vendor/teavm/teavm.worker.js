const TEAVM_URLS = {
  // Official TeaVM Playground assets are vendored because the CDN does not expose
  // the binary files with CORS headers when the lab is served from localhost.
  runtime: "/vendor/teavm/cdn/compiler.wasm-runtime.js",
  compiler: "/vendor/teavm/cdn/compiler.wasm",
  sdk: "/vendor/teavm/cdn/compile-classlib-teavm.bin",
  classlib: "/vendor/teavm/cdn/runtime-classlib-teavm.bin",
};

let compilerState;

async function fetchBytes(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return new Int8Array(await response.arrayBuffer());
  } catch (error) {
    throw new Error(`TeaVM: nie udało się pobrać ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function initialize() {
  const [{ load }, compilerBytes, sdk, classlib] = await Promise.all([
    import(TEAVM_URLS.runtime),
    fetchBytes(TEAVM_URLS.compiler),
    fetchBytes(TEAVM_URLS.sdk),
    fetchBytes(TEAVM_URLS.classlib),
  ]);
  const compilerModule = await load(compilerBytes);
  const compiler = compilerModule.exports.createCompiler();
  compiler.setSdk(sdk);
  compiler.setTeaVMClasslib(classlib);
  compilerState = { compiler, load };
}

function diagnosticToJson(diagnostic) {
  return {
    type: diagnostic.type,
    severity: diagnostic.severity,
    fileName: diagnostic.fileName,
    lineNumber: diagnostic.lineNumber,
    columnNumber: diagnostic.columnNumber,
    message: diagnostic.message,
  };
}

function classVersions(compiler) {
  return compiler.listOutputFiles()
    .filter((name) => name.endsWith(".class"))
    .map((fileName) => {
      const bytes = compiler.getOutputFile(fileName);
      return {
        fileName,
        majorVersion: bytes && bytes.length >= 8 ? ((bytes[6] & 0xff) << 8) | (bytes[7] & 0xff) : null,
      };
    });
}

async function compileAndRun(message) {
  const { compiler, load } = compilerState;
  const diagnostics = [];
  let phase = "javac";
  const registration = compiler.onDiagnostic((diagnostic) => diagnostics.push(diagnosticToJson(diagnostic)));
  try {
    compiler.clearSourceFiles();
    compiler.clearOutputFiles();
    for (const [fileName, source] of Object.entries(message.files || {})) compiler.addSourceFile(fileName, source);

    self.postMessage({ command: "phase", id: message.id, phase: "Kompiluję kod Java w przeglądarce…" });
    if (!compiler.compile()) {
      return { command: "result", id: message.id, ok: false, phase, diagnostics, output: "" };
    }

    const versions = classVersions(compiler);
    const tooNewClass = versions.find((entry) => entry.majorVersion > 61);
    if (tooNewClass) {
      diagnostics.push({
        severity: "warning",
        code: "JAVA_TARGET_MISMATCH",
        message: `Oficjalny kompilator TeaVM Playground wygenerował bytecode Java ${tooNewClass.majorVersion - 44}; przykłady kursu pozostają w zakresie API Java 17.`,
      });
    }

    phase = "TeaVM → WebAssembly";
    self.postMessage({ command: "phase", id: message.id, phase: "Generuję WebAssembly…" });
    if (!compiler.generateWebAssembly({ outputName: "app", mainClass: message.mainClass })) {
      return { command: "result", id: message.id, ok: false, phase, diagnostics, classVersions: versions, output: "" };
    }

    phase = "uruchamianie main()";
    self.postMessage({ command: "phase", id: message.id, phase: "Uruchamiam main()…" });
    const generatedWasm = compiler.getWebAssemblyOutputFile("app.wasm");
    if (!generatedWasm || generatedWasm.length === 0) throw new Error("TeaVM nie wygenerował app.wasm.");
    const output = [];
    const errors = [];
    const previousLog = console.log;
    const previousError = console.error;
    console.log = (...parts) => output.push(parts.map(String).join(" "));
    console.error = (...parts) => errors.push(parts.map(String).join(" "));
    try {
      const app = await load(generatedWasm);
      await app.exports.main([]);
    } finally {
      console.log = previousLog;
      console.error = previousError;
    }
    return {
      command: "result",
      id: message.id,
      ok: true,
      phase,
      diagnostics,
      classVersions: versions,
      output: output.join("\n"),
      error: errors.join("\n"),
    };
  } finally {
    if (typeof registration === "function") registration();
    else registration?.destroy?.();
  }
}

initialize()
  .then(() => self.postMessage({ command: "ready" }))
  .catch((error) => self.postMessage({ command: "init-error", error: error instanceof Error ? error.message : String(error) }));

self.addEventListener("message", async ({ data }) => {
  if (data?.command !== "compile-and-run") return;
  try {
    self.postMessage(await compileAndRun(data));
  } catch (error) {
    self.postMessage({
      command: "result",
      id: data.id,
      ok: false,
      phase: error.phase || "TeaVM",
      code: error.code || "TEAVM_ERROR",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : "",
      output: "",
    });
  }
});
