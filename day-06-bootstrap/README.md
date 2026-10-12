# Bootstrap Day 6 Project

## Objective

Demonstrate Bootstrap 5.3.8 Grid and utilities from Day 6, extended with components, forms, and interaction in Day 7. This is separate from the completed CSS-only `day-01-html` project. TechNova and its product data are fictional examples.

## Pages

- [Home / Grid Demo](index.html): responsive hero and a three-card feature grid.
- [Pricing / B01](pricing.html): three tiers with a recommended Professional plan.
- [Dashboard / B03](dashboard.html): sidebar, topbar, four KPI cards, and a responsive table.
- [FAQ / Day 7](faq.html): five questions in a branded Bootstrap accordion.

## Concepts Practiced

- Official Bootstrap CDN setup, integrity hash, and custom CSS loaded afterward.
- Containers, rows, columns, gutters, and mobile-first responsive breakpoints.
- Spacing, display, flex, typography, sizing, and visual utilities.
- Cards, a responsive table, and narrow custom styling for brand identity.

The feature grid uses `col-12 col-md-6 col-lg-4` (1 / 2 / 3 columns). Pricing uses `col-12 col-lg-4` (stacked until 992px). Dashboard KPIs use `col-12 col-md-6 col-xl-3` (1 / 2 / 4 columns). Its sidebar stacks above the content until `lg`.

Bootstrap handles layout; `assets/css/custom.css` supplies colors, component variables, hero treatment, progress styling, and focus indicators. Day 7 adds only the official Bootstrap JS bundle; there is no custom application JavaScript.

## How to Run

Open `index.html` in a browser, or use VS Code Live Server from this folder. Internet access is needed for Bootstrap CSS and JS from jsDelivr. All four pages link to one another; pricing CTAs link to plan details and dashboard links target visible sections.

## Bootstrap Setup

Matching CSS and JS URLs and integrity hashes copied from the [official Bootstrap 5.3 Quick Start](https://getbootstrap.com/docs/5.3/getting-started/introduction/). Bootstrap CSS loads before the custom stylesheet on every page. Each page includes exactly one Bootstrap 5.3.8 bundle near the end of body, with integrity and crossorigin attributes. No Bootstrap source files are copied into the project.

## Day 7 Features

- Responsive Bootstrap navbar: horizontal from `lg` (992px); offcanvas below that breakpoint, with a title, close button, Escape, and backdrop dismissal.
- Home consultation CTA opens a centered, scrollable Bootstrap modal with labeled form fields and a static demo alert.
- Native validation uses `required`, `type="email"`, and useful minimum/maximum lengths. Company is optional; the demo consent checkbox is required.
- This is a frontend practice form, with no backend or success claim. A valid submission returns to Home. Controls intentionally omit `name` attributes so entered values are not serialized into the URL or sent to a server.
- FAQ uses Bootstrap's accordion data attributes, one open answer at a time, and unique targets/ARIA relationships.
- Teal/navy component colors and visible focus styling extend the Day 6 brand.
- Keyboard/focus, console, interaction, and responsive QA use the existing external browser test tools; no npm commands or installations are needed for this project.

Bootstrap's bundle supplies all interaction. There are no custom JS files, Tailwind, Vite, APIs, or Day 8 pages.

## Verification

See [QA.md](QA.md) for the actual responsive checks and accessibility review.

## Author

Omar Farran
