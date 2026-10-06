# SDD ledger — plan: docs/superpowers/plans/2026-10-06-java-playground-tutor.md

- Execution: inline on feature/java-playground-tutor; baseline 38f80c0. Preserve unrelated fundamentals.js change.
- Pre-flight: task 3 supplies project.files/revision to task 5; task 4 supplies config/chat to task 5. Interfaces align.
- Task 1: Ruling: no speculative engine fix — browser RUN for lesson 402 now succeeds after server restart; retain runtime and verify again with Playground — cost if wrong: a second distinct startup fault remains to diagnose.
- Task 1: browser shows PASS Java tests and Gra gotowa; earlier worker error not reproduced, prior Vite websocket error is stale.
- Ruling: persistent docs progress ledger instead of Bash-only scratch scripts on Windows — retains recovery evidence without shell runtime installation.
- Tasks 2–5 implemented: selectors, isolated Playground, JSON transfer, loopback tutor backend and opt-in AI UI. No new dependencies or browser installs.
- Browser evidence: Playground builds Wasm, first frame shows RPG hero/grass, arrow input moves the hero, collider toggle draws its circle. Fullscreen changes the accessible control to Close; subsequent screenshot/Escape/mobile QA blocked by IAB command timeouts. Attempt to reset temporary viewport also timed out.
- Review findings resolved: duplicate JSON members rejected before acceptance (including escaped keys); editor rolls rejected changes back to last accepted source with a visible error. Compact export stays importable near byte limit. Async import ignores an unmounted workspace.
- Rulings on review exclusions: provider behavior remains unverified without a key; no external paid requests made. Mobile visual and process-failure UI checks remain explicit limitations. Existing storage-quota recovery helper remains unchanged; JSON export is the available backup.
- Verification: first full run 109/109; new focused regressions pass, including fallback editor, cancellation and unmounted import. Production build succeeds with existing Monaco chunk-size warning. Final full regression rerun underway.
- Ruling: one coherent integration commit instead of task commits, since App/UI/backend share the project contract. Preserve unrelated fundamentals.js change; do not merge or push without a current request.
- Final verification: 115/115 tests across 30 files; build exit 0 (existing Monaco large chunks); diff check clean. Reviewer confirmed both data-integrity blockers resolved.
- Browser recovered: actual fullscreen canvas renders; Escape closes and focuses its control. At mobile 390x844 tutor form/privacy fit, backend-unconfigured message disables send, track picker closes and restores focus. Desktop screenshot saved outside repo at C:/Nauka/java-lab-playground-qa.png. Temporary viewport reset successfully.
- Remaining checks: real configured-provider request (requires key); manual JSON file-dialog roundtrip (automated transfer/import tests pass). No paid or sensitive external transmission performed.
