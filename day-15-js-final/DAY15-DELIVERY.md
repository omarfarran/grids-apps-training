# Day 15 — Project Delivery and Assessment Preparation

Author: **Omar Farran**  
Project: **Stride — Task Management System**  
Branch: `day-15-final-javascript`  
Scope: final project implementation and preparation for a human assessment.

The implementation has software QA evidence. The timed assessment, trainer interview/review, score, and progression decision have not been completed by this work.

## A. Final Project Demo Script

Preparation: run `npm install`, `npm run dev`, and open the local URL. Use a disposable browser profile for storage/error demonstrations. Example task names below are demo suggestions, not data loaded automatically.

1. **Purpose:** Explain that Stride organizes personal tasks with status, priority, due dates, and a summary derived from real task state.
2. **Architecture:** Open the six JavaScript modules. Explain the coordinator → task operations → storage → UI flow and why validation is shared.
3. **Data model:** Show one saved record with its eight fields, stable UUID, timestamps, enums, and optional date string.
4. **Create:** Add “Prepare demo” with a description, high priority, and a due date. Show trimming, the new card, summary changes, input reset, and success feedback. Submit a blank title separately to demonstrate an associated error.
5. **Edit:** Open Edit task, change title/description/priority/date, and save. Explain why ID/createdAt stay stable while updatedAt changes. Demonstrate Cancel or Escape on another draft.
6. **Change status:** Move Todo → In progress → Completed → Todo through the card actions. Point out the text label and action text; completion has strikethrough as well as color. Show that a completed task is excluded from Overdue.
7. **Search/filter/sort:** Search text found only in the description. Combine status and priority; demonstrate no matches and Reset view. Compare newest, oldest, due-date, and priority sorting.
8. **Persistence:** Refresh and show that tasks and their edited fields/status remain. Inspect `day15TaskManager` in browser storage and explain JSON. Delete one demo record, refresh, and show that the correct ID remains absent.
9. **Errors/empty/loading:** Show the no-tasks and no-matches messages. Explain that startup loading covers actual module initialization and storage validation without an artificial delay. Use the controlled QA storage-failure recipe in QA.md to show warning/recovery behavior.
10. **Responsive view:** Resize to 320, 390, 768, 1024, and 1366px. Show stacked/side-by-side forms, wrapping filters/actions, edit usability, visible focus, and no horizontal page overflow.
11. **Build:** Run `npm run build` and `npm run preview`; show the production app at localhost:4173. Explain that preview and development ports use different browser storage origins. Refer to actual QA evidence rather than presenting it as an assessment result.

## B. Code Walkthrough Guide

| File / functions | Be ready to explain |
|---|---|
| `index.html` | Semantic landmarks/headings, labels, fieldsets initially disabled, module entry, empty/init markup and live regions. |
| `src/main.js`: initialization | Why loading is truthful, why reading storage is synchronous, why controls enable only after validation/rendering. |
| `src/main.js`: `commitTasks`, `renderWorkspace`, `safely` | Single persistence/render/notification path, derived views, and user-visible handling of a stale record. |
| `src/main.js`: form/list handlers | `preventDefault`, reading/trimming values, validation-first behavior, delegation with `closest`/`dataset`, and focus after actions. |
| `src/state.js` | What belongs in state; why task data, filter choices, and edit selection are separate; intentional coordinator mutations. |
| `src/tasks.js`: `createTask`, `updateTask`, `deleteTask`, `findTask` | Stable IDs; array operations; copying changed records; timestamps; handling a missing ID. |
| `src/tasks.js`: `filterTasks`, `sortTasks` | Combining predicates; copied-array sorting; missing-date placement and deterministic tie order. |
| `src/tasks.js`: `localDateKey`, `isOverdue`, `summarizeTasks` | Local date-only comparison, completed exclusions, and reduce-based summaries. |
| `src/validation.js` | Field limits/enums; calendar dates vs a matching string format; saved-data types, duplicate IDs, timestamp checks and whitelisting. |
| `src/storage.js`: `loadTasks`, `saveTasks` | JSON boundaries; browser getter inside try; preserving bad raw data until replacement; memory-only operation on failure. |
| `src/ui.js` | Safe `textContent`, native buttons, status text, form errors, empty states, notifications and focus restoration. |
| `src/style.css` | Grid/Flexbox, breakpoints, min-width/wrapping, long text, focus outlines, and task states beyond color. |
| `qa/unit.test.js`, `qa/browser-qa.js` | Pure logic tests vs browser tests; isolated contexts; storage simulation; real screenshots; limitations of automated checks. |

Useful walkthrough exercise: trace one edit from the button click through form population, validation, immutable update, JSON persistence, list rendering, summary derivation, and focus/notification behavior.

## C. Technical Interview Preparation

These are study prompts for the student; no trainer answers or review fields are supplied.

1. Why use `const` for an object that can still change, and when is `let` appropriate?
2. Why separate modules? Which module would change if storage moved to a backend?
3. What is localStorage's scope, lifetime, value type, and main limitation?
4. Why use `JSON.stringify` and `JSON.parse`? How can parsing fail?
5. What does `event.preventDefault()` stop in this project?
6. What is event delegation? Why use `closest()` and a stable ID?
7. How do `map`, `filter`, `find`, `some`, and `reduce` differ?
8. Why copy an array before sorting it? What does object spread copy?
9. Why do date-only strings need different handling from timestamps?
10. What is a Promise? How do `.then()`/`.catch()` relate to async/await?
11. Why are both `fetch()` and `response.json()` awaited?
12. Why check `response.ok` when fetch can resolve for HTTP 500?
13. How would this project change with a real backend: loading, error recovery, IDs, persistence and authentication?
14. How would you reproduce and diagnose a disappearing task, an invalid storage record, or a sorting bug?
15. What can the browser QA establish about accessibility, and what still needs a person/screen reader?

Broader Days 1–14 prompts are in [assessment-prep/INTERVIEW-QUESTIONS.md](assessment-prep/INTERVIEW-QUESTIONS.md).

## D. Human-only Assessment Fields

**Timed assessment:** Not yet performed

**Trainer interview:** Not yet performed

**Trainer score:** Pending

**Progression decision:** Pending

**Trainer feedback:** Pending

Only the human trainer/assessment process can fill or change these fields. The software QA totals are not an assessment score or a progression decision.

## Supporting Materials

- [README](README.md): architecture, installation, operation, limitations, screenshots.
- [QA](QA.md): actual software checks and reproducible commands.
- [HTML/CSS reconstruction practice](assessment-prep/HTML-CSS-RECONSTRUCTION.md)
- [Logic practice](assessment-prep/LOGIC-PRACTICE.md)
- [Debugging practice](assessment-prep/DEBUGGING-PRACTICE.md)
- [Interview questions](assessment-prep/INTERVIEW-QUESTIONS.md)

All preparation exercises are unofficial self-study materials. They are separate from the final application and from the trainer's real assessment.
