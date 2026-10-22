# Async Debug Lab — Fix Report

Tested on **23 October 2026** (Asia/Hebron) in Google Chrome **155.0.8059.86** through a local HTTP server. The lab is separate from the Country Explorer; only its own page imports the broken module.

## Reproduction and Variable Inspection

1. Open `/debug-lab/` through the local server and open the browser console.
2. Click **Run broken example**. The API responds successfully, but the country list remains empty and the visible status stays at Loading.
3. Read the exact observed console error:

```text
TypeError: countries.forEach is not a function
    at loadBrokenCountries (.../debug-lab/broken-app.js:14:15)
```

4. Inspect the values printed by the lab:

```text
response.ok: true
typeof countries: object
countries instanceof Promise: true
```

`typeof` alone cannot distinguish a promise from an array: both are objects. The `instanceof Promise` check exposes the unresolved data operation. `response.json()` returns a promise even when the HTTP response has already arrived.

## Bug 1 — JSON Parsing Was Not Awaited

**Observed symptom:** The exact TypeError above; no country names render despite HTTP 200.

**Root cause:** `const countries = response.json()` stores a promise. The next line treats that promise as an array and calls `.forEach()`, which it does not have.

**Why it happened:** Awaiting `fetch()` waits for the Response; it does not also await a later JSON body-parsing operation.

**Smallest responsible fix:** Change that line to `const countries = await response.json()`. The corrected example also checks that the parsed value is an array of name-bearing records before iterating it.

**Verified:** Ran the fixed example against the real API: it reported 250 records and rendered three names. Inspection showed `Array.isArray(countries): true`. No new console error occurred.

## Bug 2 — HTTP Status Was Not Checked

**Observed symptom:** The broken source would continue toward JSON/rendering for an HTTP error response. A network request can resolve successfully as a Response even when its HTTP status is 500.

**Root cause:** There is no `response.ok` check after `await fetch()`.

**Why it happened:** HTTP failure was confused with promise rejection. `fetch()` normally rejects for network failures, not for HTTP 404/500.

**Smallest responsible fix:** Before parsing, check `response.ok` and throw an error containing `response.status` when it is false.

**Verified:** Intercepted the fixed lab's API request and returned HTTP 500 with JSON. Its visible status became `Unable to load countries: HTTP 500. Run the fixed example to try again.` The list remained empty and the lab did not try to render the error object.

## Bug 3 — catch Only Logged to the Console

**Observed symptom:** After the broken example's TypeError, the user still sees Loading and no recovery instruction.

**Root cause:** The catch block calls only `console.error(error)`.

**Why it happened:** Logging an exception helps a developer but does not update the DOM or tell the user what happened.

**Smallest responsible fix:** Put a useful failure message and retry instruction in the lab status region. In the corrected lab, users retry with **Run fixed example**.

**Verified:** The controlled HTTP 500 test displayed the exact visible failure message above. The corrected request raised no uncaught page/promise error.

## Bug 4 — Loading Was Never Cleared

**Observed symptom:** The broken lab's `aria-busy` remained `true`, with the status still Loading after the exception.

**Root cause:** Request cleanup is absent.

**Why it happened:** Setting a loading state before a request does not clear it automatically after a thrown error.

**Smallest responsible fix:** Clear `aria-busy` in `finally`, which runs after success and failure. The corrected lab also cancels requests that exceed 15 seconds and clears that timeout in the same cleanup block.

**Verified:** `aria-busy="false"` after both real success and simulated HTTP 500. Old results were cleared before each run. The lab's buttons became usable again after completion.

## Retest Evidence

| Case | Actual result |
|---|---|
| Broken example, real API success | **PASS (intentional reproduction):** exact TypeError captured; Promise type observed; loading stayed stuck. |
| Fixed example, real API success | **PASS:** 250 records, three displayed names, array inspection, cleared busy state, no additional console error. |
| Fixed example, controlled HTTP 500 | **PASS:** visible HTTP error, empty list, cleared busy state, no uncaught exception. |
| Main explorer | **PASS:** broken code never loaded; all four production modules tested separately. |

Actual [broken](../screenshots/debug-broken.png) and [fixed](../screenshots/debug-fixed.png) browser screenshots are included. The exact error stack and inspection output are also retained in [qa-results.json](../screenshots/qa-results.json).

The broken version is deliberately preserved for comparison. Its expected console error is not a normal-app console failure. The main explorer and the fixed lab are the working implementations; no unrelated features were added as part of the correction.
