# Day 14 - Async, Fetch & Modules

## Objective

Build J-A01 Country Explorer: consume a real public API, handle application states, separate responsibilities into ES modules, and diagnose an intentionally broken async example. The app is called **Atlas**.

## Features

- Fetch real country data once on page load; no bundled/mock country dataset.
- Search country names live with trimmed, case-insensitive partial matching.
- Combine search with a region filter; Reset filters clears both.
- Show flag, country name, capital, region, formatted population, and languages.
- Visible loading, success, empty, and error states with accessible status feedback.
- Retry a failed request without reloading the page.
- Catch HTTP, network, JSON, schema, and timeout failures.
- Four focused ES modules and a separate broken/fixed async debugging lab.
- Responsive country cards and keyboard-accessible controls.

## Concepts Practiced

Promises, `async`/`await`, `fetch`, `Response.ok`/status, JSON parsing, `try`/`catch`/`finally`, ES modules, `import`/`export`, DOM creation, state-driven rendering, array methods, local filtering, and request cancellation with `AbortController`.

## Architecture

| Module | Responsibility |
|---|---|
| `js/main.js` | Cached DOM references, application state, event wiring, load/retry lifecycle, and coordination. |
| `js/api.js` | Endpoint, fetch, HTTP checks, awaited JSON parsing, required-field validation, error messages, timeout, and timer cleanup. |
| `js/ui.js` | Safe country cards, region options, loading/success/empty/error rendering, control availability, and live feedback. |
| `js/utils.js` | Pure normalization, combined filtering, population formatting, and flag URL helpers. |

The module refactor separates data access, UI rendering, coordination, and reusable logic. `main.js` imports the other concerns instead of implementing them itself; `ui.js` never fetches and `utils.js` never touches the DOM. There are no classes, CommonJS, dependencies, or build tools in the application.

```text
day-14-javascript-async/
  index.html
  assets/css/style.css
  js/
    main.js
    api.js
    ui.js
    utils.js
  debug-lab/
    index.html
    lab.js
    broken-app.js
    fixed-app.js
    FIX-REPORT.md
  README.md
  QA.md
  screenshots/
```

## Running

Use **HTTP**, because ES modules and fetch should run through a local server. In VS Code, open this project folder and use **Live Server** on `index.html`. No npm installation or build step is required.

Alternatively, if Python is installed, run this from the Day 14 folder:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8000/`. The debug lab is at `http://127.0.0.1:8000/debug-lab/`. Stop the server with Ctrl+C. When serving the whole repository, use `/day-14-javascript-async/` instead. Opening the HTML directly with a `file:` URL is not a supported way to run this project.

## API

Actual endpoint:

```text
https://countries.dev/countries?fields=name,alpha2Code,capital,region,population,languages
```

[Countries.dev documentation](https://countries.dev/docs/api/countries) describes the country-list endpoint and field selection. On 23 October 2026, the exact endpoint returned HTTP 200, 250 country/territory records, and `Access-Control-Allow-Origin: *` in the browser test.

REST Countries was checked first: its v3.1 endpoint returned an HTTP 200 deprecation payload rather than a country array. This project therefore uses Countries.dev as a working public, keyless alternative. No API key or account is embedded in the app.

The normalized application record contains `code`, `name`, `capital`, `region`, `population`, and `languages`. Required names, regions, and unique two-letter codes are validated. Missing optional capital/population/language values display **Not listed**. Records are sorted by name. API regions Polar, Antarctic Ocean, and Antarctic are grouped under **Antarctic**; region options otherwise come from the returned data.

Flag images use validated country codes with `https://flagcdn.com/w320/{code}.png`, provided by [Flagpedia / Flagcdn](https://flagcdn.com/). Images preserve their aspect ratio with `object-fit: contain`, load lazily, and fall back to a text label if unavailable. Flag URLs are generated from validated codes instead of trusting arbitrary URLs from API data.

## Async Flow and States

1. `loadCountries()` guards against overlapping loads, disables filters, and shows Loading.
2. `fetchCountries()` awaits `fetch()`, checks `response.ok`, then awaits `response.json()`.
3. A successful response is validated and normalized; the UI renders cards and enables filters.
4. Search and region selection use `filter()` on the loaded array without another API request.
5. No matches show an empty state. An empty API array has its own empty message.
6. A failure shows a useful error and Try again button. A 15-second timeout prevents indefinite loading.
7. `finally` clears the API timer and the coordinator's loading flag. Retry invokes the same real load function; it does not navigate or reload. Focus returns to search after successful retry, or to Retry after another failure.

HTTP 404/500 responses do **not** automatically reject `fetch()`. That is why `response.ok` is checked before parsing/rendering. Both request retrieval and JSON parsing return promises and need to be awaited. Untrusted data is rendered with `textContent` and DOM APIs, not `innerHTML`.

## Promise Chains and async/await

An `async` function returns a promise. `await` waits for that promise's fulfillment value inside an async function; rejection can be handled by `catch`. The same exported API function could also be consumed with a promise chain inside a module:

```js
import { fetchCountries } from "./js/api.js";

fetchCountries()
  .then((countries) => {
    console.log(`Loaded ${countries.length} countries`);
  })
  .catch((error) => {
    console.log(`Could not load countries: ${error.message}`);
  });
```

`.then()` receives the resolved data; `.catch()` receives a rejection, including an error thrown in the preceding callback. This is an explanation, not an extra request in the actual application, which uses async/await and visible UI feedback.

## Debug Lab and Error Demonstration

Open `debug-lab/` through the same local server, then run the broken example with the console open. It intentionally calls an array method on the promise returned by `response.json()`, logs an error, and leaves loading stuck. Run the fixed example to compare awaited data, visible errors, HTTP checks, and cleanup. The broken module is never imported by the main explorer.

[FIX-REPORT.md](debug-lab/FIX-REPORT.md) records the exact observed error, inspected types, root causes, and tested corrections. [QA.md](QA.md) explains the controlled HTTP/network failure tests and how to repeat an error demonstration without editing production source.

## Limitations

- Frontend only; no backend, API key, accounts, persistent cache, or offline dataset.
- Depends on Countries.dev, Flagcdn, network access, and their CORS/availability behavior.
- Country facts, names, classification, and population dates come from the provider; they are not independently updated by this project.
- Data is fetched once per page load or retry. Search/filter do not issue requests; choices reset on refresh.
- No details modal, pagination, or Day 15 assessment project was added.
- Browser testing covered Chrome. Other engines, physical devices, and full screen-reader testing remain unverified.

See [QA.md](QA.md) and [machine-readable results](screenshots/qa-results.json) for the actual verification record.
