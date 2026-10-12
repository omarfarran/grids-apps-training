# Day 6 Quality Review

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
