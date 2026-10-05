const TASK_FOCUS_MINIMUM_SECONDS = 1;

export function createUmamiAnalytics({ scriptUrl, websiteId, windowRef, documentRef }) {
  let enabled = false;
  let ready = false;
  let script = null;
  const queue = [];

  const deliver = (event) => {
    const track = windowRef?.umami?.track;
    if (!enabled || typeof track !== "function") return false;
    try {
      if (event.type === "pageview") track();
      else track(event.name, event.data);
      return true;
    } catch {
      return false;
    }
  };

  const flush = () => {
    while (enabled && queue.length && deliver(queue[0])) queue.shift();
  };

  const loadTracker = () => {
    if (!enabled || !scriptUrl || !websiteId || !documentRef?.head) return;
    if (typeof windowRef?.umami?.track === "function") {
      ready = true;
      flush();
      return;
    }
    if (script) return;

    script = documentRef.createElement("script");
    script.async = true;
    script.src = scriptUrl;
    script.dataset.websiteId = websiteId;
    script.dataset.autoTrack = "false";
    script.dataset.doNotTrack = "true";
    script.dataset.javaLabUmami = "true";
    script.addEventListener("load", () => {
      ready = typeof windowRef?.umami?.track === "function";
      flush();
    }, { once: true });
    script.addEventListener("error", () => {
      ready = false;
      script?.remove();
      script = null;
      queue.length = 0;
    }, { once: true });
    documentRef.head.appendChild(script);
  };

  return {
    setEnabled(value) {
      enabled = Boolean(value);
      if (enabled) loadTracker();
      else queue.length = 0;
    },
    track(name, data = {}) {
      if (!enabled || !scriptUrl || !websiteId || typeof name !== "string" || !name) return;
      const event = { type: "event", name, data };
      if (ready && deliver(event)) return;
      queue.push(event);
      if (queue.length > 100) queue.shift();
      loadTracker();
    },
    trackPageview() {
      if (!enabled || !scriptUrl || !websiteId) return;
      const event = { type: "pageview" };
      if (ready && deliver(event)) return;
      queue.push(event);
      if (queue.length > 100) queue.shift();
      loadTracker();
    },
  };
}

export function createTaskFocusTracker({ track, now = () => performance.now(), documentRef = globalThis.document }) {
  let currentTask = null;
  let segmentStartedAt = null;
  let accumulatedMilliseconds = 0;
  let attached = false;

  const isVisible = () => documentRef?.visibilityState !== "hidden";
  const startSegment = () => {
    if (attached && currentTask && isVisible() && segmentStartedAt === null) segmentStartedAt = now();
  };
  const accrueSegment = () => {
    if (!currentTask || segmentStartedAt === null) return;
    accumulatedMilliseconds += Math.max(0, now() - segmentStartedAt);
    segmentStartedAt = null;
    while (accumulatedMilliseconds >= 60_000) {
      track("task_focus_minute", { ...currentTask, duration_seconds: 60 });
      accumulatedMilliseconds -= 60_000;
    }
  };
  const finishTask = () => {
    accrueSegment();
    const durationSeconds = Math.floor(accumulatedMilliseconds / 1000);
    if (currentTask && durationSeconds >= TASK_FOCUS_MINIMUM_SECONDS) {
      track("task_focus_session", {
        ...currentTask,
        duration_seconds: durationSeconds,
        duration_bucket: durationSeconds < 60 ? "under_1m"
          : durationSeconds < 300 ? "1_5m"
            : durationSeconds < 900 ? "5_15m" : "15m_plus",
      });
    }
    accumulatedMilliseconds = 0;
    currentTask = null;
  };
  const onVisibilityChange = () => {
    if (isVisible()) startSegment();
    else accrueSegment();
  };

  return {
    attach() {
      if (attached) return;
      attached = true;
      documentRef?.addEventListener("visibilitychange", onVisibilityChange);
      startSegment();
    },
    setTask(task) {
      finishTask();
      currentTask = task ? {
        track_id: task.trackId,
        lesson_number: task.lessonNumber,
        task_id: task.taskId,
      } : null;
      startSegment();
    },
    detach() {
      finishTask();
      documentRef?.removeEventListener("visibilitychange", onVisibilityChange);
      attached = false;
    },
  };
}

const env = import.meta.env || {};
const client = createUmamiAnalytics({
  scriptUrl: env.VITE_UMAMI_SCRIPT_URL,
  websiteId: env.VITE_UMAMI_WEBSITE_ID,
  windowRef: typeof window === "undefined" ? undefined : window,
  documentRef: typeof document === "undefined" ? undefined : document,
});

export const setUmamiAnalyticsEnabled = (enabled) => client.setEnabled(enabled);
export const trackUmamiEvent = (name, data) => client.track(name, data);
export const trackUmamiPageview = () => client.trackPageview();
