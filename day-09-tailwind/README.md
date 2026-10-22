# Forma — Tailwind SaaS Project

Grids Apps Full Stack Web Development Foundation Track, Days 9–11.

Forma is a fictional workspace SaaS for teams that want clearer projects, connected people, and useful business context. This project integrates the original Tailwind hero, product cards, overview dashboard, and auth states into **nine distinct multi-page HTML views** for Day 11 delivery.

## Page Map

| View | File | Purpose |
| --- | --- | --- |
| Landing | [index.html](index.html) | Hero, sample trust marks, features, product showcase, workflow, pricing, illustrative testimonials, FAQ, final CTA, footer. |
| Overview | [dashboard.html](dashboard.html) | Four KPIs, six-month revenue visual, activity feed, recent orders. |
| Customers | [customers.html](customers.html) | Customer metrics, six-account directory, plan/status/activity, relationship notes. |
| Products / Orders | [products.html](products.html) | Module catalogue, prices, sample seat capacity, six recent orders. |
| Analytics | [analytics.html](analytics.html) | Acquisition KPIs, proportional conversion meters, customer health, channel table. |
| Reports | [reports.html](reports.html) | Report library, register, summaries, and three working local text downloads. |
| Settings | [settings.html](settings.html) | Workspace and notification controls, native reset, disabled save and managed-field states. |
| Profile | [profile.html](profile.html) | Sample account identity, workspace role/contact details, current responsibilities. |
| Auth | [auth.html](auth.html) | Sign-in and registration UI, visible focus, disabled submits, explicit error-state demonstration. |

The seven dashboard views share the same desktop sidebar, compact small-screen navigation, header, active-page marker, and visual system. Public navigation links the landing and auth pages to the workspace. All CTAs have local destinations.

## Technology

- Semantic HTML5 and vanilla Vite; no framework or component library.
- Vite **8.3.5**.
- Tailwind CSS **4.3.3** and **@tailwindcss/vite 4.3.3**.
- Verified with Node **24.21.0**, npm **11.19.0**, and installed Chrome **155.0.8059.86**.
- `src/main.js` contains only the CSS import. No application JavaScript behavior is implemented.

Dependency versions are pinned in `package.json` and recorded in `package-lock.json`. Use a supported Node release compatible with Vite; Node 24 was used here.

## Install

From the repository root:

```sh
cd day-09-tailwind
npm install
```

## Develop

```sh
npm run dev
```

Open Vite's printed Local URL. Serve these pages through Vite rather than opening source HTML directly, because Tailwind must be compiled.

## Build

```sh
npm run build
```

Vite emits all nine HTML entry points and shared assets into `dist/`. Files in `public/`, including the favicon and static sample reports, are copied to the build. Generated `dist/` and `node_modules/` directories are ignored by Git.

## Preview the Production Build

```sh
npm run preview
```

Open the printed Local URL and follow the navigation. Build before previewing so the output reflects current source. Preview is a local verification server, not a live deployment.

On this Windows machine, PowerShell blocks `npm.ps1`. Use `npm.cmd install`, `npm.cmd run dev`, `npm.cmd run build`, and `npm.cmd run preview`, or run ordinary npm commands in Command Prompt. No execution-policy change is needed.

## Tailwind and Vite Integration

`vite.config.js` registers the official `tailwindcss()` Vite plugin. Its `build.rolldownOptions.input` contains the nine HTML pages. Node's URL helpers resolve the entries across platforms, and `base: "./"` keeps generated asset references relative.

Every page loads `src/main.js`, which imports `src/style.css`. The stylesheet begins with:

```css
@import "tailwindcss";
```

The only additional CSS is a shared `:focus-visible` outline baseline in `@layer base`. Layout, typography, color, spacing, states, and component appearance are expressed with Tailwind utilities. There is no Tailwind v3 directive setup, Tailwind configuration file, custom media-query architecture, or PostCSS configuration.

