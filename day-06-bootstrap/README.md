# TechNova — Bootstrap Final Website

Day 8 of the Grids Apps training track, by Omar Farran. This continues the Day 6–7 project in the same folder. TechNova is fictional; products, prices, metrics, customers, and testimonials are illustrative.

## Final pages

The ten required pages are complete. Dashboard remains an eleventh, additional page.

| Page | Content and journey |
| --- | --- |
| [Home](index.html) | Hero, feature cards, fictional testimonials, and consultation modal. |
| [About](about.html) | Mission, approach, and values; leads to Services. |
| [Services](services.html) | Three services and delivery process; leads to Service Detail and Contact. |
| [Service Detail](service-detail.html) | Planning scope, deliverables, collaboration, reporting, and project brief CTA. |
| [Products](products.html) | Three concepts linking to the dashboard, workflow, and plans. |
| [Pricing](pricing.html) | Starter, Professional, Business, plan details, and Contact CTA. |
| [Blog](blog.html) | Three cards with working article/section links. |
| [Blog Detail](blog-detail.html) | Project brief article, two related guides, and Back to Blog. |
| [FAQ](faq.html) | Five accordion answers with relevant page links. |
| [Contact](contact.html) | Project brief form, preparation tips, and FAQ link. |
| [Demo Dashboard](dashboard.html) | Extra page: sidebar, KPIs, table, and report. |

## Run locally

Open `index.html` directly, or use VS Code Live Server from this folder. No build, installation, or npm commands are required. Internet access is required for Bootstrap CDN assets.

Start with Home, follow Services → Service Detail → Contact, then Products → Pricing → Dashboard. Blog → Blog Detail and FAQ complete the company journey.

## Bootstrap and branding

- Bootstrap **5.3.8**, pinned on all eleven pages with matching CSS/bundle integrity hashes and `crossorigin="anonymous"`, verified against the [official Quick Start](https://getbootstrap.com/docs/5.3/getting-started/introduction/).
- Exactly one official JS bundle per page. No custom application JavaScript, Tailwind, build framework, or API integration.
- Three reused JS-powered components: responsive **offcanvas navigation**, Home **consultation modal**, and FAQ **accordion**.
- Bootstrap grid, cards, breadcrumbs, buttons, alerts, forms, badges, and responsive table.
- `assets/css/custom.css` extends the original teal/navy/mint identity and visible focus styles. Bootstrap owns layout and component behavior.
- Shared eight-link navbar; detail pages highlight their parent section. The shared footer exposes all eleven pages.

## Responsive behavior

The navbar becomes offcanvas below `lg` (992px). Home, Services, Products, and Blog cards use 1 / 2 / 3 columns at base / `md` / `lg`. Pricing stacks until `lg`. Dashboard KPIs use 1 / 2 / 4 columns at base / `md` / `xl`; its sidebar stacks below `lg`. The project table scrolls within a labeled, keyboard-focusable region.

## Demo form behavior

Contact and the Home modal use native validation: required name, email, service, message (20–2,000 characters), and demo consent; Company is optional. Labels, autocomplete hints, and help text are associated with controls.

Both forms omit control `name` attributes. A valid submission reloads the static page at its form section without serializing values. There is no backend, storage, delivered request, account creation, purchase, or simulated success claim. Use sample information.

## Project files

Eleven HTML pages, `assets/css/custom.css`, the local `assets/images/favicon.svg`, `screenshots/`, this README, [QA.md](QA.md), and [DAY8-DELIVERY.md](DAY8-DELIVERY.md). QA preserves Day 6/7 history and adds final Day 8 evidence. Delivery notes map the rubric, prepare the demo, and provide an unfilled peer checklist and suggested commits.

Final browser captures: [mobile Home](screenshots/final-mobile.png), [tablet Home](screenshots/final-tablet.png), [desktop Home](screenshots/final-desktop.png), [desktop Services](screenshots/final-services-desktop.png), and [mobile Contact](screenshots/final-contact-mobile.png).

## Delivery status

Implementation and self-QA do not count as peer review. A classmate/trainer must still perform the review and the author must present the site. Meaningful commits are required by the course; no commit or push was performed, as requested. Suggested messages are in the delivery notes.

All Day 8 changes are inside `day-06-bootstrap/` on `day-08-bootstrap-final`. `day-01-html` is unchanged.
