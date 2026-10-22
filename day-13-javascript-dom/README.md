# Day 13 - DOM, Events & Storage

## Objective

Build J-I01, a CRUD task manager that practices DOM rendering, forms, events, and browser storage. Taskbook runs entirely in the browser without reloading for core actions.

## Features

- Create tasks with a trimmed, nonempty title (maximum 160 characters).
- Read/render tasks dynamically, with total, active, and completed counts.
- Edit titles inline; Save or Enter applies changes, Cancel or Escape discards them.
- Delete tasks individually and toggle active/completed status.
- Search titles live, ignoring case and surrounding whitespace.
- Filter by All, Active, or Completed; filters combine with search.
- Persist tasks in localStorage and restore them after refresh.
- Show useful empty states, inline validation, action feedback, and storage warnings.

## Concepts Practiced

- DOM selection with `querySelector()` and `querySelectorAll()`; cached references.
- Safe DOM creation/rendering with `createElement()`, `textContent`, `append()`, `replaceChildren()`, `classList`, and `dataset`.
- Events, labeled forms, reading values, trimming, and `preventDefault()`.
- Event delegation for dynamic click, change, submit, and keyboard events on the task list.
- Arrays/objects and modern array methods: `find()`, `filter()`, `map()`, `some()`, and `every()` where useful.
- JSON serialization/parsing and guarded localStorage reads/writes.
- State-driven rendering and restoring focus after replacing task rows.

## Running

Open this folder in VS Code, install/use Live Server, then right-click `index.html` and choose **Open with Live Server**. Keep the same host and port when testing persistence.

Alternatively, if Python is installed, run this from this folder:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8000`. Stop the server with Ctrl+C. There is no build step, package installation, or framework required. Opening `index.html` directly also runs the app, but browser storage behavior for `file:` URLs can vary; a local server is recommended.

## App Structure

```text
day-13-javascript-dom/
  index.html             Semantic page, forms, filters, live feedback
  assets/css/style.css   Responsive layout and keyboard focus styles
  js/app.js              State, storage, validation, rendering, CRUD, events
  README.md
  QA.md                  Actual test evidence and limitations
  screenshots/           Actual browser captures and QA results
```

`app.js` is one classic deferred script. It caches DOM references, initializes state, loads storage, and calls `renderTasks()`. Each successful CRUD action changes the task array, saves it, and renders again. Search/filter only change the visible view, not the stored array. New tasks appear first; the initial list is empty.

## Data Model

```js
{
  id: "unique-stable-string",
  title: "Practice event delegation",
  completed: false,
  createdAt: "2026-10-22T12:00:00.000Z"
}
```

IDs combine a timestamp and random suffix, with a collision check against current tasks. IDs remain unchanged through edits and toggles. `createdAt` is an ISO timestamp; the display uses the browser's local date format. The model deliberately stays small.

## Storage

The single localStorage key is **`day13Tasks`**. `saveTasks()` stores only the task array with `JSON.stringify()`; `loadTasks()` parses it with `JSON.parse()` and validates IDs, unique IDs, titles, booleans, and dates. It copies only the four documented fields. Missing/blank storage starts with an empty list. Malformed JSON or invalid records show a warning and start an empty in-memory list without immediately overwriting the saved value. The next successful change replaces that saved data.

Read/write exceptions are caught. If saving is blocked or storage is full, the app continues in memory and shows a persistent warning that changes may be lost on refresh. Search/filter choices and edit drafts are not saved. Storage belongs to the browser profile and origin (scheme, host, and port); clearing browser data removes tasks.

## Accessibility

Semantic headings, a skip link, associated labels, native buttons/checkboxes, pressed states on filters, visible focus outlines, live result counts, action status, and inline error feedback support keyboard and assistive-technology use. Completed tasks have a checked checkbox, an explicit status label, and strikethrough. Inline editing focuses/selects the title; Save/Cancel and filtered-out/deleted rows restore focus to an available task control or the add field.

## Limitations

- Frontend only; no backend/API, accounts, sync, or multi-tab conflict resolution.
- Data is stored unencrypted in this browser; it is not a backup service.
- Delete is immediate. There is no undo, recycle bin, bulk deletion, due date, or priority system.
- Changing search/filter or starting another edit discards the current unsaved edit draft.
- Uses HTML, CSS, and synchronous JavaScript only. No framework, modules, fetch, promises, or API integration in the application.

See [QA.md](QA.md) for tested behavior, viewport sizes, and screenshots.
