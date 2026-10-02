import { afterEach, expect, it, vi } from "vitest";
import { disposeGameRuntime, invokeGameExport } from "../../public/vendor/teavm/game-lifecycle.js";
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

it("clears the timer and calls Java cleanup exactly once", () => {
  const cleanup = vi.fn();
  vi.useFakeTimers();
  const tick = vi.fn();
  const timer = setInterval(tick, 1000);
  const runtime = { app: { exports: { dispose: cleanup } }, interval: timer };
  disposeGameRuntime(runtime);
  disposeGameRuntime(runtime);
  expect(cleanup).toHaveBeenCalledOnce();
  vi.advanceTimersByTime(2000);
  expect(tick).not.toHaveBeenCalled();
});

it("marks a runtime stopped even when Java cleanup throws", () => {
  const cleanup = vi.fn(() => { throw new Error("Cleanup failed"); });
  const runtime = { app: { exports: { dispose: cleanup } }, interval: null };
  expect(() => disposeGameRuntime(runtime)).toThrow("Cleanup failed");
  expect(() => disposeGameRuntime(runtime)).not.toThrow();
  expect(cleanup).toHaveBeenCalledOnce();
});

it("supports existing programs without a cleanup export", () => {
  expect(() => disposeGameRuntime({ app: { exports: {} }, interval: null })).not.toThrow();
});

it.each(['setKey', 'resize'])('stops and reports a failing Java %s export', (name) => {
  const failure = new Error(`Java ${name} failed`);
  const runtime = { gameId: 42, app: { exports: { [name]: () => { throw failure; } } } };
  const events = [];
  invokeGameExport(runtime, name, ['a', true], () => events.push('stop'), event => events.push(event));
  expect(events).toEqual(['stop', {command:'game-error', gameId:42, error:failure.message}]);
});

it('passes export arguments and ignores absent or disposed runtimes', () => {
  let received;
  const runtime = {app:{exports:{resize:(...args) => {received=args;}}}};
  const unexpected = () => {throw new Error('unexpected failure');};
  invokeGameExport(runtime, 'resize', [320, 240], unexpected, unexpected);
  expect(received).toEqual([320, 240]);
  runtime.disposed = true;
  invokeGameExport(runtime, 'resize', [1, 1], unexpected, unexpected);
  invokeGameExport(undefined, 'setKey', ['a', true], unexpected, unexpected);
  expect(received).toEqual([320, 240]);
});
