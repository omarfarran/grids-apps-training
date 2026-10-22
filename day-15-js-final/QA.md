# Day 15 — Software QA

Tested on **23 October 2026** in the **Asia/Hebron** timezone. Environment: Windows, Node **24.21.0**, npm **11.19.0**, Vite **8.3.5**, Playwright **1.64.1**, Google Chrome **155.0.8059.86**. Browser contexts were isolated from the user's normal profile. Screenshot date controls follow the installed browser's locale; task date labels use English formatting.

**Actual totals: 20 unit tests passed; 26 browser test groups passed; 0 failures in the final runs.** Build, development server and production preview were executed. These are software QA results, not a timed assessment, trainer score, interview result, or progression decision.

Reproducible scripts: [unit tests](qa/unit.test.js), [browser QA](qa/browser-qa.js). Machine-readable final browser evidence: [qa/browser-results.json](qa/browser-results.json). Its timestamp is UTC; the test context uses Asia/Hebron.

## Required Checklist

- [x] **PASS — CRUD:** Created multiple tasks with distinct fields, read initial/persisted records, edited title/description/status/priority/date, and deleted the correct stable ID. Blank create/edit rejected. Creation reset the form and returned focus. ID/createdAt were preserved through editing while updatedAt changed.
- [x] **PASS — Search:** Title and description matching, exact/partial/mixed-case/padded queries, blank whitespace, unmatched query, clearing, and restoring results.
- [x] **PASS — Filter:** Every status (All/Todo/In progress/Completed) and priority (All/Low/Medium/High), plus search+status, search+priority, status+priority and all three together. Reset restored all results and default sorting.
- [x] **PASS — Validation:** Whitespace title, >100-character title, >1,000-character description, invalid status/priority, invalid/range/calendar dates. Field errors were visible and associated by `aria-describedby`; first invalid input received focus. Unit tests covered leap dates and exact length boundaries.
- [x] **PASS — Persistence:** Create → refresh, all-field edit → refresh, complete/reopen → refresh, and delete → refresh. Directly inspected valid JSON in `day15TaskManager`, including eight expected fields, stable unique IDs and valid timestamps.
- [x] **PASS — Loading:** Held the actual production JS bundle in browser QA. Before initialization, the real HTML showed Loading/busy and disabled fieldsets/controls. Releasing it loaded/validated storage, rendered the workspace, cleared busy and enabled controls. The app has no artificial initialization delay or fake request.
- [x] **PASS — Empty states:** First load had no tasks and no seed write. An unmatched search showed a search-specific message; unmatched status/priority filters showed a filter-specific message.
- [x] **PASS — Errors:** Nine malformed/invalid saved-data cases recovered visibly. Simulated localStorage getter/read denial and quota/write denial did not crash the app. Memory-only actions remained usable with persistent warnings. A stale task action produced recovery feedback and refreshed the list without changing saved data.
- [x] **PASS — Notifications:** Create/update/delete/status, validation, reset, and stale-action feedback appeared in the status region; storage warnings appeared separately and stayed visible on failure.
- [x] **PASS — Responsive UI:** Core flows independently completed at 320, 390, 768, 1024, and 1366px. Form, edit mode, long description, filters, actions and empty state fit with no horizontal page overflow. Visible buttons/inputs/selects were at least 44px high.
- [x] **PASS — Keyboard/focus:** Enter create/status/edit, Escape cancel, explicit Cancel, Tab to description, visible outline, focus after save/cancel/delete, named real buttons, labels for all input/select/textarea controls, and associated errors.
- [x] **PASS — Console:** Zero console errors, uncaught exceptions/rejections, module errors, failed local assets, HTTP failures or failed requests in the final browser run, including handled storage-failure tests.
- [x] **PASS — npm run build:** Actual production build completed successfully; built assets loaded under `npm run preview` and passed the full production browser suite.

## Additional Evidence

| Area | Actual test |
|---|---|
| Status workflow | In progress → Completed → Todo persisted across refresh; responsive tests also covered Todo → In progress → Completed. |
| Sorting | Oldest/newest matched creation sequence; due-date sorting placed earliest first and undated last; priority sorted high → medium → low. Unit tests checked precise order and nonmutation. |
| Dashboard | Three-task fixture yielded Total 3 / Todo 1 / In progress 1 / Completed 1 / Overdue 1; subsequent actions updated real counts. |
| Overdue | Incomplete task before today counted; completed task with a past due date excluded; today/missing date excluded in unit tests. Clearing a date worked. |
| Calendar safety | Used local calendar date keys, no UTC conversion for date-only values. Unit tests checked leap dates, invalid month/day combinations, supported range and a local date near midnight. |
| Immutable data | Frozen-input create/update tests; delete retained unrelated IDs; sort left original order unchanged. |
| Safe rendering | HTML-like title and script-like description stayed literal; no injected image/script node or execution. |
| Edit safety | Escape and Cancel discarded drafts and restored focus; invalid edits preserved the saved title. |
| Storage schema | Invalid JSON, wrong top-level shape, null record, duplicate ID, invalid status, invalid priority, invalid due date and invalid timestamp rejected. Unknown saved properties were discarded by whitelisting. |
| Bad-data preservation | Raw invalid storage remained unchanged on load. A subsequent successful change replaced it with valid JSON and cleared the warning. |
| Read security error | Threw `SecurityError` from the actual `window.localStorage` getter before access; app recovered and permitted memory-only create/status/delete. |
| Write quota error | Threw `QuotaExceededError` from `setItem`; task stayed visible with warning. Refresh confirmed that the unsaved task was absent. |
| Unexpected action | Changed a rendered row's `data-id` to a nonexistent ID; “no longer available” feedback appeared, list refreshed, data stayed intact, no uncaught error. |
| Core navigation | Create/update/status/delete/search/filter/sort did not navigate. Refreshes in the test were deliberate persistence checks. |
| No seed data | Initial storage key remained absent until a user/test-created task was saved. |

