# Java Lab — CheerpJ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local React/Vite Java learning laboratory with Polish step-by-step lessons, a browser-side course checker, a JDK compile/run endpoint, and CheerpJ support for running Java and Swing JARs.

**Architecture:** The React app owns course navigation, lesson content, editor state, progress, and static checks. A small Express server accepts Java source files, compiles them with the local JDK into a temporary job directory, runs console programs with strict limits, and exposes generated JARs for CheerpJ. The front end keeps the compile boundary behind a service so the browser checker can remain useful when the JDK is unavailable.

**Tech Stack:** React 18, Vite, JSX, Express, Vitest, localStorage, Java 17, CheerpJ 4.3 loader.

**Spec:** `docs/superpowers/specs/2026-09-22-java-lab-cheerpj-design.md`

## Global Constraints

- The application is Polish-language and local-first.
- The default Java source target is JDK 17.
- CheerpJ is loaded from the official 4.3 runtime URL only when the user runs a browser Java/Swing preview.
- No third-party Java libraries are used in the first lesson series.
- JUnit 5 is not run in the browser checker; the first version uses explicit course checks.
- The local compile server must return instructional errors when `javac` or `java` is unavailable.
- User source and runtime output are size- and time-limited.

## Review Focus

- Empty or malformed lesson files must produce failed checks rather than a React crash — covered by `lessonChecker.test.js` and the editor empty-state test.
- A missing JDK must produce a useful API error and a visible setup message — covered by `javaRunner.test.js` and the API error-state test.
- A source file containing braces, quotes, or Unicode Polish text must survive the request boundary — covered by `javaRunner.test.js` request normalization.
- A long-running or noisy program must be terminated/truncated — covered by `javaRunner.test.js` timeout/output policy.
- A mobile-width layout must keep lesson selection, editor actions, and feedback reachable — covered by the rendered smoke checklist and responsive CSS.

### Task 1: Project scaffold and test harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.js`
- Create: `vitest.config.js`
- Create: `src/test/setup.js`
- Create: `src/data/curriculum.test.js`
- Create: `src/services/lessonChecker.test.js`
- Create: `server/javaRunner.test.js`

**Interfaces:**
- Produces npm scripts `dev`, `dev:client`, `dev:server`, `dev:all`, `build`, and `test`.
- Test imports will target `src/data/curriculum.js`, `src/services/lessonChecker.js`, and `server/javaRunner.js`.

- [ ] Write the failing curriculum and checker tests first, asserting sixteen lessons, four tracks, one starter file, and a check result shape `{ passed, label, detail }`.
- [ ] Run `npm test -- --run` and observe the expected module-not-found failures.
- [ ] Add the minimal Vite/Vitest/Express package configuration and test setup.
- [ ] Run the test command again; it may still fail because the feature modules do not exist, but the failure must be limited to the planned modules.
- [ ] Commit the scaffold with `git add . && git commit -m "chore: scaffold java lab"` after the first runnable package is present.

### Task 2: Course data and browser checker

**Files:**
- Create: `src/data/tracks.js`
- Create: `src/data/lessons/fundamentals.js`
- Create: `src/data/lessons/objects.js`
- Create: `src/data/lessons/inheritance.js`
- Create: `src/data/lessons/swing.js`
- Create: `src/data/curriculum.js`
- Create: `src/services/lessonChecker.js`
- Modify: `src/data/curriculum.test.js`
- Modify: `src/services/lessonChecker.test.js`

**Interfaces:**
- `allLessons` is an ordered array of lesson objects.
- `tracks` maps track IDs to `{ id, label, description, accent }`.
- `checkSource(files, checks)` returns `{ passed, results, score, summary }`.
- Check kinds are `contains`, `containsAll`, `regex`, `excludes`, and `fileContains`.

- [ ] Add a failing test for a lesson containing a Polish objective, theory blocks, starter `Main.java`, and at least one task.
- [ ] Add a failing test proving `checkSource` passes a required Java construct and reports a missing construct with a useful detail.
- [ ] Add the four tracks and sixteen lessons with progressively harder code: variables, conditions, loops, methods, classes, constructors, encapsulation, composition, inheritance, overriding, polymorphism, exceptions, Swing window, Swing components, events, and a final mini-project.
- [ ] Implement the checker with normalized file input, case-sensitive Java checks, clear labels, and no code execution.
- [ ] Run curriculum and checker tests until green.
- [ ] Commit with `feat: add step-by-step java curriculum`.

### Task 3: Local persistence and compile API client

**Files:**
- Create: `src/hooks/useCourseProgress.js`
- Create: `src/hooks/useLocalStorage.js`
- Create: `src/services/javaApi.js`
- Create: `src/hooks/useCourseProgress.test.js`
- Create: `src/services/javaApi.test.js`

**Interfaces:**
- `useCourseProgress(lessons)` exposes `selectedTrack`, `selectedLessonId`, `filesByTask`, `completedTasks`, `selectLesson`, `updateFiles`, `resetTask`, `markTaskComplete`, and `hardReset`.
- `compileAndRun({ files, mainClass, mode })` POSTs to `/api/java/compile` and returns `{ output, errors, jarUrl, className }` or a normalized error object.

