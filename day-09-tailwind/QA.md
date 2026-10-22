# Days 9–10 QA

Verified on **October 22, 2026**. Results below describe executed checks, not assumed passes.

## Environment and scope

| Tool | Actual version |
| --- | --- |
| Node | 24.21.0 |
| npm | 11.19.0 |
| create-vite | 9.3.1 |
| Vite | 8.3.5 |
| Tailwind CSS | 4.3.3 |
| @tailwindcss/vite | 4.3.3 |
| Chrome (headless, installed browser) | 155.0.8059.86 |

The branch is `day-09-10-tailwind`. All deliverables are under `day-09-tailwind/`. `git diff --exit-code -- day-01-html day-06-bootstrap README.md` returned success with no changes. No commit or push was performed.

## DAY 9

- [x] **Vite setup correct:** official current vanilla scaffold; no React. All three HTML files are explicit production build inputs using Vite 8's `build.rolldownOptions.input`.
- [x] **Tailwind current Vite plugin used:** `@tailwindcss/vite` is installed and registered as `tailwindcss()` in `vite.config.js`.
- [x] **`@import "tailwindcss"` used:** first statement in `src/style.css`; shared entry imports that stylesheet on every page.
- [x] **`npm run dev` works:** `npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort` started Vite successfully. The final clean startup reported ready in 460 ms. The page and CSS endpoint returned HTTP 200; Chrome confirmed `text-3xl` computed to 30px during the initial tooling check.
- [x] **T01 SaaS Hero complete:** semantic split hero, CTA group, local workspace illustration, sample trust marks with an explicit fictional-content note, descriptive content, and progressive mobile-to-desktop layout.
- [x] **T03 Product Card complete:** three product articles with consistent visual height, badges, product names, descriptions, prices, and specifically named CTA links. Equal-height grid rows and flex card content align the actions.
- [x] **Responsive variant drill complete:** product grid measured one column at 320/390px, two at 768px, and three at 1024/1366px. The section is identified as a responsive layout study and includes responsive padding, type size, and alignment.
- [x] **No obsolete Tailwind config:** no `tailwind.config.js`, PostCSS config, or v3 `@tailwind` directives. No unnecessary configuration files were introduced.

## DAY 10

- [x] **T04 Sidebar complete:** the same navigation wraps above content on smaller screens, then becomes a 240px-wide sticky desktop sidebar at 1024px. Every item has a working local target. Overview has an active state. No menu JavaScript is needed.
- [x] **T05 Dashboard complete:** four KPI cards, a six-month revenue chart with text values in its caption, four activity entries with semantic timestamps, and five recent orders with status labels.
- [x] **Auth form states complete:** sign-in and registration cards include normal, hover, focus, disabled submit, and a separately labeled error-ready state. Reset buttons were filled and clicked; both reset their respective forms. Password matching and real authentication are explicitly outside the demo.
- [x] **Visible focus:** real Tab navigation checked focusable links, inputs, checkboxes, reset buttons, and the table region on every page at every width. Focus outlines computed to solid and at least 2px (the shared baseline is 3px). Disabled submit controls were skipped. The skip link becomes visible, and Enter moves focus to main content.
- [x] **Responsive dashboard:** KPI columns measured 1/1/2/2/4 at the five requested widths. Navigation position changed from static to sticky at the desktop breakpoint. Chart and activity content fit the layout.
- [x] **No excessive arbitrary values:** zero square-bracket arbitrary utility tokens across all three pages. Standard spacing, sizing, type, color, and breakpoint utilities are used. No custom media queries or component CSS architecture.
- [x] **No horizontal page overflow:** `document.documentElement.scrollWidth === innerWidth` in all 15 page/viewport combinations, in both development and production checks. The table alone scrolls where necessary. No global `overflow-x-hidden` is used.

## GENERAL

- [x] **No console errors:** browser console error, uncaught page error, failed-request, and HTTP 400+ listeners produced an empty error list in both complete browser runs.
- [x] **No broken local assets:** all requested resources loaded successfully. The only external file asset is the project-local favicon; illustrations and icons use HTML/Tailwind or inline SVG. No remote image/font dependency exists.
- [x] **Semantic HTML:** one main and one H1 per page; header/nav/section/article/aside/footer/form/label/button/table elements used appropriately. Table headers include column and row scope. Inputs have associated labels; descriptions resolve to existing IDs; no duplicate IDs were found. Meaningful status icons have an image role/name, while decorative SVGs are hidden.
- [x] **Keyboard check:** skip links, navigation, form fields, reset controls, checkbox focus, and keyboard table scrolling were exercised in Chrome. Error feedback includes text rather than relying solely on color.
- [x] **`npm run build` succeeds:** final build exited 0, transformed seven modules, and emitted all three HTML files plus shared CSS and JS. Final build time: 214 ms.

## Commands actually executed

PowerShell blocks the machine's `npm.ps1`; the `.cmd` executable runs the same npm commands without changing execution policy.