## Responsive Matrix

At every width the browser suite created two tasks, edited all fields, refreshed, changed status, combined search/status/priority, selected due-date sorting, reset the view, deleted the correct record, refreshed, and returned to empty.

| Width | Layout and result | Actual captures |
|---|---|---|
| 320px | **PASS:** stacked form/list, wrapped controls/actions, long unbroken text fits, no page overflow | [View](screenshots/width-320.png), [edit](screenshots/edit-width-320.png) |
| 390px | **PASS:** stacked layout, keyboard-reachable controls, full edit flow fits | [View](screenshots/width-390.png), [edit](screenshots/edit-width-390.png) |
| 768px | **PASS:** stacked panels, two-column form, three toolbar columns fit | [View](screenshots/width-768.png), [edit](screenshots/edit-width-768.png) |
| 1024px | **PASS:** form sidebar and task list fit; all actions/edit controls usable | [View](screenshots/width-1024.png), [edit](screenshots/edit-width-1024.png) |
| 1366px | **PASS:** full dashboard/sidebar layout; all controls fit | [View](screenshots/width-1366.png), [edit](screenshots/edit-width-1366.png) |

## Commands Actually Executed

| Command | Actual result |
|---|---|
| `npm install` | **PASS:** pinned dependencies installed and package-lock created; 0 vulnerabilities reported by that installation. |
| `npm run dev` | **PASS:** Vite started at localhost:5173; browser create/refresh/delete smoke passed. |
| `npm test` | **PASS:** 20 tests, 20 passed, 0 failed. |
| `npm run build` | **PASS:** Vite transformed 10 modules and generated production HTML/CSS/JS successfully. |
| `npm run preview` | **PASS:** built app served at localhost:4173; full browser checks ran against it. |
| `npm run test:browser` | **PASS:** 26 groups, no final failures; screenshots and JSON evidence written. |

Use `npm.cmd` on Windows when the PowerShell wrapper is blocked by execution policy. The Vite/npm/Playwright tooling is local development/QA infrastructure; the application itself has no backend or external API requests.

## Reproduce the Checks

1. From this folder, run `npm install`, then `npm test` and `npm run build`.
2. In separate terminals start `npm run dev` and `npm run preview`.
3. Run `npm run test:browser` in another terminal. It uses installed Chrome; set `QA_BROWSER_PATH` if selecting a different installed Chromium executable.
4. Inspect `qa/browser-results.json`, the console output and real screenshots. Test storage belongs to isolated browser contexts, not the normal browser profile.

To demonstrate malformed-data recovery manually, use a disposable profile on the project's local origin:

```js
localStorage.setItem("day15TaskManager", "{invalid json");
location.reload();
```

Observe the warning and empty list. Add a task; inspect valid replacement JSON and the cleared warning. This recipe deliberately replaces disposable test data.

To demonstrate a write failure without editing source, open DevTools in that disposable session and run:

```js
Storage.prototype.setItem = function () {
  throw new DOMException("Controlled QA failure", "QuotaExceededError");
};
```

Create/edit a task and observe the storage warning. Refresh restores the original native method and removes any unsaved in-memory changes. The committed browser-QA script also tests the more restrictive localStorage getter/read failure before initialization.

## Debugging Record

The first browser-suite run stopped at `false !== true` in the startup fieldset assertion. Inspection showed the native fieldset `disabled` property was the appropriate state to assert; Playwright's element-disabled helper did not report the fieldset itself as expected. The test was corrected to inspect the fieldset property and also verify that its actual title/search controls were disabled. Retesting passed the startup check and the full 26-group suite. This was a QA assertion issue, not an application loading defect; no artificial application delay was added.

No application defect remained in the completed required checks. Invalid storage, denied access and stale IDs were intentional failure injections, all handled with visible feedback.

## Screenshots

Twenty actual browser captures are included. Main examples:

- [Desktop dashboard](screenshots/desktop-dashboard.png)
- [Mobile view](screenshots/mobile-view.png)
- [Populated task list](screenshots/populated-task-list.png)
- [Filtered state](screenshots/filtered-state.png)
- [Edit state](screenshots/edit-state.png)
- [Empty state](screenshots/empty-state.png), [search empty](screenshots/search-empty.png)
- [Validation error](screenshots/validation-error.png), [storage error](screenshots/storage-error.png)
- [Initialization](screenshots/initialization.png)

The other ten captures cover view/edit at all five widths. Images are real browser output, not generated screenshots. Desktop/mobile, validation and representative edit captures were visually inspected. Example tasks are disposable QA entries, never application defaults.

## Remaining Limits and Human-only Work

No known failing implementation requirement in the tested Chrome environment. Other browser engines, physical touch devices and full screen-reader testing remain unverified. Storage is local to one profile/origin, may be unavailable, and has no cross-tab conflict resolution. Due-date badges refresh on actions/window focus rather than a background clock. Delete has no undo.

**Timed assessment:** Not yet performed. **Trainer interview:** Not yet performed. **Trainer score:** Pending. **Progression decision:** Pending. **Trainer feedback:** Pending.

See [DAY15-DELIVERY.md](DAY15-DELIVERY.md) for preparation and untouched human-only fields. No assessment score or approval is inferred from these software checks.
