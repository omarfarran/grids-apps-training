# Task Management System

## Project Description

**Stride** is Omar Farran's Day 15 final JavaScript project for the Grids Apps Full Stack Web Development Foundation Track. It turns a task list into a small personal workspace with full task details, status workflow, priorities, dates, dashboard counts, combined filters, sorting, and browser persistence.

It integrates the concepts from Days 12–14 in a distinct Vite application with separate data, storage, validation, rendering, state, and coordination modules. It is frontend only. The project and preparation materials are ready for human review; the timed assessment, trainer interview, score, and progression decision remain pending.

## Features

- Create, read, edit every task field, and delete individual tasks without reloading.
- Todo → In progress → Completed → Todo workflow through real action buttons, or select status in the edit form.
- Title/description search with partial, case-insensitive, trimmed matching.
- Combine status and priority filters with search; Reset view clears all view choices.
- Sort newest/oldest first, earliest due date (undated last), or high-to-low priority.
- Derive total, Todo, In progress, Completed, and Overdue summary counts from real state.
- Optional due dates; incomplete tasks before today are overdue, completed tasks are excluded.
- Trim and validate inputs with field-specific, associated errors.
- Persist JSON to localStorage, safely recover from malformed records, and report storage failures.
- Show truthful initialization, useful empty/search/filter states, and accessible action feedback.
- Responsive layout, visible keyboard focus, labeled controls, and safe text rendering.
- Reproducible unit/browser QA and separate practice/demo/walkthrough materials.

No tasks are preloaded automatically. Screenshots contain disposable tasks entered by browser QA.

## Technologies

- HTML5 and semantic forms
- CSS with Grid, Flexbox, media queries, and custom properties
- Vanilla JavaScript and ES Modules
- Vite **8.3.5**, pinned with a package lock
- localStorage and JSON
- Node's built-in test runner; Playwright **1.64.1** for browser QA only

