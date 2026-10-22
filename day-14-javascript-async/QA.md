# Day 14 QA

Tested on **23 October 2026** (Asia/Hebron) in headless Google Chrome **155.0.8059.86**, using Playwright and a temporary local HTTP server. The run timestamp in [screenshots/qa-results.json](screenshots/qa-results.json) is UTC. Tests ran in isolated browser contexts.

**23 browser test groups passed.** The initial success flow and subsequent retry used real, unintercepted Countries.dev requests. Failure cases used browser-level interception only; no test fixture or failure switch is installed in the application.

## Required Checklist

- [x] **PASS — Successful API load:** Exact endpoint returned HTTP 200 with 250 country/territory records; Chrome rendered 250 cards. CORS response header was `*`.
- [x] **PASS — response.ok checked:** A simulated HTTP 503 JSON response produced an error instead of success. The fixed lab separately handled HTTP 500. Both checks happen before parsing/rendering.
- [x] **PASS — JSON parsed:** Compared Japan's displayed name, capital, formatted population, and language against the real parsed API record. Malformed JSON was caught separately.
- [x] **PASS — Loading state:** Held the API response pending; visible Loading, `aria-busy="true"`, and disabled controls remained in place. Releasing it rendered success and enabled controls.
- [x] **PASS — Success state:** Country cards, facts, region labels, result count, and visible flags appeared after the real request; the state panel was hidden.
- [x] **PASS — Empty state:** `zzzz-no-country` showed “No countries match your search.” with no cards and an announced status. Empty API array separately showed “No countries available.”
- [x] **PASS — Error state:** Controlled HTTP 503, network abort, malformed JSON, invalid schema, and timeout all displayed useful visible errors and cleared loading. Retry remained available.
- [x] **PASS — Retry:** After the controlled 503, removed the interception and pressed Enter on Try again. A second real API request restored 250 cards without navigation; search received focus.
- [x] **PASS — Search:** Exact Japan, partial `jap`, padded uppercase `  JAPAN  `, blank/whitespace, unmatched query, and clearing tested.
- [x] **PASS — Region filter:** Africa, Americas, Asia, Europe, and Oceania counts matched the live data. Antarctic grouping also matched the three polar-region records.
- [x] **PASS — Search + filter combined:** Tested `land` inside each primary region, Japan excluded by Europe, and Japan included by Asia. Reset restored all results, cleared both controls, and focused search.
- [x] **PASS — ES modules load:** Browser observed all production module requests: `main.js`, `api.js`, `ui.js`, and `utils.js`. `index.html` uses `script type="module"`.
- [x] **PASS — 2+ modules:** Four focused production modules loaded; their API/UI/helpers/coordinator separation is documented in README.
- [x] **PASS — No uncaught promise errors:** Page-error monitoring recorded none in production success/failure cases or the corrected lab. The broken lab's caught, console-logged TypeError was captured as the intentional reproduction.
- [x] **PASS — Keyboard/focus:** Tab order search → region → Reset; native keyboard region selection; Enter reset; focus return; visible outline. Enter in the search form did not navigate. Keyboard Retry restored focus appropriately.
- [x] **PASS — Responsive widths:** Success, loading, and HTTP error states tested at 320, 390, 768, and 1366px. Cards reflowed to 1, 1, 2, and 3 columns. Controls remained at least 44px high; flags used `object-fit: contain`.
- [x] **PASS — No horizontal overflow:** Document/body fit each viewport during success, and the document fit during loading/error at all four widths.
- [x] **PASS — Broken async lab fixed:** Reproduced `TypeError: countries.forEach is not a function`, inspected the Promise, then retested the fixed example against real success and controlled HTTP 500.
- [x] **PASS — Root cause documented:** [FIX-REPORT.md](debug-lab/FIX-REPORT.md) records reproduction, exact console error, inspected values, missing await/status/feedback/cleanup, corrections, and retests.

## Additional Tests

