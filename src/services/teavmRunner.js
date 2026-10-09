import {prepareGameRequest} from './gameWorkspace.js';

const defaultWorkerFactory = () => new Worker("/vendor/teavm/teavm.worker.js?v=game-wrapper-13", { type: "module" });

function createRunnerError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function createTeaVMRunner({ workerFactory = defaultWorkerFactory, timeoutMs = 45_000 } = {}) {
  let worker;
  let readyPromise;
  let nextRequestId = 0;
  let generation = 0;
  const pending = new Map();
  let activeGameRequest;
  let gameWatchdog;
  let lastGameFrame = 0;
  const stopWatchdog = () => { clearInterval(gameWatchdog); gameWatchdog = undefined; };
  const onVisibilityChange = () => { lastGameFrame = Date.now(); };
  const gameInputHandler = event => {
    if (!activeGameRequest) return;
    const packet = { ...event.detail, gameId: event.detail.gameId ?? activeGameRequest.id };
    if (packet.gameId !== activeGameRequest.id) return;
    worker?.postMessage({ command: 'game-input', ...packet });
  };

  const rejectPending = (error) => {
    for (const request of pending.values()) {
      clearTimeout(request.timeoutId);
      request.reject(error);
    }
    pending.clear();
  };

  const resetWorker = () => {
    stopWatchdog();
    worker?.terminate();
    if (globalThis.__javaLabTeaVMWorker === worker) delete globalThis.__javaLabTeaVMWorker;
    window.removeEventListener("java-lab-game-input", gameInputHandler);
    window.removeEventListener("java-lab-game-resize", gameResizeHandler);
    window.removeEventListener("java-lab-game-debug", gameDebugHandler);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    worker = undefined;
    readyPromise = undefined;
    activeGameRequest = undefined;
  };

  const handleWorkerMessage = ({ data }) => {
    if (data?.gameId !== undefined && data.gameId !== activeGameRequest?.id) return;
    if (data?.command === "ready") {
      return;
    }
    if (data?.command === "init-error") {
      return;
    }
    if (data.command === "game-draw") {
      if (!activeGameRequest) return;
      lastGameFrame = Date.now();
      activeGameRequest?.onGameCommand?.(data);
      window.dispatchEvent(new CustomEvent("java-lab-game-draw", { detail: data }));
      return;
    }
    if (data.command === "game-error") {
      if (!activeGameRequest) return;
      stopWatchdog();
      window.dispatchEvent(new CustomEvent("java-lab-game-error", { detail: data }));
      return;
    }
    if (data.command === "game-output") {
      if (!activeGameRequest) return;
      if (!activeGameRequest.started) {
        activeGameRequest.startupOutput.push(data.output);
        return;
      }
      window.dispatchEvent(new CustomEvent("java-lab-game-output", { detail: data }));
      return;
    }
    if (!data?.id) return;
    const request = pending.get(data.id);
    if (!request) return;
    if (data.command === "phase") {
      request.onStage?.(data.phase);
      return;
    }
    if (data.command === "result") {
      clearTimeout(request.timeoutId);
      pending.delete(data.id);
      if (activeGameRequest?.id === data.id) {
        data.output = [data.output, ...activeGameRequest.startupOutput].filter(Boolean).join("\n");
        activeGameRequest.startupOutput = [];
        activeGameRequest.started = true;
        if (!data.ok) activeGameRequest = undefined;
      }
      if (data.ok && activeGameRequest) {
        lastGameFrame = Date.now();
        stopWatchdog();
        gameWatchdog = setInterval(() => {
          if (document.hidden || Date.now() - lastGameFrame < 15000) return;
          resetWorker();
          window.dispatchEvent(new CustomEvent("java-lab-game-error", {
            detail: { error: "Gra przestała odpowiadać. Sprawdź pętle w update() i uruchom ponownie." },
          }));
        }, 1000);
      }
      request.resolve(data);
    }
  };

  const ensureWorker = () => {
    if (worker) return readyPromise;
    worker = workerFactory();
    globalThis.__javaLabTeaVMWorker = worker;
    readyPromise = new Promise((resolve, reject) => {
      worker.addEventListener("message", (event) => {
        if (event.data?.command === "ready") resolve();
        if (event.data?.command === "init-error") reject(createRunnerError("COMPILER_UNAVAILABLE", event.data.error));
      });
      worker.addEventListener("error", (event) => reject(createRunnerError(
        "COMPILER_UNAVAILABLE",
        event.message || "TeaVM worker zakończył się błędem.",
      )));
    });
    worker.addEventListener("message", handleWorkerMessage);
    worker.addEventListener("error", (event) => {
      rejectPending(createRunnerError("COMPILER_UNAVAILABLE", event.message || "TeaVM worker zakończył się błędem."));
    });
    window.addEventListener("java-lab-game-input", gameInputHandler);
    window.addEventListener("java-lab-game-resize", gameResizeHandler);
    window.addEventListener("java-lab-game-debug", gameDebugHandler);
    document.addEventListener("visibilitychange", onVisibilityChange);
    worker.postMessage({ command: "initialize" });
    return readyPromise;
  };

  return {
    async run(payload, { onStage, onGameCommand, signal, timeout = timeoutMs } = {}) {
      payload = prepareGameRequest(payload);
      const runGeneration = generation;
      stopWatchdog();
      let initializationTimeout;
      try {
        await Promise.race([
          Promise.all([ensureWorker(),payload.mode==='game'?getGameAssetsReady():Promise.resolve()]),
          new Promise((_, reject) => {
            initializationTimeout = setTimeout(() => reject(createRunnerError(
              "COMPILER_UNAVAILABLE", "Nie udało się załadować kompilatora TeaVM w wyznaczonym czasie.",
            )), timeout);
          }),
        ]);
      } catch (error) {
        if (runGeneration === generation) resetWorker();
        throw error;
      } finally {
        clearTimeout(initializationTimeout);
      }
      if (runGeneration !== generation) throw createRunnerError("ABORTED", "Uruchomienie zostało anulowane po zmianie zadania.");
      if (signal?.aborted) throw createRunnerError("ABORTED", "Uruchamianie programu zostało przerwane.");
      const id = ++nextRequestId;
      activeGameRequest = payload.mode === "game" ? { id, onGameCommand, startupOutput: [], started: false } : undefined;
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          const error = createRunnerError("TIMEOUT", "Kompilacja lub wykonanie programu trwało zbyt długo. Spróbuj ponownie po poprawieniu kodu.");
          rejectPending(error);
          resetWorker();
        }, timeout);
        pending.set(id, { resolve, reject, timeoutId, onStage, onGameCommand });
        worker.postMessage({ command: "compile-and-run", id, ...payload });
        const canvas = document.querySelector(".game-canvas");
        if (canvas) worker.postMessage({ command: "game-resize", width: canvas.clientWidth, height: canvas.clientHeight });
      });
    },
    dispose() {
      generation++;
      stopWatchdog();
      worker?.postMessage({ command: "game-stop" });
      window.removeEventListener("java-lab-game-input", gameInputHandler);
      window.removeEventListener("java-lab-game-resize", gameResizeHandler);
      window.removeEventListener("java-lab-game-debug", gameDebugHandler);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      activeGameRequest = undefined;
      rejectPending(createRunnerError("DISPOSED", "TeaVM runner został zamknięty."));
      worker?.terminate();
      if (globalThis.__javaLabTeaVMWorker === worker) delete globalThis.__javaLabTeaVMWorker;
      worker = undefined;
      readyPromise = undefined;
    },
    stopGame() {
      generation++;
      stopWatchdog();
      if (pending.size) {
        rejectPending(createRunnerError("ABORTED", "Uruchomienie zostało anulowane po zmianie zadania."));
        resetWorker();
        return;
      }
      worker?.postMessage({ command: "game-stop" });
      activeGameRequest = undefined;
    },
  };
}

function gameResizeHandler(event) {
  globalThis.__javaLabTeaVMWorker?.postMessage({ command: "game-resize", ...event.detail });
}

function gameDebugHandler(event) {
  globalThis.__javaLabTeaVMWorker?.postMessage({command:'game-debug',enabled:event.detail.enabled});
}
import {getGameAssetsReady} from './gameInterop.js';
