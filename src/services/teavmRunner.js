const defaultWorkerFactory = () => new Worker("/vendor/teavm/teavm.worker.js", { type: "module" });

function createRunnerError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function createTeaVMRunner({ workerFactory = defaultWorkerFactory, timeoutMs = 45_000 } = {}) {
  let worker;
  let readyPromise;
  let nextRequestId = 0;
  const pending = new Map();

  const rejectPending = (error) => {
    for (const request of pending.values()) {
      clearTimeout(request.timeoutId);
      request.reject(error);
    }
    pending.clear();
  };

  const handleWorkerMessage = ({ data }) => {
    if (data?.command === "ready") {
      return;
    }
    if (data?.command === "init-error") {
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
      request.resolve(data);
    }
  };

  const ensureWorker = () => {
    if (worker) return readyPromise;
    worker = workerFactory();
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
    worker.postMessage({ command: "initialize" });
    return readyPromise;
  };

  return {
    async run(payload, { onStage, signal, timeout = timeoutMs } = {}) {
      await ensureWorker();
      if (signal?.aborted) throw createRunnerError("ABORTED", "Uruchamianie programu zostało przerwane.");
      const id = ++nextRequestId;
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          pending.delete(id);
          reject(createRunnerError("TIMEOUT", "Kompilacja TeaVM trwała zbyt długo."));
        }, timeout);
        pending.set(id, { resolve, reject, timeoutId, onStage });
        worker.postMessage({ command: "compile-and-run", id, ...payload });
      });
    },
    dispose() {
      rejectPending(createRunnerError("DISPOSED", "TeaVM runner został zamknięty."));
      worker?.terminate();
      worker = undefined;
      readyPromise = undefined;
    },
  };
}
