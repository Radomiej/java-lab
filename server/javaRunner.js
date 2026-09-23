import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, extname, isAbsolute, join, normalize, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

export const MAX_SOURCE_BYTES = 240_000;
export const MAX_FILES = 24;
export const runtimePolicy = {
  timeoutMs: 8_000,
  maxOutputBytes: 80_000,
};

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
export const runtimeRoot = resolve(moduleDirectory, ".runtime");

function byteLength(value) {
  return Buffer.byteLength(value, "utf8");
}

export function normalizeFiles(files) {
  if (!files || typeof files !== "object" || Array.isArray(files)) {
    throw new Error("Pliki źródłowe muszą być obiektem.");
  }

  const entries = Object.entries(files);
  if (entries.length === 0) {
    throw new Error("Dodaj przynajmniej jeden plik Java.");
  }
  if (entries.length > MAX_FILES) {
    throw new Error(`Możesz przesłać najwyżej ${MAX_FILES} plików.`);
  }

  let totalBytes = 0;
  const normalized = {};
  for (const [fileName, content] of entries) {
    if (typeof content !== "string") {
      throw new Error(`Zawartość pliku ${fileName} musi być tekstem.`);
    }
    const slashPath = fileName.replaceAll("\\", "/");
    const safePath = normalize(slashPath).replaceAll("\\", "/");
    if (
      !fileName ||
      isAbsolute(slashPath) ||
      safePath === "." ||
      safePath.startsWith("../") ||
      safePath.includes("/../") ||
      safePath.includes("\0") ||
      extname(safePath).toLowerCase() !== ".java"
    ) {
      throw new Error(`Plik ${fileName} nie jest bezpieczną ścieżką Java.`);
    }

    totalBytes += byteLength(content);
    if (totalBytes > MAX_SOURCE_BYTES) {
      throw new Error(`Kod źródłowy przekracza limit ${MAX_SOURCE_BYTES} bajtów.`);
    }
    normalized[safePath] = content;
  }
  return normalized;
}

function trimOutput(buffer) {
  const text = buffer.toString("utf8");
  if (byteLength(text) <= runtimePolicy.maxOutputBytes) {
    return { text, truncated: false };
  }
  return {
    text: `${text.slice(0, runtimePolicy.maxOutputBytes)}\n[log skrócony przez Java Lab]`,
    truncated: true,
  };
}

function runProcess(command, args, options = {}) {
  return new Promise((resolveProcess) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      windowsHide: true,
      shell: false,
      env: options.env || process.env,
    });
    const stdout = [];
    const stderr = [];
    let timedOut = false;
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolveProcess(result);
    };
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, options.timeoutMs || runtimePolicy.timeoutMs);

    child.stdout?.on("data", (chunk) => stdout.push(chunk));
    child.stderr?.on("data", (chunk) => stderr.push(chunk));
    child.on("error", (error) => {
      clearTimeout(timer);
      finish({ code: null, error, timedOut, stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr) });
    });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      finish({ code, signal, error: null, timedOut, stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr) });
    });
  });
}

function runnerError(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, details);
  return error;
}

function processError(result, toolName) {
  if (result.error?.code === "ENOENT") {
    return runnerError("JDK_NOT_FOUND", `Nie znaleziono programu ${toolName}. Zainstaluj JDK 17 i dodaj jego katalog bin do PATH.`);
  }
  if (result.timedOut) {
    return runnerError("TIMEOUT", "Program przekroczył limit czasu i został zatrzymany.");
  }
  return null;
}

async function writeSourceFiles(sourceRoot, files) {
  await Promise.all(
    Object.entries(files).map(async ([fileName, content]) => {
      const destination = resolve(sourceRoot, fileName);
      const relativePath = relative(sourceRoot, destination);
      if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
        throw runnerError("UNSAFE_PATH", `Plik ${fileName} nie jest bezpieczną ścieżką Java.`);
      }
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, content, "utf8");
    }),
  );
}