No UI framework, backend, external API, or runtime package dependency is required. Vite supplies development and production tooling; see the [Vite guide](https://vite.dev/guide/).

## Data Model

```js
{
  id: "stable-uuid",
  title: "Prepare the release",
  description: "Review the final checklist",
  status: "todo",               // todo | in-progress | completed
  priority: "high",             // low | medium | high
  dueDate: "2026-10-26",         // YYYY-MM-DD, or "" for none
  createdAt: "2026-10-23T09:00:00.000Z",
  updatedAt: "2026-10-23T09:00:00.000Z"
}
```

UUIDs are generated with `crypto.randomUUID()` and checked against existing IDs. Updates preserve `id` and `createdAt`, and replace `updatedAt`. Titles are required with a 100-character limit; descriptions allow 1,000 characters. Dates must be real calendar dates from 1900 through 9999, or blank.

Due dates are date-only strings. `localDateKey()` builds today's date using local calendar components; comparisons never turn a date-only value into a UTC timestamp. Completed tasks, undated tasks, and tasks due today are not overdue. Counts/badges recalculate after actions and when the browser window regains focus.

## Architecture

| File | Responsibility / useful functions |
|---|---|
| `src/main.js` | Cached DOM references, initialization, forms/events, delegated task actions, coordination, action error boundary. |
| `src/state.js` | Explicit coordinator-owned state, filter defaults, task/filter/edit state updates. |
| `src/tasks.js` | Task CRUD, stable ID lookup, workflow, search/filter/sort, local-date and summary helpers. |
| `src/validation.js` | Field validation, enums/limits, calendar checks, saved-record schema and timestamp validation. |
| `src/storage.js` | Single storage key, guarded getter/read/write access, JSON serialization, recovery messages. |
| `src/ui.js` | Safe DOM cards, summaries, empty states, form population/errors, notifications and focus restoration. |
| `src/style.css` | Responsive layout, task states, form controls, and focus styles. |

An action updates task state, saves it, renders the derived list/summary, and announces feedback. Storage failures leave the current in-memory list usable with a persistent warning. Search/filter/sort only derive a view; they do not mutate or save the underlying tasks.

Task updates use new arrays and changed-record copies. `sortTasks()` sorts a copied array. The small `state` object and DOM intentionally change in response to events; this makes UI coordination explicit without a state-management framework. Rendering uses `createElement`, `textContent`, `append`, `replaceChildren`, `classList`, and `dataset`, with delegation on the task list.

## Folder Structure

```text
day-15-js-final/
  .gitignore
  index.html
  package.json
  package-lock.json
  vite.config.js
  public/favicon.svg
  src/
    main.js
    state.js
    storage.js
    ui.js
    tasks.js
    validation.js
    style.css
  qa/
    unit.test.js
    browser-qa.js
    browser-results.json
  screenshots/
  assessment-prep/
    HTML-CSS-RECONSTRUCTION.md
    LOGIC-PRACTICE.md
    DEBUGGING-PRACTICE.md
    INTERVIEW-QUESTIONS.md
  README.md
  QA.md
  DAY15-DELIVERY.md
```

Generated `node_modules/`, `dist/`, and the temporary npm cache are ignored. No completed project or root repository file is modified.

## Installation

Use a Node.js version supported by the pinned Vite package: **20.19+ within Node 20, or 22.12+**. This project was tested with Node **24.21.0** and npm **11.19.0**.

```sh
cd day-15-js-final
npm install
```

The included lockfile records dependency versions. `npm ci` is an alternative for subsequent clean installations.

## Development

```sh
npm run dev
```

Open `http://127.0.0.1:5173/`. The server binds only to localhost and uses a strict port. Stop it with Ctrl+C. On Windows PowerShell, `npm.cmd` can be used if local execution policy blocks the `npm.ps1` wrapper.

## Production Build

```sh
npm run build
```

This generates the production site in `dist/`. Relative asset paths support serving the build below a directory path. Do not open the HTML with `file:`; use an HTTP server.

## Preview

```sh
npm run preview
```

Open `http://127.0.0.1:4173/`. Preview serves the built output, so rebuild after source changes. The development and preview URLs have different ports and therefore separate localStorage. These are local addresses, not a published demo.

## Features Demonstrated

CRUD; reusable functions; arrays/objects; immutable record updates; DOM/events/forms and `preventDefault()`; event delegation; search/filter/sort; validation; JSON persistence; truthful loading; error/empty states; accessible notifications; and responsive UI.

`find()` locates stable IDs; `filter()` derives views/removes tasks; `map()` updates records/renders cards; `some()` checks collisions/visibility; `reduce()` derives summary counts. No network request or artificial delay is added to the synchronous storage initialization. Async/fetch knowledge is included in the walkthrough/interview/practice materials rather than a fake API feature.

## Storage and Recovery

The key is **`day15TaskManager`**. Only the eight documented fields are saved. Missing/blank storage starts empty. Invalid JSON or invalid/duplicate records produce an empty in-memory list and a visible warning. The original raw value remains untouched until the next successful change replaces it. Optional fields still have predictable stored types (`description` and `dueDate` are strings).

Storage getter/read/write errors are caught. If saving fails, CRUD continues in memory, and the warning explains that changes may be lost on refresh. Saved data belongs to the browser profile and origin, and clearing browser data removes it.

## QA

```sh
npm test
```

For browser QA, leave both development and preview servers running in separate terminals after building, then run in a third terminal:

```sh
npm run test:browser
```

The script uses installed Google Chrome by default. Set `QA_BROWSER_PATH` to another installed Chromium executable if needed. `QA_BASE_URL` selects a production-preview origin; `QA_DEV_URL` selects the development URL. Set `QA_SKIP_DEV=1` to skip the optional development-server smoke step. Each test context is isolated from the user's normal browser profile. The suite updates screenshots and `qa/browser-results.json`.

Actual result: **20 unit tests and 26 browser test groups passed**. The production build and both servers were executed. These are software QA counts, not a human assessment score. See [QA.md](QA.md) for evidence and test limits.

## Screenshots

- [Desktop dashboard](screenshots/desktop-dashboard.png) and [populated task list](screenshots/populated-task-list.png)
- [Mobile view](screenshots/mobile-view.png)
- [Filtered state](screenshots/filtered-state.png) and [edit state](screenshots/edit-state.png)
- [Empty state](screenshots/empty-state.png), [validation error](screenshots/validation-error.png), and [storage error](screenshots/storage-error.png)

All are real browser captures. [QA.md](QA.md) links the additional width/edit/init captures.

## Known Limitations

- Frontend only; no backend, accounts, cloud sync, collaboration, or multi-tab conflict resolution.
- localStorage is unencrypted browser storage, not a backup. Simultaneous tabs can overwrite each other's changes.
- Delete is immediate with no undo/recycle bin. There is no import/export or bulk action.
- Form drafts and view choices are not persisted; refreshing loses an unsaved edit.
- Date badges recalculate on rendering/window focus; there is no background midnight timer.
- Modern browser and secure-context UUID support are required (localhost qualifies).
- Chrome was tested. Other engines, physical touch devices, and full screen-reader use remain unverified.

## Author

**Omar Farran** — Grids Apps Full Stack Web Development Foundation Track.

[DAY15-DELIVERY.md](DAY15-DELIVERY.md) provides the demo/walkthrough guide and explicitly pending human assessment fields.
