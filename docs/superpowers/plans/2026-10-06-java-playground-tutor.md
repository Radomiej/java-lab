# Java Playground and Tutor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended here) or superpowers:subagent-driven-development to implement task-by-task. Track steps with checkboxes.

**Goal:** Restore a verifiable browser game workflow and add the approved playground, selectors and Java tutor.

**Architecture:** Reuse the Java Lab editor, TeaVM worker and canvas. Playground has isolated persisted files and no course grading. Port the existing Lab tutor UI and backend with Java API context and Java-only proposals.

**Tech Stack:** React JSX, Vite, TeaVM Java 21/Wasm, Node HTTP, Vitest, OpenRouter.

**Spec:** ../specs/2026-10-06-java-playground-tutor-design.md

## Execution outcome

- [x] Task 1: reproduced and verified course/game startup after restoring the dev server; no runtime-code change without a reproducible fault.
- [x] Task 2: selectors ported and tested.
- [x] Task 3: isolated Playground and safe import/export implemented and tested.
- [x] Task 4: private loopback tutor backend implemented and tested with stubbed provider responses.
- [x] Task 5: tutor UI, review fixes, full 115-test regression run and production build completed; browser first frame/input/debug/fullscreen/mobile checked.

The original step checklist below remains the execution recipe. Deviations and
unperformed key-backed provider / manual file-dialog checks are recorded in
`2026-10-06-java-playground-tutor-progress.md`. Integration is one cohesive commit;
merge/push is not part of this execution.

## Global Constraints

- No local Java compilation in the student workflow.
- No Playwright or browser installation; no reset of student localStorage during diagnosis.
- Preserve lesson 104 changes and course progression.
- Backend loopback only; secrets never in VITE_*, localStorage, logs or exports.
- Code attachment opt-in; proposals require explicit approval; AI never executes commands.
- Tests and build sequentially; no paid model requests in tests.

## Review Focus

- Switching tasks during compilation must not restart an obsolete game (task 1).
- Disabling game-dev must also hide and stop Playground (task 3).
- Importing malformed or engine-owned files must preserve the current project (task 3).
- Provider text must remain inert, and network errors must preserve student code (task 4/5).
- Editing a proposed file while AI responds must prevent stale overwrites (task 5).

### Task 1: Reproduce and repair browser startup

**Files:** inspect/modify `src/App.jsx`, `src/services/teavmRunner.js`, `src/services/gameWorkspace.js`, `public/vendor/teavm/teavm.worker.js`; test `src/services/teavmRunner.test.js` and a new `tools/playground-runtime-check.html` if browser diagnostics need isolation.

**Interfaces:** consume `createTeaVMRunner().run({files,mainClass,mode}, {onStage})`; retain its result contract `{ok,output,diagnostics,error}` and game event names.

- [ ] Reproduce first course scene with its unchanged starter, capture compilation diagnostics, export initialization and first frame separately. Do not infer Wasm success from JVM tests.
- [ ] Write a regression test for the observed boundary failure; verify FAIL. Add runner test `obsolete_run_cannot_start_game`: switch generation, complete prior request, assert no game-draw event from the old generation.
- [ ] Fix only the proven cause in the owning module; retain source and useful error details.
- [ ] Run `npx vitest run src/services/teavmRunner.test.js src/services/gameWorkspace.test.js --maxWorkers=1 --minWorkers=1`; require PASS. Verify an actual TeaVM first frame if browser access is available; otherwise record the precise blocker.
- [ ] Commit only this diagnostic/fix scope.

### Task 2: Port course selectors

**Files:** modify `src/components/Sidebar.jsx`, `src/styles/app.css`; create `src/components/Sidebar.test.jsx`.

**Interfaces:** keep current Sidebar props and callbacks. Reference `../web-learning-lab/src/components/Sidebar.jsx` and its associated selector CSS, not its curriculum.

- [ ] Test `select_track_closes_picker_and_restores_focus`: open summary, choose track, expect callback ID, closed details, focused summary. Test lesson equivalent and new selected-track lesson list.
- [ ] Run the new file; require FAIL before implementation.
- [ ] Port details/summary pickers and styles to Java colors/icons; retain progress and mobile behavior. Keep panel left and canvas right.
- [ ] Run the new file and existing JavaLabSmoke tests with one worker; require PASS.
- [ ] Commit navigation changes.

### Task 3: Isolated Java Playground

**Files:** create `src/data/playground.js`, `src/hooks/useGamePlayground.js`, `src/services/gameProjectTransfer.js`, `src/components/PlaygroundTools.jsx` and respective tests; modify `src/data/tracks.js`, `src/data/curriculum.js`, `src/App.jsx`, `src/components/LessonWorkspace.jsx` as needed.

