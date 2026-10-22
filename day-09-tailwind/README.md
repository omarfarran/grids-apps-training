# Tailwind Days 9-10

## Objective

Practice the Grids Apps Foundation Track Days 9–10 requirements in a new, standalone vanilla Vite project. Forma is a fictional workspace SaaS used to connect the exercises with one consistent visual system: warm stone surfaces, forest green actions, lime accents, rounded cards, and a shared spacing rhythm.

This is a frontend learning project. All customer marks, metrics, prices, people, and orders are illustrative. Work is limited to Days 9–10; there is no Day 11 delivery, backend, or authentication implementation. The completed HTML and Bootstrap projects are unchanged.

## Tech

- Vite **8.3.5**, scaffolded with the official `npm create vite@latest` vanilla template (create-vite **9.3.1**).
- Tailwind CSS **4.3.3** and **@tailwindcss/vite 4.3.3**, using the current Vite integration.
- HTML5 and vanilla JavaScript; `src/main.js` only imports CSS.
- Verified with Node **24.21.0** and npm **11.19.0**.

The lockfile records the installed versions. Vite requires Node 20.19+ or 22.12+; use a supported modern Node release.

## Pages

| Page | Exercises | Content |
| --- | --- | --- |
| [Landing](index.html) | T01 + T03 + responsive drill | Split SaaS hero, CTA group, workspace preview, sample trust marks, three consistent product cards. |
| [Dashboard](dashboard.html) | T04 + T05 | Responsive navigation shell, four KPIs, revenue chart, activity, five-column orders table. |
| [Auth](auth.html) | Form states | Sign-in and registration cards, native reset controls, disabled submission, clearly labeled error-ready example. |

## Concepts Practiced

- Utility-first CSS for spacing, typography, color, sizing, layout, borders, and shadows.
- Mobile-first variants: the product grid uses `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- Responsive grid/flex: hero splits at `lg`; form cards split at `md`; dashboard KPIs use one, two, then four columns.
- Meaningful responsive padding, heading sizes, and alignment.
- `hover:`, `focus:`, `focus-visible:`, `focus-within:`, and `disabled:` states.
- Accessible forms with labels, autocomplete hints, descriptions, and an explicit error example.
- Semantic landmarks, heading hierarchy, skip links, and keyboard-accessible table scrolling.
- Design consistency without arbitrary Tailwind values or custom media queries.

## Run

From this directory:

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite, then navigate between the three pages. Files must be served through Vite; opening the source HTML directly does not compile Tailwind.

```sh
npm run build
npm run preview
```

`dist/` contains all three production pages. The explicit multi-page inputs in `vite.config.js` ensure the dashboard and auth page are included, and `base: "./"` makes generated asset URLs relative.

On this Windows machine, PowerShell's policy blocks `npm.ps1`. Use `npm.cmd install`, `npm.cmd run dev`, and `npm.cmd run build`, or run the ordinary npm commands from Command Prompt. No execution-policy change is required.

## Vite and Tailwind Setup

The project was created with:

```sh
npm create vite@latest day-09-tailwind -- --template vanilla --no-interactive
cd day-09-tailwind
npm install
npm install tailwindcss @tailwindcss/vite
```

`vite.config.js` registers `tailwindcss()` in `plugins`. Every page loads `src/main.js`, which imports `src/style.css`. That stylesheet begins with `@import "tailwindcss";` and adds only a shared keyboard-focus baseline in `@layer base`; component styling stays in utility classes.

No Tailwind v3 directives, Tailwind config file, PostCSS config, React, remote asset dependency, or application JavaScript feature is used. See the official [Vite guide](https://vite.dev/guide/) and [Tailwind Vite installation](https://tailwindcss.com/docs/installation/using-vite).

## Interaction and Accessibility

- All navigation and CTA links have local destinations; product CTAs open the registration demonstration.
- On small screens the dashboard navigation wraps above the content. At 1024px it becomes a persistent sidebar. It does not require a drawer or menu script.
- The orders table preserves every column. Its labeled, focusable scroll region supports horizontal scrolling on small screens; focus it with Tab and use the arrow keys.
- Keyboard focus uses a three-pixel outline with an offset. Inputs also change border and ring on focus; cards highlight when a contained link has focus.
- The sign-in and registration submit buttons are intentionally disabled and explained beside each form. Fields have no submission names. There is no credential processing or storage.
- Reset buttons use native HTML behavior. The remember-me checkbox is UI only. Password matching is explicitly not implemented.
- The separate error-ready input uses `aria-invalid="true"`, `aria-describedby`, a rose border, and explanatory text. It is not an actual sign-in failure.
- Inline decorative SVGs and product illustrations are hidden from assistive technology; meaningful status symbols are named. The chart has a text caption containing all values.

## Verification

Actual results, viewport measurements, limitations, and screenshots are in [QA.md](QA.md). Browser checks cover all three pages at 320, 390, 768, 1024, and 1366 pixels.

The optional [browser QA script](qa/browser-check.cjs) is development tooling only and is not loaded by the application. It expects an existing Playwright installation and installed Chrome. Set `PLAYWRIGHT_MODULE` to that module's location if it is outside the project, start Vite, and run:

```sh
node qa/browser-check.cjs
```

It records [browser measurements](qa/browser-results.json) and six screenshots. `QA_BASE_URL` can target a different local server; `QA_REPORT_NAME` selects the result filename inside `qa/`.

## Structure

```text
day-09-tailwind/
  index.html
  dashboard.html
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
  qa/
    browser-check.cjs
    browser-results.json
    browser-results-production.json
  screenshots/
    index-390.png
    index-1366.png
    dashboard-390.png
    dashboard-1366.png
    auth-390.png
    auth-1366.png
  README.md
  QA.md
```

`node_modules/` and `dist/` are ignored by the project-local `.gitignore`. No commits or pushes were made.
