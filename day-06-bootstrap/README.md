# Bootstrap Day 6 Project

## Objective

Demonstrate Bootstrap 5.3.8 Grid and utilities in a focused, mobile-first project. This is separate from the completed CSS-only `day-01-html` project. TechNova and its product data are fictional examples.

## Pages

- [Home / Grid Demo](index.html): responsive hero and a three-card feature grid.
- [Pricing / B01](pricing.html): three tiers with a recommended Professional plan.
- [Dashboard / B03](dashboard.html): sidebar, topbar, four KPI cards, and a responsive table.

## Concepts Practiced

- Official Bootstrap CDN setup, integrity hash, and custom CSS loaded afterward.
- Containers, rows, columns, gutters, and mobile-first responsive breakpoints.
- Spacing, display, flex, typography, sizing, and visual utilities.
- Cards, a responsive table, and narrow custom styling for brand identity.

The feature grid uses `col-12 col-md-6 col-lg-4` (1 / 2 / 3 columns). Pricing uses `col-12 col-lg-4` (stacked until 992px). Dashboard KPIs use `col-12 col-md-6 col-xl-3` (1 / 2 / 4 columns). Its sidebar stacks above the content until `lg`.

Bootstrap handles layout; `assets/css/custom.css` supplies colors, component variables, hero treatment, progress styling, and focus indicators. There is no JavaScript and no Day 7 interaction component.

## How to Run

Open `index.html` in a browser, or use VS Code Live Server from this folder. Internet access is needed for Bootstrap CSS from jsDelivr. All three pages link to one another; pricing CTAs link to plan details and dashboard links target visible sections.

## Bootstrap Setup

CSS URL and integrity hash copied from the [official Bootstrap 5.3 Quick Start](https://getbootstrap.com/docs/5.3/getting-started/introduction/). Bootstrap CSS loads before the custom stylesheet on every page. No Bootstrap source files or JS bundles are copied into the project.

## Verification

See [QA.md](QA.md) for the actual responsive checks and accessibility review.

## Author

Omar Farran
