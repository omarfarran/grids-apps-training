# Day 13 QA

Tested on **22 October 2026** with headless Google Chrome **155.0.8059.86** using Playwright and a temporary local HTTP server. Tests used an isolated browser context with disposable task data. No existing user storage was read or changed. The application has no test-tool or runtime dependencies.

The final browser run passed **21 test groups**. Machine-readable evidence is in [screenshots/qa-results.json](screenshots/qa-results.json). All seven screenshots are actual browser captures and were visually inspected. No screenshots were generated or mocked.

## Required checklist

- [x] **PASS — Create:** Added three tasks, checked trimming, form reset, input focus, stable unique IDs, and no navigation. A 160-character unbroken title also rendered successfully.
- [x] **PASS — Read:** Refreshed and verified all three persisted tasks rendered from storage.
- [x] **PASS — Edit:** Opened inline edit with the title focused; saved a trimmed title with Enter, refreshed, and verified it remained. Both Cancel and Escape discarded drafts and returned focus to Edit.
- [x] **PASS — Delete:** Deleted a specific task, inspected its ID's removal, preserved other tasks, refreshed, and verified the deletion remained.
- [x] **PASS — Toggle status:** Active → completed → active, with checkbox state and persistence verified after refresh. Status text also updated.
- [x] **PASS — Search:** Exact, partial, mixed case, padded whitespace, blank whitespace, no results, and cleared search.
- [x] **PASS — Filter:** All, Active, and Completed showed 3, 2, and 1 tasks respectively; selected filter exposed `aria-pressed="true"`.
- [x] **PASS — Search + filter combined:** Matching and excluded searches verified under both Active and Completed.
- [x] **PASS — Empty states:** Missing key produced “No tasks yet”; unmatched search/filter produced “No matching tasks” with recovery guidance.
- [x] **PASS — Validation:** Blank/whitespace create and edit rejected with visible inline error, invalid state, and focus. Rejected edits left saved titles intact.
- [x] **PASS — localStorage save:** Read `day13Tasks` directly through browser evaluation (the DevTools-equivalent storage API), parsed its JSON, and verified only `id`, `title`, `completed`, and `createdAt` fields with appropriate types and valid dates.
- [x] **PASS — Refresh persistence:** Create, toggle in both directions, edit, and delete each survived refresh.
- [x] **PASS — Malformed storage recovery:** Invalid JSON, object instead of array, null, null record, nonboolean completion, duplicate IDs, invalid date, and blank title all recovered without crashing. Raw bad data remained untouched until the next change; a new task then replaced it with valid JSON and cleared the warning.
- [x] **PASS — Keyboard/focus:** Enter added tasks, Tab moved through add/search/filter controls, Space toggled a checkbox, Enter opened editing, and Escape cancelled. Checked focus restoration after deletion and after toggling a task out of the Active view. Verified visible focus outline, associated labels for every input, and names on all buttons.
- [x] **PASS — Responsive widths:** Tested 320, 390, 768, and 1366px, including long task titles and inline editing. Forms, controls, wrapping, and task rows fit. Buttons and text/search inputs were at least 44px tall.
- [x] **PASS — No horizontal overflow:** At all four widths, both document and body scroll widths stayed within the viewport, including a 160-character unbroken title; the edit form also stayed within the viewport.
- [x] **PASS — No console errors:** Monitored `console.error`, uncaught page errors, failed requests, and HTTP responses ≥400 through the full browser run; final error list was empty. CSS/JS assets loaded successfully.

## Additional edge checks

| Check | Result and actual evidence |
|---|---|
| Safe task text | **PASS:** `<img src=x onerror="window.injected=true">` appeared as literal text; no image node or script execution. |
| Empty storage | **PASS:** Empty string, whitespace string, and `[]` loaded empty without warnings. Missing key was tested on first load. |
| Write failure | **PASS:** Simulated `QuotaExceededError` from `setItem`; tasks remained usable in memory with a warning. Refresh correctly showed that the unsaved task was not persisted. |
| Read failure | **PASS:** Simulated `SecurityError` from `getItem` and called `loadTasks()`; it returned an empty list and displayed a warning. |
| No page reload | **PASS:** Navigation count stayed unchanged through create and through toggle/search/filter/edit/delete. Refreshes were explicit test actions only. |
| Completion semantics | **PASS:** Checked checkbox, explicit Completed text, and strikethrough were present; completion does not depend only on color. |
| JavaScript syntax | **PASS:** `node --check js/app.js` completed without errors. |
| Project isolation | **PASS:** Final Git inspection showed only the new Day 13 folder; no tracked changes in completed projects or the repository README. No commit or push performed. |

## Screenshots

- [Desktop task list](screenshots/desktop-task-list.png) — 1366px, four representative test tasks.
- [Mobile layout](screenshots/mobile-layout.png) — 390px, wrapped task titles and reachable actions.
- [Completed filter](screenshots/filtered-completed.png) — one completed task shown from four total.
- Stress-test layouts at [320px](screenshots/width-320.png), [390px](screenshots/width-390.png), [768px](screenshots/width-768.png), and [1366px](screenshots/width-1366.png) — includes a 160-character unbroken title.

The screenshots show disposable QA tasks entered through the app, not preloaded application data. Date formatting reflects the test browser's locale.

## Repeating the main checks

1. Serve this folder with Live Server and open the app. In a fresh browser profile, verify the initial empty state.
2. Submit whitespace, then add `Practice DOM selection`, `Review events`, and `Read about localStorage`.
3. Toggle `Review events`, refresh, and check its state. Toggle back and repeat.
4. Edit a task, reject an empty edit, then save a new title and refresh. Test Cancel and Escape separately.
5. Search exact/partial/mixed-case titles, test no results, then clear search. Combine search with each filter.
6. Delete one item and refresh; verify only its ID disappeared from `day13Tasks` in browser storage.
7. In a disposable browser profile, change that key to malformed JSON and refresh. Verify the warning, then add a task to recover. Remove the test key when finished.
8. Check keyboard controls, console, and layouts at the four documented widths.

## Remaining issues / test limits

No known failing requirement in the tested Chrome browser. Full screen-reader testing, other browser engines, physical touch devices, and multi-tab synchronization were not tested. Storage access failure checks were simulated; real device quota/privacy settings may vary. The app is frontend only, deletes immediately, and does not synchronize across tabs or devices. Changing search/filter or opening a different edit discards unsaved edit drafts as documented in the README.
