# Day 6 Quality Review

> This section records the Day 6 implementation before the Day 7 extension. Current component results are recorded in the Day 7 section below.

Verified on 12 October 2026 using real Microsoft Edge / Chromium in headless mode through Playwright. Bootstrap CSS loaded successfully from the official CDN during every check. Full-page screenshots were visually reviewed at all 12 page/width combinations.

## Responsive results

Columns refer to feature cards, pricing tiers, or dashboard KPI cards. Navigation was visible, usable, and inside the viewport at every width. No unresolved layout issue was observed.

| Page | Width | Grid columns | Hero / sidebar | Horizontal page overflow | Table | Navigation | Layout issue |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| Home | 320px | 1 | Hero stacked | None | N/A | Pass | None |
| Home | 390px | 1 | Hero stacked | None | N/A | Pass | None |
| Home | 768px | 2 | Hero stacked | None | N/A | Pass | None |
| Home | 1366px | 3 | Hero side by side | None | N/A | Pass | None |
| Pricing | 320px | 1 | N/A | None | N/A | Pass | None |
| Pricing | 390px | 1 | N/A | None | N/A | Pass | None |
| Pricing | 768px | 1 | N/A | None | N/A | Pass | None |
| Pricing | 1366px | 3 | N/A | None | N/A | Pass | None |
| Dashboard | 320px | 1 | Sidebar above content | None | Horizontal scroll inside table area | Pass | None |
| Dashboard | 390px | 1 | Sidebar above content | None | Horizontal scroll inside table area | Pass | None |
| Dashboard | 768px | 2 | Sidebar above content | None | All columns fit | Pass | None |
| Dashboard | 1366px | 4 | Sidebar beside content | None | All columns fit | Pass | None |

Home initially had a narrow-screen gutter overflow. It was corrected using `gx-4 gy-5` in the hero, then the full checks were repeated successfully. Page overflow is checked with document scroll width against viewport width; it is not hidden with CSS.

## Implementation review