- [ ] Write failing storage tests for restoring the selected lesson, saving a file edit, and marking/unmarking a task.
- [ ] Write failing API tests for JSON success, non-JSON server errors, and unavailable server handling.
- [ ] Implement localStorage state with a versioned key and safe fallback when storage is unavailable.
- [ ] Implement the fetch client with an `AbortController` timeout and a stable error shape.
- [ ] Run the focused tests and the full suite.
- [ ] Commit with `feat: persist course work and connect java api`.

### Task 4: Local Java compiler and runner

**Files:**
- Create: `server/javaRunner.js`
- Create: `server/index.js`
- Modify: `server/javaRunner.test.js`

**Interfaces:**
- `normalizeFiles(files)` accepts an object of relative `.java` paths and returns validated safe paths.
- `compileJava({ files, mainClass, mode })` returns `{ output, errors, jarPath, className }`.
- Express `POST /api/java/compile` accepts `{ files, mainClass, mode }` and returns JSON.
- Express `GET /runtime/:jobId/:file` serves only generated artifacts from the runtime root.

- [ ] Write failing tests for path traversal rejection, source-size rejection, missing `javac` reporting, and output truncation.
- [ ] Run the tests to confirm the runner does not exist or fails for the expected reason.
- [ ] Implement temporary job directories under `server/.runtime`, safe path checks, `javac --release 17`, a bounded `java` child process, and a JAR creation step for browser execution.
- [ ] Return status `503` with a setup message when JDK tools are unavailable, without throwing an uncaught process error.
- [ ] Add the Express routes and static runtime directory handling.
- [ ] Run server tests and the full suite. If JDK is absent, verify the expected instructional `503` path.
- [ ] Commit with `feat: add bounded local java runner`.

### Task 5: React learning workspace

**Files:**
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/components/AppShell.jsx`
- Create: `src/components/Sidebar.jsx`
- Create: `src/components/LessonWorkspace.jsx`
- Create: `src/components/LessonOverview.jsx`
- Create: `src/components/TaskPanel.jsx`
- Create: `src/components/CodeEditor.jsx`
- Create: `src/components/FeedbackPanel.jsx`
- Create: `src/components/RuntimeConsole.jsx`
- Create: `src/components/CheerpJPreview.jsx`
- Create: `src/components/JavaLabSmoke.test.jsx`

**Interfaces:**
- `App` composes data, progress, checker, compile API, and the shell; it does not contain lesson markup details.
- `CodeEditor` is a controlled multi-file editor with `onChange`, `onCheck`, `onRun`, `onReset`, and optional `onSolution`.
- `CheerpJPreview` accepts `{ jarUrl, mainClass, onStatus }` and owns runtime loading/display cleanup.
- `FeedbackPanel` renders checker results and compile errors without assuming a successful server.

- [ ] Write a failing smoke test for the app title, first lesson title, `Sprawdź zadanie`, and the lesson navigation control.
- [ ] Run the smoke test and verify the missing component failure.
- [ ] Implement the shell using the existing lab visual language: navy lesson rail, paper canvas, teal accent, code editor, diagnostics rail, and responsive mobile drawer.
- [ ] Implement controlled source editing and local task switching.
- [ ] Wire `checkSource` to completion state and `compileAndRun` to the console.
- [ ] Add an accessible CheerpJ panel that loads `https://cjrtnc.leaningtech.com/4.3/loader.js` only on request, creates a display, and shows a clear network/JAR/JDK error.
- [ ] Run the smoke test and full Vitest suite.
- [ ] Commit with `feat: build java learning workspace`.

### Task 6: Visual system, documentation, and integration polish

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/app.css`
- Create: `README.md`
- Create: `.gitignore`
- Modify: `package.json`
- Modify: `src/components/JavaLabSmoke.test.jsx`

**Interfaces:**
- CSS tokens cover page canvas, sidebar, text, borders, teal success states, error states, spacing, radii, and monospace editor text.
- README documents Node 18+, JDK 17, CheerpJ network/license considerations, commands, and no-JDK behavior.

- [ ] Add a failing responsive assertion for the mobile lesson drawer class and visible primary action.
- [ ] Implement responsive CSS for desktop three-column layout and mobile stacked layout without horizontal overflow.
- [ ] Add the run commands, architecture notes, lesson map, and CheerpJ/JDK prerequisites to README.
- [ ] Run `npm test` and `npm run build`.
- [ ] Start the dev server, inspect desktop and mobile viewport behavior, click a lesson, edit code, run checks, and exercise the no-JDK error path.
- [ ] Commit with `docs: document java lab setup and workflow`.

### Task 7: Final verification and repository state

**Files:**
- Review: all changed files and `git diff`.

- [ ] Run the complete test command from a clean working tree state.
- [ ] Run the complete production build command.
- [ ] Verify `git status --short`, required project files, and README commands.
- [ ] Remove temporary runtime artifacts and QA files from the repository.
- [ ] Make a final commit only if verification changes remain.

