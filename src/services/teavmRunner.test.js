import { describe, expect, it, vi } from "vitest";
import { createTeaVMRunner } from "./teavmRunner.js";

function createWorkerHarness({ stalled = false, initStalled = false } = {}) {
  const listeners = new Set();
  const worker = {
    emit: (data) => listeners.forEach((listener) => listener({ data })),
    postMessage: vi.fn((message) => {
      if (message.command === "initialize" && !initStalled) {
        queueMicrotask(() => listeners.forEach((listener) => listener({ data: { command: "ready" } })));
      }
      if (message.command === "compile-and-run" && !stalled) {
        queueMicrotask(() => listeners.forEach((listener) => listener({
          data: { command: "result", id: message.id, ok: true, output: "Ada 1\nZaliczone" },
        })));
      }
    }),
    addEventListener: vi.fn((type, listener) => { if (type === "message") listeners.add(listener); }),
    removeEventListener: vi.fn((_type, listener) => listeners.delete(listener)),
    terminate: vi.fn(),
  };
  return worker;
}

describe("TeaVM browser runner", () => {
  it("ignores late frames and errors from a previous game run", async () => {
    const worker = createWorkerHarness();
    const runner = createTeaVMRunner({ workerFactory: () => worker });
    await runner.run({ files: {}, mainClass: "Main", mode: "game" });
    await runner.run({ files: {}, mainClass: "Main", mode: "game" });
    const received = vi.fn();
    window.addEventListener("java-lab-game-draw", received);
    window.addEventListener("java-lab-game-error", received);
    try {
      worker.emit({ command: "game-draw", gameId: 1, op: "frame", commands: [] });
      worker.emit({ command: "game-error", gameId: 1, error: "Old game" });
      expect(received).not.toHaveBeenCalled();
      worker.emit({ command: "game-draw", gameId: 2, op: "frame", commands: [] });
      expect(received).toHaveBeenCalledOnce();
    } finally {
      window.removeEventListener("java-lab-game-draw", received);
      window.removeEventListener("java-lab-game-error", received);
      runner.dispose();
    }
  });
  it("preserves console output from the first game frame in the run result", async () => {
    const worker = createWorkerHarness({ stalled: true });
    const runner = createTeaVMRunner({ workerFactory: () => worker });
    const request = runner.run({ files: {}, mainClass: "Main", mode: "game" });
    await new Promise(resolve => setTimeout(resolve, 5));
    const message = worker.postMessage.mock.calls.map(([value]) => value).find(value => value.command === "compile-and-run");
    worker.emit({ command: "game-output", level: "log", output: "Pierwszy update" });
    worker.emit({ command: "result", id: message.id, ok: true, output: "Start" });
    expect((await request).output).toBe("Start\nPierwszy update");
    runner.dispose();
  });
  it("anuluje kompilację przy zmianie zadania", async () => {
    const worker = createWorkerHarness({ stalled: true });
    const runner = createTeaVMRunner({ workerFactory: () => worker });
    const request = runner.run({ files: {}, mainClass: "Main", mode: "game" });
    const assertion = expect(request).rejects.toMatchObject({ code: "ABORTED" });
    await new Promise(resolve => setTimeout(resolve, 5));
    runner.stopGame();
    await assertion;
    expect(worker.terminate).toHaveBeenCalledOnce();
    runner.dispose();
  });
  it("ogranicza czas ładowania kompilatora i umożliwia ponowną próbę", async () => {
    const stuck = createWorkerHarness({ initStalled: true });
    const healthy = createWorkerHarness();
    const factory = vi.fn().mockReturnValueOnce(stuck).mockReturnValueOnce(healthy);
    const runner = createTeaVMRunner({ workerFactory: factory, timeoutMs: 20 });
    await expect(runner.run({ files: {}, mainClass: "Main" })).rejects.toMatchObject({ code: "COMPILER_UNAVAILABLE" });
    expect(stuck.terminate).toHaveBeenCalledOnce();
    await expect(runner.run({ files: {}, mainClass: "Main" })).resolves.toMatchObject({ ok: true });
    runner.dispose();
  });
  it("kończy runtime, który przestał wysyłać klatki", async () => {
    vi.useFakeTimers();
    const worker = createWorkerHarness();
    const runner = createTeaVMRunner({ workerFactory: () => worker });
    const onError = vi.fn();
    window.addEventListener("java-lab-game-error", onError);
    const hidden = Object.getOwnPropertyDescriptor(document, "hidden");
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    try {
      await runner.run({ files: {}, mainClass: "Main", mode: "game" });
      await vi.advanceTimersByTimeAsync(16000);
      expect(worker.terminate).toHaveBeenCalledOnce();
      expect(onError.mock.calls[0][0].detail.error).toContain("przestała odpowiadać");
    } finally {
      runner.dispose();
      window.removeEventListener("java-lab-game-error", onError);
      if (hidden) Object.defineProperty(document, "hidden", hidden);
      else delete document.hidden;
      vi.useRealTimers();
    }
  });
  it("odtwarza worker po timeout zablokowanego programu", async () => {
    const stuck = createWorkerHarness({ stalled: true });
    const healthy = createWorkerHarness();
    const workerFactory = vi.fn().mockReturnValueOnce(stuck).mockReturnValueOnce(healthy);
    const runner = createTeaVMRunner({ workerFactory, timeoutMs: 20 });
    await expect(runner.run({ files: {}, mainClass: "Main" })).rejects.toMatchObject({ code: "TIMEOUT" });
    expect(stuck.terminate).toHaveBeenCalledOnce();
    await expect(runner.run({ files: {}, mainClass: "Main" })).resolves.toMatchObject({ ok: true });
    expect(workerFactory).toHaveBeenCalledTimes(2);
    runner.dispose();
  });
  it("przekazuje błąd pętli gry oraz rozmiar canvasu", async () => {
    const worker = createWorkerHarness();
    const runner = createTeaVMRunner({ workerFactory: () => worker });
    await runner.run({ files: {}, mainClass: "Main", mode: "game" });
    const onError = vi.fn();
    window.addEventListener("java-lab-game-error", onError);
    worker.emit({ command: "game-error", error: "Błąd komponentu" });
    expect(onError.mock.calls[0][0].detail.error).toBe("Błąd komponentu");
    window.dispatchEvent(new CustomEvent("java-lab-game-resize", { detail: { width: 800, height: 450 } }));
    expect(worker.postMessage).toHaveBeenLastCalledWith({ command: "game-resize", width: 800, height: 450 });
    runner.stopGame();
    expect(worker.postMessage).toHaveBeenLastCalledWith({ command: "game-stop" });
    window.removeEventListener("java-lab-game-error", onError);
    runner.dispose();
  });
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