- Bootstrap 5.3.8 CSS URL, SRI hash, and `crossorigin="anonymous"` match the [official 5.3 Quick Start](https://getbootstrap.com/docs/5.3/getting-started/introduction/).
- All pages use HTML5 doctype, English language, UTF-8, unique titles, and viewport metadata. Bootstrap loads before `assets/css/custom.css`.
- Home: software-company heading, realistic description, two page-link CTAs, a static progress preview, and three Bootstrap feature cards.
- B01: Starter / Professional / Business tiers, prices, descriptions, feature lists, working detail CTAs, and a recommended Professional badge, border, background, and shadow.
- B03: responsive sidebar, topbar with account label, four KPI cards, recent projects table, and monthly report. Every sidebar anchor resolves to visible content.
- Grid examples: `container`, `container-fluid`, `row`, `col-12`, `col-md-6`, `col-lg-4`, `col-lg-7`, `col-lg-5`, `col-lg-2`, `col-lg-10`, `col-xl-3`, `g-3`, `g-4`, `gx-4`, `gy-3`, `gy-5`.
- All tested rows have column children; all tested columns have row parents. Each row sits within a Bootstrap container.
- Utility examples: `m-0`, `p-3`, `p-4`, `p-md-4`, `mt-auto`, `mt-4`, `mb-4`, `py-5`, `px-4`, `d-flex`, `d-inline-flex`, `d-none`, `d-lg-block`, `flex-column`, `flex-sm-row`, `flex-wrap`, `justify-content-between`, `align-items-center`, `gap-3`, `text-center`, `text-secondary`, `fw-bold`, `display-4`, `lead`, `w-100`, `h-100`, `bg-white`, `border`, `rounded-4`, `shadow-sm`.
- Custom CSS adds teal/navy/mint variables, readable secondary text, brand marks, a hero background, recommended-plan treatment, button component variables, sidebar identity, native progress styling, table minimum width, and keyboard focus. Bootstrap owns the layout and breakpoints.
- No inline CSS, custom CSS Grid, `!important`, overflow-hiding workaround, copied Bootstrap source, application JavaScript, or Day 7 interactive components.
- Fictional product and dashboard data are explicitly labeled. Pricing CTAs explore details rather than pretending to purchase a plan.

## Accessibility and navigation

- axe-core scans at every page/width combination found **zero violations** for the selected WCAG 2 A/AA and WCAG 2.1 A/AA rule tags, including applicable contrast checks.
- Semantic landmarks, one H1 per page, logical section headings, descriptive links, current-page markers, and unique IDs were verified.
- Table includes a caption, column headers and row headers with `scope`, and visible status text. Native progress elements have labels and numeric values.
- The table scroll region has an accessible name, instructions, and keyboard focus. ArrowRight moved its scroll position at 320px and 390px without moving the page horizontally.
- The skip link became visible on Tab, showed a focus outline, and moved focus into main content on Enter.
- All nine primary navigation combinations, four dashboard sidebar links, and three pricing CTAs were exercised successfully: **16 link checks passed**.
- No browser page errors were observed. All pages returned HTTP 200.

These checks cover Chromium rendering, automated accessibility rules, visual inspection, and selected keyboard behavior. They do not constitute a screen-reader audit or testing on physical devices, Firefox, or Safari.

## Files and Git

Created: `index.html`, `pricing.html`, `dashboard.html`, `assets/css/custom.css`, `README.md`, and this `QA.md`, all inside `day-06-bootstrap/`.

Existing files modified: none. `day-01-html` remains unchanged. No commit or push was performed. Test dependencies and screenshots were kept in temporary storage outside the repository; the temporary preview server was stopped after testing.

No known remaining Day 6 issues. Internet access remains necessary for the Bootstrap CDN.

Suggested commit messages for the author's review:

- `setup bootstrap day 6 project`
- `build responsive bootstrap hero and card grid`
- `complete B01 responsive pricing challenge`
- `complete B03 dashboard summary challenge`


## Day 7 — Components, Forms & Interaction

Verified on 12 October 2026 in real headless Microsoft Edge 155.0.4283.45 / Chromium using the existing Playwright and axe-core tools outside the repository. No npm commands or dependency installations were used for Day 7. Bootstrap's official 5.3.8 CSS and matching bundle loaded successfully with their integrity/crossorigin attributes on all four pages. Each page has exactly one bundle include near the end of body.

### Acceptance checks

| Requirement | Result | Actual evidence |
| --- | --- | --- |
| Bootstrap JS bundle | PASS | Runtime version 5.3.8; matching CSS; one script per page; no custom application JS |
| Navbar desktop behavior | PASS | Horizontal Home / Pricing / Dashboard / FAQ links at 1366px; toggler hidden; correct current-page state |
| Offcanvas mobile behavior | PASS | Opens using keyboard toggle on every page at 320px, 390px, 768px; fits viewport; links remain usable |
| Offcanvas Escape/close | PASS | Close button, Escape, backdrop dismissal, and reopening exercised at each narrow page/width combination |
| Modal open/close | PASS | Home CTA opens modal; header close, Cancel, Escape, backdrop, and reopening exercised at all four widths |
| Modal form validation | PASS | Native submission blocks empty fields, malformed email, missing service, short message/name, and unchecked consent; valid sample fields accepted |
| Modal labels | PASS | Name, Email, optional Company, Service, Message, and consent have associated labels; modal title and description resolve |
| FAQ accordion | PASS | All five questions opened/closed using Enter/Space at all widths; switching closes previous item; repeated activation works |
| Unique IDs | PASS | No duplicates, missing Bootstrap targets, or unresolved ARIA IDs on any page |
| Keyboard focus | PASS | Visible focus; background page controls cannot receive focus while overlays are open; dismissals return focus to triggers; skip links work |
| No console errors | PASS | Zero console errors or uncaught page errors during responsive, interaction, validation, and navigation runs |
| No broken links | PASS | All 40 local links/fragments verified; 32 primary navigation checks exercised on desktop and through mobile offcanvas |
| No missing assets | PASS | No failed requests or HTTP error responses during the browser run |
| No horizontal overflow | PASS | All 16 page/width combinations stayed within viewport width; offcanvas and modal also fit |
| Day 6 regressions | PASS | Main sections and original CSS match pre-edit baseline, apart from the added Home consultation section; grids and table remain responsive |

### Interaction and accessibility details

- Offcanvas uses `navbar-expand-lg`, Bootstrap data attributes, a titled panel, labeled toggle/close controls, and the official focus/backdrop behavior. It switches to horizontal navigation at 992px.
- Modal uses `modal-dialog-centered modal-dialog-scrollable`. Opening moves focus into the titled dialog; forward/reverse Tab checks did not focus background controls. Close button, Cancel, Escape, and backdrop all return focus to the consultation trigger.
- Browser chrome can receive focus at the modal's forward Tab boundary; the next Tab returns into the modal. The check distinguishes browser chrome (`document.hasFocus()` is false) from background page controls. No custom focus-trap code was added.
- Native validation uses `required`, email type, name minimum 2 characters, and message minimum 20 characters. Company is optional. No `novalidate` or custom validation script is used.
- A static informational alert explains the demo. A valid submission navigates back to Home's consultation section without entered values in the URL. Form controls deliberately omit `name` attributes, so no personal form values are serialized. There is no endpoint, storage, transmission, or success-message simulation.
- The FAQ has five realistic answers, unique IDs, matching targets/ARIA references, and one open answer at a time through `data-bs-parent`.
- All four pages retain unique titles, semantic headings, descriptive navigation, and current-page markers. The FAQ accordion, offcanvas, modal/form, and representative retained pages were visually reviewed in screenshots.
- axe-core inspected 36 distinct page/component states with WCAG 2 A/AA and WCAG 2.1 A/AA tags. Final settled-state scans reported zero violations. Four modal states were checked again after focus animations finished: early contrast flags occurred during the Cancel button's color transition, and all four follow-up scans passed. The test now waits for final colors before scanning.
- The completed run recorded 260 passing checks after those targeted follow-ups. The form's valid submission, skip links, modal reopening, and native invalid-field focus were verified in the browser.
- No screen-reader testing, physical-device testing, Firefox, or Safari testing was performed.

### Responsive results

All four pages were tested at each requested width with a 900px viewport height. There was no horizontal page overflow or unresolved layout issue; navigation worked in its appropriate mode.

| Width | Navbar | Home feature columns | Pricing columns | Dashboard KPI columns | Dashboard/table | FAQ/modal |
| ---: | --- | ---: | ---: | ---: | --- | --- |
| 320px | Offcanvas | 1 | 1 | 1 | Sidebar above; table scrolls inside its container | Readable; dialog fits |
| 390px | Offcanvas | 1 | 1 | 1 | Sidebar above; table scrolls inside its container | Readable; dialog fits |
| 768px | Offcanvas | 2 | 1 | 2 | Sidebar above; table fits | Readable; dialog fits |
| 1366px | Horizontal | 3 | 3 | 4 | Sidebar beside; table fits | Readable; centered dialog fits |

Additional modal checks at **320×568** and **390×740** passed: modal content fits, the body scrolls, the consent control is reachable, and the footer/submit controls stay visible. The mobile projects table remains keyboard-scrollable.

### Branding, files, and scope

Created: `faq.html`.

Modified: `index.html`, `pricing.html`, `dashboard.html`, `assets/css/custom.css`, `README.md`, and `QA.md`.

The Day 6 teal/navy/mint palette remains intact. Narrow CSS additions theme the navbar, offcanvas header, modal accent, accordion active state, alert, form focus, checkbox, and component focus outlines. Bootstrap owns layout and interaction. No inline source styles, `!important`, Tailwind, Vite, custom JS files, DOM lessons, APIs, or Day 8 expansion were introduced.

`day-01-html` is unchanged. No commit or push was performed. Test scripts, results, dependencies, and screenshots remain outside the repository in temporary storage; test browsers and temporary servers were closed.

Remaining issues: none known for the requested Day 7 scope. Internet access is needed for CDN assets. The consultation form remains intentionally frontend-only.

Suggested commits for the author's review:

- `add Bootstrap offcanvas navigation`
- `add Bootstrap modal contact form`
- `add accessible Bootstrap FAQ accordion`
- `update Day 7 interaction QA`

## Day 8 — Bootstrap Final Website

Verified on **22 October 2026** using real headless Microsoft Edge **155.0.4283.62**, the existing Playwright installation outside this repository, and axe-core **4.10.3** downloaded to temporary storage. The historical Day 6/7 sections above describe their original scope; this section supersedes them for final delivery.

### Final scope

The ten required pages are implemented: Home, About, Services, Service Detail, Products, Pricing, Blog, Blog Detail, FAQ, and Contact. Dashboard remains an additional eleventh page. Bootstrap 5.3.8, the teal/navy/mint branding, and the Day 7 offcanvas/modal/accordion are retained.

Every page shares the same eight-link navbar and eleven-link footer. Service Detail and Blog Detail highlight their parent sections and have breadcrumbs. New journeys connect service cards to service details and Contact; products to plans and the dashboard; blog cards to complete article sections and back; and FAQ answers to relevant pages. Home includes two explicitly fictional testimonials. Contact has a standalone, labeled demo project-brief form.

### Responsive results

All **66 page/width combinations** passed: eleven pages at each width below. Document scroll width never exceeded the viewport; navigation stayed inside it. No overflow-hiding workaround was used.

| Width | Navbar | Home feature columns | Pricing columns | Dashboard KPI columns | Project table |
| ---: | --- | ---: | ---: | ---: | --- |
| 320px | Offcanvas | 1 | 1 | 1 | Scrolls inside its region |
| 390px | Offcanvas | 1 | 1 | 1 | Scrolls inside its region |
| 768px | Offcanvas | 2 | 1 | 2 | Fits |
| 992px | Horizontal | 3 | 3 | 2 | Fits |
| 1024px | Horizontal | 3 | 3 | 2 | Fits |
| 1366px | Horizontal | 3 | 3 | 4 | Fits |

The standard viewport height was 900px. Additional modal interaction checks used **320×568**, and form/mobile navigation checks used **390×740**. The modal fit these screens and kept its controls reachable. The table scrolled using ArrowRight while the page remained within the viewport.

Initial checks found excessive horizontal gutters on Contact/Service Detail and insufficient breadcrumb contrast. The rows now use `gx-4 gy-5`; Bootstrap link RGB variables match the teal brand. The corrected checks passed.

### Functionality, navigation, and forms

- **694 functional/structural assertions passed**, including HTTP responses, responsive fit, offcanvas behavior, focus, landmarks, ID/ARIA references, forms, accordion, and link targets.
- **291 local link/fragment occurrences passed** file and destination-ID checks. Actual browser clicks additionally exercised all eight desktop navbar destinations, all eight mobile navbar destinations, and all eleven footer destinations.
- All eleven pages have one H1, one main landmark, a top-level footer, unique titles, associated form labels, and no duplicate IDs or missing Bootstrap/ARIA targets. Source structural tags are balanced.
- Offcanvas opened by keyboard on every page at 320/390/768px. All eight links fit, keyboard focus stayed inside the open panel, Escape dismissed it, and focus returned to the toggle. Mobile navigation clicks reached their destination pages.
- The Home modal was exercised at 320/768/1366px: it fit the viewport; Tab did not reach background controls; close button, Cancel, backdrop, and Escape worked; dismissal returned focus to the trigger.
- All five FAQ questions opened with Enter/Space at 320/768/1366px. Switching left one answer open; repeated activation closed it.
- Both forms blocked empty fields, one-character names, malformed email, missing service, messages under 20 characters, and missing consent. Valid sample input passed while optional Company remained empty. Submission returned to the intended static section without form values in the URL.
- Both forms remain frontend-only and intentionally omit control `name` attributes. No request delivery, account, storage, purchase, or success simulation was added.

### Accessibility and focus

- **39 axe-core page/component-state scans reported zero violations** for WCAG 2 A/AA and WCAG 2.1 A/AA tags. This covers each page at 320/768/1366px, an open offcanvas, both populated forms including the open modal, and expanded FAQ states.
- Keyboard checks verified visible skip-link focus and movement into main on all eleven pages, offcanvas focus return, modal focus boundaries/return, FAQ operation, and table scrolling.
- Axe's manual-review items were investigated. The hero gradient endpoints give at least **4.67:1** for teal text, **5.19:1** for secondary text, and **11.86:1** for navy text. Decorative arrows/checkmarks are hidden from assistive technology and accompanied by meaningful text.
- Offcanvas wrappers use named semantic sections so their label remains meaningful in desktop navigation; Bootstrap assigns dialog semantics when open. FAQ answer panels use named regions. These changes address generic-container ARIA review items while preserving the original components.
- Automated scans and selected keyboard/visual checks are not a full accessibility audit. No screen-reader, physical-device, Firefox, or Safari testing was performed.

### Console and assets

Final console/asset checks across all eleven pages reported **zero console errors, uncaught page errors, failed requests, HTTP errors, or missing paths**. A browser-generated favicon 404 found during the earlier run was fixed with the local branded SVG favicon. Its follow-up response was HTTP 200 with `image/svg+xml`; all pages reference it.

Static setup checks confirmed matching official 5.3.8 CSS/bundle URLs and SRI/crossorigin attributes on all eleven pages, custom CSS afterward, exactly one Bootstrap script per page, identical footers, unique titles, and no inline source styles. No custom application JS, Tailwind, package setup, or JavaScript training module was introduced.

### Screenshots and delivery

Five actual full-page browser captures were saved and visually reviewed:

- [Home mobile, 390px](screenshots/final-mobile.png)
- [Home tablet, 768px](screenshots/final-tablet.png)
- [Home desktop, 1366px](screenshots/final-desktop.png)
- [Services desktop, 1366px](screenshots/final-services-desktop.png)
- [Contact mobile, 390px](screenshots/final-contact-mobile.png)

The finalized [README](README.md) includes setup, page map, components, responsive behavior, form limitations, and screenshots. [DAY8-DELIVERY.md](DAY8-DELIVERY.md) includes the rubric map, five-minute presentation script, blank peer checklist, and suggested commits.

Real peer review and live presentation remain pending human work; neither is claimed complete. Course-required meaningful commits remain the author's responsibility because this task explicitly prohibited committing/pushing.

All changes are inside `day-06-bootstrap/` on `day-08-bootstrap-final`. `day-01-html` is unchanged. No commit, push, dependency installation in the repository, or deployment occurred. Temporary test browsers and preview servers were closed; test scripts/results/dependencies remain outside the repository. No known unresolved implementation issue remains in the requested Day 8 scope.
