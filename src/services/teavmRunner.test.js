import { describe, expect, it, vi } from "vitest";
import { createTeaVMRunner } from "./teavmRunner.js";

function createWorkerHarness() {
  const listeners = new Set();
  const worker = {
    postMessage: vi.fn((message) => {
      if (message.command === "initialize") {
        queueMicrotask(() => listeners.forEach((listener) => listener({ data: { command: "ready" } })));
      }
      if (message.command === "compile-and-run") {
        queueMicrotask(() => listeners.forEach((listener) => listener({
          data: { command: "result", id: message.id, ok: true, output: "Ada 1\nZaliczone" },
        })));
      }
    }),
    addEventListener: vi.fn((_type, listener) => listeners.add(listener)),
    removeEventListener: vi.fn((_type, listener) => listeners.delete(listener)),
    terminate: vi.fn(),
  };
  return worker;
}

describe("TeaVM browser runner", () => {
  it("compiles and runs a Java program without a server", async () => {
    const worker = createWorkerHarness();
    const runner = createTeaVMRunner({ workerFactory: () => worker });

    await expect(runner.run({
      files: { "Main.java": "class Main {}" },
      mainClass: "Main",
      mode: "console",
    })).resolves.toMatchObject({ ok: true, output: "Ada 1\nZaliczone" });

    expect(worker.postMessage).toHaveBeenNthCalledWith(2, expect.objectContaining({
      command: "compile-and-run",
      files: { "Main.java": "class Main {}" },
      mainClass: "Main",
    }));
    runner.dispose();
    expect(worker.terminate).toHaveBeenCalledTimes(1);
  });
});