References: [Vite guide](https://vite.dev/guide/), [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite).

## Responsive Approach

- Mobile styles are the base. Standard `sm:`, `md:`, `lg:`, and `xl:` prefixes introduce changes where space supports them.
- The original product-card drill uses `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- The hero becomes a split layout at `lg`; auth cards become two columns at `md`.
- Dashboard navigation uses a two-column compact grid on narrow screens, wrapping links at `sm`, and a persistent sidebar from `lg`. The sidebar can scroll independently on short desktop screens.
- KPI grids progress from one to two to four columns. Data/content panels split at wider breakpoints.
- Tables keep every column inside named, keyboard-focusable horizontal scroll regions. No global overflow hiding is used.
- All nine pages were checked at **320, 390, 768, 1024, and 1366px**. See [QA.md](QA.md) for actual results.

## Accessibility and Native Interaction

- Each page has a unique title, one H1, semantic landmarks, logical headings, and a skip link to focusable main content.
- Links navigate; buttons perform native form actions. FAQ disclosure uses native `details`/`summary` and works with the keyboard.
- A three-pixel focus outline, input focus rings/borders, hover feedback, and disabled variants make states visible.
- Form controls have labels and appropriate descriptions. Settings resets restore text, selects, and checkboxes using native HTML behavior.
- Save and authentication submission are disabled and explained. Form controls have no submission names; no information is processed or stored by the project.
- The auth error example is explicitly labeled as a demonstration and combines text, a rose border, `aria-invalid`, and an associated explanation.
- Tables use captions and scoped headers. Visualizations also provide readable values. The conversion meters have native numeric ranges and accessible labels.
- Decorative SVGs are hidden from assistive technology. Meaningful initials/status symbols have names; no remote images or fonts are required.
- Browser checks include computed text foreground/background contrast. This is not a complete accessibility certification; screen-reader and physical-device testing have not been performed.

## QA and Screenshots

[QA.md](QA.md) records build/preview results, the full nine-view responsive matrix, browser checks, limits, and screenshot links. [DAY11-DELIVERY.md](DAY11-DELIVERY.md) contains the demo script and an unfilled trainer/peer checklist.

The optional [browser QA runner](qa/browser-check.cjs) requires an existing Playwright installation and installed Chrome. It is test tooling and is never imported into the application. Use an external module path through `PLAYWRIGHT_MODULE` if Playwright is not locally installed:

```powershell
$env:PLAYWRIGHT_MODULE = 'C:/path/to/node_modules/playwright'
node qa/browser-check.cjs
```

With Vite preview running, point the same runner at the built output:

```powershell
$env:QA_BASE_URL = 'http://127.0.0.1:4173'
$env:QA_REPORT_NAME = 'browser-results-day11-production.json'
node qa/browser-check.cjs
```

The default development target is `http://127.0.0.1:5173`. The runner checks every page at five widths, exercises native controls and keyboard navigation, verifies local links, records measurements and text contrast pairs, and captures ten representative full-page screenshots.

## Project Structure

```text
day-09-tailwind/
  index.html
  dashboard.html
  customers.html
  products.html
  analytics.html
  reports.html
  settings.html
  profile.html
  auth.html
  vite.config.js
  package.json
  package-lock.json
  .gitignore
  src/
    main.js
    style.css
  public/
    favicon.svg
    reports/
      revenue-sample.txt
      customer-sample.txt
      operations-sample.txt
  qa/
    browser-check.cjs
    browser-results-day11.json
    browser-results-day11-production.json
    source-recovery.json
    preserved-components.json
  screenshots/
    day11-*.png
  README.md
  QA.md
  DAY11-DELIVERY.md
```

## Source Recovery Note

At the start of this Day 11 session, this branch contained only the previous `dist/` output and `node_modules/` inside the Tailwind directory; the source, docs, screenshots, and earlier runner were absent. The three original pages and favicon were recovered from the built output before extending them. The Vite config, package manifest/lockfile, CSS entry, documentation, and QA tooling were restored.

[Recovery hashes](qa/source-recovery.json) identify those original build artifacts. [Preservation evidence](qa/preserved-components.json) records that the hero, original product-card section, and auth main content were retained verbatim during integration, before source formatting. The overview's KPI/chart/activity/order content was retained while its navigation/header were integrated with the new pages.

## Known Limitations

- Forma and all company/customer content, testimonials, metrics, prices, and reports are illustrative training material.
- Authentication, checkout, editing/saving, persistence, APIs, filtering, and live data are not implemented. The three report downloads are static samples.
- UI navigation and native controls are usable; this is a static frontend project rather than a production SaaS service.
- Browser verification covers Chrome on this machine, not other browsers, physical devices, or a screen reader.
- A human live demo and trainer/peer review remain to be completed. No deployment or review has been claimed.
- Day 12 JavaScript beginner challenges have not been started.

## Author

**Omar Farran** — Grids Apps Full Stack Web Development Foundation Track.

Work stays in `day-09-tailwind/`. The completed `day-01-html/` and `day-06-bootstrap/` projects and repository-root README are unchanged. No commit or push was performed.