| Command | Result |
| --- | --- |
| `node --version` | `v24.21.0` |
| `npm.cmd --version` | `11.19.0` |
| `npm.cmd create vite@latest day-09-tailwind -- --template vanilla --no-interactive` | Success; create-vite 9.3.1 |
| `npm.cmd install` | Exit 0; 15 packages added; audit reported 0 vulnerabilities |
| `npm.cmd install tailwindcss @tailwindcss/vite` | Exit 0; 17 packages added; audit reported 0 vulnerabilities |
| `npm.cmd list --depth=0` | Confirmed Vite 8.3.5 and both Tailwind packages 4.3.3 |
| `npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort` | Successful clean startup; HTTP 200; complete development browser run |
| `npm.cmd run build` | Exit 0; all three pages emitted |
| `npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort` | Successful startup; complete production browser run |
| `node qa/browser-check.cjs` with the existing Playwright module path | 15 development page/viewport checks passed |
| Same QA runner with `QA_BASE_URL=http://127.0.0.1:4173` and `QA_REPORT_NAME=browser-results-production.json` | 15 final production page/viewport checks passed |
| `git diff --exit-code -- day-01-html day-06-bootstrap README.md` | Exit 0; completed projects and root README untouched |
| `git check-ignore day-09-tailwind/node_modules day-09-tailwind/dist` | Both generated directories ignored |

An initial setup-time dependency scan warned about not-yet-created HTML entry files. The files were then created and the dev server restarted; the final clean startup and both complete browser runs had no such warning. A test assertion initially expected a table scrollbar at 768px; actual measurement showed every column fit at that width. The runner was corrected to require scrolling only when the table exceeds its container. Visual review also identified and resolved conflicting normal/error input border utilities before the final production check.

## Responsive evidence

Each row was verified for all three pages in development and again against the built production output. Heights were 900px; screenshots capture the full page.

| Viewport | Page overflow | Hero columns | Product columns | KPI columns | Dashboard navigation | Auth cards |
| --- | --- | --- | --- | --- | --- | --- |
| 320px | None | 1 | 1 | 1 | Wrapping top nav | Stacked |
| 390px | None | 1 | 1 | 1 | Wrapping top nav | Stacked |
| 768px | None | 1 | 2 | 2 | Wrapping top nav | Two columns |
| 1024px | None | 2 | 3 | 2 | Sticky sidebar | Two columns |
| 1366px | None | 2 | 3 | 4 | Sticky sidebar | Two columns |

Landing CTA groups switch from stacked to inline at `sm`. The workspace preview scales within its column. Product visuals share a fixed utility-scale height, while card contents stretch consistently within each row. Auth fields stay within their cards at every requested width.

The table keeps all five columns and all five records:

| Viewport | Table container width | Table content width | Behavior |
| --- | --- | --- | --- |
| 320px | 278px | 672px | Horizontal scroll; ArrowRight verified |
| 390px | 348px | 672px | Horizontal scroll; ArrowRight verified |
| 768px | 702px | 702px | Entire table fits |
| 1024px | 718px | 718px | Entire table fits |
| 1366px | 1044px | 1044px | Entire table fits |

## Browser evidence and screenshots

- [Development results](qa/browser-results.json): measured dimensions, grid columns, navigation position, keyboard checks, and empty errors list.
- [Final production results](qa/browser-results-production.json): the same checks against Vite's built output.
- [Repeatable browser runner](qa/browser-check.cjs): QA-only code, never imported by the application. This session used the preinstalled Playwright module at `C:/Users/omar_/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` through `PLAYWRIGHT_MODULE`.

| Page | 390px mobile | 1366px desktop |
| --- | --- | --- |
| Landing | [Screenshot](screenshots/index-390.png) | [Screenshot](screenshots/index-1366.png) |
| Dashboard | [Screenshot](screenshots/dashboard-390.png) | [Screenshot](screenshots/dashboard-1366.png) |
| Auth | [Screenshot](screenshots/auth-390.png) | [Screenshot](screenshots/auth-1366.png) |

All six screenshots were visually reviewed; the final captures come from the production preview. Review covered heading wrapping, CTA fit, card consistency, chart/activity readability, field fit, and the explicit rose error border. Dark text/light surfaces and light text/dark actions were visually checked for readability. This is not a formal WCAG contrast or screen-reader certification; no numerical contrast audit or screen-reader session is claimed. Browser coverage is Chrome on this machine, not physical-device or cross-browser testing.

## Remaining issues and scope

No known blocking issue remains in the requested Days 9–10 scope. Authentication, purchasing, data loading, filtering, storage, API calls, and Day 11 delivery are intentionally absent. No live deployment, peer review, or trainer review is claimed.

The dev and preview servers used for verification are stopped after QA. Restart with the documented commands.

## Suggested Git commits

Suggested milestones only; no commits have been created:

1. `setup Tailwind Vite project`
2. `build T01 SaaS hero and responsive variants`
3. `complete T03 Tailwind product cards`
4. `add T04 responsive admin sidebar`
5. `complete T05 analytics dashboard`
6. `add auth form interaction states`
7. `document Days 9 and 10 QA`

The sidebar and dashboard share `dashboard.html`; use partial staging if preserving those as separate milestones.

**DAYS 9-10 IMPLEMENTATION STATUS: COMPLETE**
