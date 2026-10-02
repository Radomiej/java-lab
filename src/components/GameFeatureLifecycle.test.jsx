import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import App from "../App.jsx";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete globalThis.__JAVA_LAB_FEATURE_FLAGS__;
  localStorage.clear();
});

it("stops forwarding runtime frames when Game Dev is disabled dynamically", async () => {
  localStorage.clear();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ setTransform() {}, fillRect() {}, fillText() {} });
  let worker;
  class TestWorker {
    listeners = new Map();
    constructor() { worker = this; }
    addEventListener(type, listener) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(listener);
    }
    emit(data) { this.listeners.get("message")?.forEach(listener => listener({ data })); }
    postMessage(message) {
      if (message.command === "initialize") queueMicrotask(() => this.emit({ command: "ready" }));
      if (message.command === "compile-and-run") queueMicrotask(() => this.emit({ command: "result", id: message.id, ok: true, output: "", diagnostics: [], classVersions: [], phase: "runtime" }));
    }
    terminate() {}
  }
  vi.stubGlobal("Worker", TestWorker);
  render(<App />);
  fireEvent.click(screen.getByRole("tab", { name: /Game Dev w Javie/i }));
  fireEvent.click(screen.getByRole("button", { name: /Uruchom grę w przeglądarce/i }));
  await waitFor(() => expect(screen.getByText("Gra gotowa")).toBeInTheDocument());
  act(() => window.dispatchEvent(new CustomEvent("java-lab-game-render-error", { detail: "Brak tekstury: unknown" })));
  expect(screen.getByText(/Brak tekstury: unknown/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Uruchom grę w przeglądarce/i }));
  await waitFor(() => expect(screen.getByText("Gra gotowa")).toBeInTheDocument());
  const received = vi.fn();
  window.addEventListener("java-lab-game-draw", received);
  try {
    act(() => worker.emit({ command: "game-draw", op: "frame", commands: [] }));
    expect(received).toHaveBeenCalledOnce();
    received.mockClear();
    act(() => {
      globalThis.__JAVA_LAB_FEATURE_FLAGS__ = { "game-dev.enabled": false };
      window.dispatchEvent(new Event("java-lab-feature-flags-changed"));
    });
    expect(screen.queryByRole("tab", { name: /Game Dev w Javie/i })).not.toBeInTheDocument();
    act(() => worker.emit({ command: "game-draw", op: "frame", commands: [] }));
    expect(received).not.toHaveBeenCalled();
  } finally { window.removeEventListener("java-lab-game-draw", received); }
});
