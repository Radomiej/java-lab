# Umami: Java Lab

Dashboard: https://mws03-52051.wykr.es/websites/4b479aa8-360b-40f5-9376-4ac07836a8c7
Website ID: `4b479aa8-360b-40f5-9376-4ac07836a8c7`. Public configuration lives in `src/services/labAnalytics.js`.
Only the exact production hostname is tracked; localhost and preview deployments are excluded.
Set `VITE_ANALYTICS_ENABLED=false` to disable tracking. Browser Do Not Track is respected.

## Events
- `lesson_open`, `task_open`: stable curriculum IDs, topic and current task.
- `topic_change`: topic selection.
- `task_run_started`, `task_run_result`: execution and coarse outcome.
- `technical_error`: uncaught error / unhandled rejection class only, capped at 10 per page.
- `resource_download`: PDF, archive or project export category; no file contents or user filenames.
- `lesson_search`: search usage and length bucket if a search field exists; no search text.
- Existing `task_focus_minute` and `task_focus_session` measure visible task time. Existing `task_run_*` include pass/fail and runner failure stage.

## Privacy and rollout
No student code, SQL, prompts, query results, connection details, names, installation IDs, raw errors or stacks are sent to Umami. No session recordings. Analytics failure never blocks learning.
Java's existing optional teacher session telemetry is a separate feature, unchanged by this integration; its snapshots are not forwarded to Umami.
No extra npm dependencies or private API keys. Deploy this local change to activate collection. Website creation is complete, but production reception has not been verified before deployment.
No tests were added or run for this change. Visual behavior is unchanged; no visual QA was run.