**Interfaces:** `playgroundLesson` uses track `playground`, entry `GameMain`, engine runtime and one sandbox task; `parseGameProject(text) -> {version:1,mainClass:'GameMain',files}`; `serializeGameProject(project) -> string`; hook exposes `{project,setFiles,replaceProject,resetProject}` persisted under `java-lab-game-playground-v1` separately from course progress.

- [ ] Tests: round-trip two Java files; reject `../Game.java`, engine filenames, unsupported versions, over 262144 UTF-8 bytes and missing GameMain; leave persisted files unchanged on rejection.
- [ ] Tests: RUN uses game mode directly without test-main execution or markTaskComplete; disabling game-dev stops game and excludes Playground; project survives reload, course reset does not erase it.
- [ ] Run tests to establish FAIL.
- [ ] Add a minimal working player scene using existing textures/controllers, compact file UI, JSON import/export confirmation, RUN and existing canvas/fullscreen. Exclude sandbox tasks from progress; preserve existing lesson identifiers and numbering.
- [ ] Run new tests plus curriculum/progress/runtime lifecycle tests, one worker; require PASS.
- [ ] Commit Playground scope.

### Task 4: Java tutor backend

**Files:** create `server/index.js`, `server/tutor.js`, `server/freeModels.js`, `server/tutor.test.js`, `scripts/dev.mjs`; modify `package.json`, `vite.config.js`, `.gitignore`, `.env.example`, `README.md`.

**Interfaces:** `createTutorHandler({apiKey,fetchImpl,loadModels}) -> async(payload,signal) -> {status,body}`; `/api/ai/config` returns configured state and free models, `/api/ai/chat` accepts `{model,messages,project?}` and returns `{message,proposals}`. Proxy these paths only to loopback port 5184; frontend stays 5182. No tutor dependency for compiling games.

- [ ] Verify current OpenRouter API against official docs before implementation. Read reference backend completely, adapt prompt to `engineGuide` and `javaEngineNavigation` API.
- [ ] Tests using HTTP stubs: absent key -> 503, invalid model -> 400, invalid JSON/body -> 400/413, provider failure -> 502, rate limit -> 429, unsupported origins -> 403; config/export/log responses contain no key. Validate Java-only proposals with protected-engine filenames.
- [ ] Run tests; require FAIL before code.
- [ ] Port backend with max body 262144 bytes, max 20 messages/8000 chars each, project context max 100000 chars, 45-second provider timeout, max_tokens 4096, 10 requests/minute/IP and two concurrent chats. Bind 127.0.0.1 only, enforce allowed Host/Origin. Cancel upstream on disconnect. Start/stop frontend and backend together and surface port conflicts.
- [ ] Run backend tests without paid requests; confirm static course works without tutor backend.
- [ ] Commit backend and configuration.

### Task 5: Tutor UI and final verification

**Files:** create `src/components/GameTutor.jsx`, `src/components/ModelPicker.jsx`, `src/services/tutorApi.js`, `src/services/tutorProposals.js` and tests; modify `src/App.jsx`, `src/styles/app.css`, `README.md`, `docs/todo.md`.

**Interfaces:** `GameTutor({project,onApplyFile,projectRevision})`; API helpers `loadTutorConfig()` and `sendTutorMessage(payload,{signal})`; `validateProposals(items) -> safe items` and `canApplyProposal(snapshot,currentFiles,path) -> boolean`. Apply through hook setters from task 3, not disk writes.

- [ ] Test robot opener, close/Escape/focus, initial code checkbox off, opt-in payload, absent backend state, cancel and provider error without project mutation. Test raw `<script>` reply renders as inert text.
- [ ] Test approved Java proposal adds file; stale snapshot rejects overwrite; reset/import invalidates history and proposals; engine-owned files are rejected; exports exclude history and secrets.
- [ ] Run tests; require FAIL.
- [ ] Adapt full reference GameTutor and model selector, preserving existing Lab avatar, hierarchy and keyboard behavior. Java API context comes from backend, not student instructions. Explain external transmission before send.
- [ ] Run `npm test -- --maxWorkers=1 --minWorkers=1`, then `npm run build`, then `git diff --check`; require zero test failures and successful build. Record existing large Monaco chunk warnings separately.
- [ ] Smoke current viewport, 1366x768 and 390x844 if browser automation is available: navigation, editing, RUN/first frame/input, fullscreen/colliders, export/import, tutor unavailable/configured states. Do not claim unperformed visual checks.
- [ ] Review the whole patch; fix actionable findings, document remaining browser limitations, commit verified integration. Push only when requested.