| Test | Actual evidence |
|---|---|
| Fetch once / no reload | One countries request and one initial navigation through the full success/search/filter flow. No request per keystroke. Retry is a separate explicit load. |
| Network-style failure | Browser aborted the countries request with `net::ERR_FAILED`; visible connection guidance and Retry appeared, with no uncaught exception. |
| Unexpected payloads | Object payload, null record, missing name/code/region, and duplicate country codes each produced an error with no cards. |
| Missing optional data | Missing capital, population, and languages each rendered **Not listed**. |
| Safe rendering | HTML-like country name displayed literally; no injected image node or script execution. |
| Timeout | Only in QA, accelerated the app's 15000ms timer to 100ms and held the request. The timeout message appeared and loading cleared. |
| Flag failure | Aborted the flag request; a readable **Flag unavailable** label replaced the image while country facts remained. |
| Flags in normal flow | Visible flags loaded, had meaningful alt text, and preserved aspect ratio. |
| JavaScript syntax | `node --check` passed for all four production modules and all three lab modules. |
| Normal console/assets | Zero console errors, uncaught page errors, failed requests, HTTP failures, import errors, or CORS errors during the real success/search/filter/responsive flow. |
| Project boundary | Final Git inspection showed only the new Day 14 folder; existing completed projects and root README remained unchanged. No commit or push. |

## How Errors Were Demonstrated

Browser QA intercepted the exact API URL pattern `https://countries.dev/countries?*`. It returned an HTTP 503 JSON response for the first request, then allowed the Retry request to reach the actual API. This verified `response.ok`, user-facing error handling, and real recovery independently of external service downtime.

Equivalent Playwright setup, after creating a page pointed at a local server:

```js
await page.route("https://countries.dev/countries?*", (route) =>
  route.fulfill({
    status: 503,
    headers: { "access-control-allow-origin": "*" },
    contentType: "application/json",
    body: JSON.stringify({ error: "Controlled QA HTTP failure" }),
  })
);
await page.goto("http://127.0.0.1:8000/");
// Observe the error, then remove the interception before retrying:
await page.unroute("https://countries.dev/countries?*");
await page.getByRole("button", { name: "Try again" }).click();
```

Other isolated scenarios aborted the request, supplied invalid JSON/schema, returned an empty array, and held the response for loading/timeout checks. Controlled payloads were confined to browser testing. They are not the app's default data source.

To repeat a network-error demonstration manually without changing source:

1. Serve the app and open it in Chrome with DevTools.
2. Open DevTools **Network request blocking** and add `*countries.dev/countries*`.
3. Enable blocking and refresh. Local modules still load; the country request fails and the error panel appears.
4. Disable that blocking rule and click **Try again**. Results should load without a page reload.

For the lab, run the broken example first, inspect the console/types, then run the fixed example. The same browser interception technique can return HTTP 500 when testing the fixed lab.

## Console Distinction

The normal explorer flow had **zero errors**. During intentional HTTP/network failure tests, Chrome logged expected failed requests (503 or `net::ERR_FAILED`); the app caught them and showed a useful error, with **zero uncaught exceptions/rejections**. The separate broken lab intentionally logged the reproduced TypeError. The fixed lab added no console errors in its real success case; its controlled 500 appeared as an expected failed request.

## Actual Screenshots

- [Normal country results](screenshots/normal-results.png)
- [Mobile layout](screenshots/mobile-layout.png)
- [Empty search](screenshots/empty-search.png)
- [HTTP error](screenshots/error-state.png)
- [Loading](screenshots/loading-state.png)
- Responsive success: [320px](screenshots/width-320.png), [390px](screenshots/width-390.png), [768px](screenshots/width-768.png), [1366px](screenshots/width-1366.png)
- Responsive errors: [320px](screenshots/error-width-320.png), [390px](screenshots/error-width-390.png), [768px](screenshots/error-width-768.png), [1366px](screenshots/error-width-1366.png)
- Debug lab: [broken](screenshots/debug-broken.png), [fixed](screenshots/debug-fixed.png)

These are real browser captures, not generated screenshots. Normal results and the mobile Japan view use real API data. The error/loading captures demonstrate controlled test conditions. Representative desktop, mobile, empty, and error screenshots were visually inspected.

## Remaining Issues / Test Limits

No known failing requirement in the tested Chrome browser. Other browser engines, physical touch devices, and full screen-reader testing were not performed. API/CDN availability and the provider's data freshness remain external dependencies. The timeout was tested with an accelerated QA timer rather than waiting the full 15 seconds. No Day 15 assessment, score, or progression decision was created.