function processText(result) {
  const out = trimOutput(result.stdout);
  const err = trimOutput(result.stderr);
  const output = [out.text, err.text].filter(Boolean).join(out.text && err.text ? "\n" : "");
  return { output, truncated: out.truncated || err.truncated };
}

export async function compileJava({ files, mainClass = "Main", mode = "console" }) {
  const normalizedFiles = normalizeFiles(files);
  if (typeof mainClass !== "string" || !/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(mainClass)) {
    throw runnerError("INVALID_MAIN", "Nazwa klasy startowej jest niepoprawna.");
  }

  const jobId = randomUUID();
  const jobRoot = join(runtimeRoot, "jobs", jobId);
  const sourceRoot = join(jobRoot, "source");
  const classesRoot = join(jobRoot, "classes");
  const jarPath = join(jobRoot, "app.jar");
  await mkdir(sourceRoot, { recursive: true });
  await mkdir(classesRoot, { recursive: true });

  try {
    await writeSourceFiles(sourceRoot, normalizedFiles);
    const sourcePaths = Object.keys(normalizedFiles).map((fileName) => join(sourceRoot, fileName));
    const compile = await runProcess(
      "javac",
      ["--release", "17", "-encoding", "UTF-8", "-d", classesRoot, ...sourcePaths],
      { cwd: jobRoot },
    );
    const compileFailure = processError(compile, "javac");
    if (compileFailure) throw compileFailure;
    const compileText = processText(compile);
    if (compile.code !== 0) {
      return {
        ok: false,
        phase: "compile",
        output: compileText.output || "Kompilacja nie powiodła się.",
        jobId,
        jarUrl: null,
        className: mainClass,
      };
    }

    const jar = await runProcess(
      "jar",
      ["--create", "--file", jarPath, "--main-class", mainClass, "-C", classesRoot, "."],
      { cwd: jobRoot },
    );
    const jarFailure = processError(jar, "jar");
    if (jarFailure) throw jarFailure;
    if (jar.code !== 0) {
      const jarText = processText(jar);
      throw runnerError("JAR_FAILED", jarText.output || "Nie udało się przygotować JAR-a.");
    }

    if (mode === "swing") {
      return {
        ok: true,
        phase: "compiled",
        output: "JAR jest gotowy. Uruchom go w panelu CheerpJ.",
        jobId,
        jarUrl: `/runtime/jobs/${jobId}/app.jar`,
        className: mainClass,
      };
    }

    const run = await runProcess("java", ["-cp", classesRoot, mainClass], { cwd: jobRoot });
    const runFailure = processError(run, "java");
    if (runFailure) throw runFailure;
    const runText = processText(run);
    return {
      ok: run.code === 0,
      phase: "run",
      output: runText.output || (run.code === 0 ? "Program zakończył się bez komunikatu." : "Program zakończył się błędem."),
      jobId,
      jarUrl: `/runtime/jobs/${jobId}/app.jar`,
      className: mainClass,
      truncated: runText.truncated,
    };
  } catch (error) {
    if (error.code === "JDK_NOT_FOUND" || error.code === "TIMEOUT") {
      await rm(jobRoot, { recursive: true, force: true });
    }
    throw error;
  }
}

export async function readRuntimeArtifact(jobId, fileName) {
  if (!/^[a-f0-9-]+$/i.test(jobId) || fileName !== "app.jar") {
    throw runnerError("NOT_FOUND", "Nie znaleziono artefaktu.");
  }
  const artifact = resolve(runtimeRoot, "jobs", jobId, fileName);
  const safeRelative = relative(runtimeRoot, artifact);
  if (safeRelative.startsWith("..") || isAbsolute(safeRelative)) {
    throw runnerError("NOT_FOUND", "Nie znaleziono artefaktu.");
  }
  return readFile(artifact);
}
