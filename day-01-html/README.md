# TechNova - Responsive Corporate Technology Website

A thirteen-page HTML/CSS training website by Omar Farran for the Grids Apps Full Stack Foundation Track.
It combines software-company content, learning-project showcases, and demo forms with the design and responsive layouts built during Days 1-4.

## Features

- Semantic HTML landmarks, sections, articles, headings, and a meaningful profile image.
- Thirteen connected production pages with consistent primary and footer navigation.
- Contact and registration forms using native browser validation and associated labels.
- Thirty-eight CSS design tokens for color, spacing, typography, sizing, and reusable components.
- Mobile-first responsive layout, fluid typography, and flexible images.
- Flexbox navigation and registration action buttons.
- CSS Grid card collections that adapt to available width.
- Visible keyboard focus, skip-to-content links, and accurate current-page markers.
- Separate specificity and responsive-repair exercises retained for explanation and practice.

## Pages

Exercise pages are excluded from the production-page count. All eleven workbook page types are present, plus Profile and Registration.

| Production page | Purpose |
|---|---|
| [Home](index.html) | Company overview, hero, services, and project contact CTA. |
| [About](about.html) | Company mission, values, and background. |
| [Services](services.html) | Responsive software service cards. |
| [Service Detail](service-detail.html) | Web development overview, features, workflow, capabilities, and contact CTA. |
| [Products / Portfolio](portfolio.html) | Learning projects and clearly labeled product concepts. |
| [Blog](blog.html) | Article cards with authors, dates, and working detail links. |
| [Blog Detail](blog-details.html) | Three full article sections and Back to Blog links. |
| [Gallery / Case Studies](gallery.html) | Text-based case studies describing challenges, approaches, and value. |
| [Contact](contact.html) | Nine labeled controls with native validation. |
| [Privacy Policy](privacy.html) | Educational notice explaining forms, intended use, handling, and external links. |
| [Terms & Conditions](terms.html) | Demo-site use, content, acceptable use, limitations, and contact. |
| [Profile](profile.html) | Omar Farran profile, education, skills, projects, and local profile image. |
| [Registration](registration.html) | Twenty-five controls, six fieldsets, native validation, and CV selection. |

The six primary links are Home, About, Services, Portfolio, Blog, and Contact.
The footer exposes service details, case studies, article details, registration, profile, privacy, and terms.
Blog and portfolio cards also link directly to the relevant article or case-study anchors.

## Technologies

HTML5 and CSS3, including CSS custom properties, Flexbox, CSS Grid, and media queries.
No JavaScript, Bootstrap, Tailwind, CSS framework, package manager, or build step is required.
Shared production styles live in [assets/css/style.css](assets/css/style.css).

## Project Structure

```text
day-01-html/
|-- index.html
|-- about.html
|-- services.html
|-- service-detail.html
|-- portfolio.html
|-- blog.html
|-- blog-details.html
|-- gallery.html
|-- contact.html
|-- privacy.html
|-- terms.html
|-- profile.html
|-- registration.html
|-- css-specificity-exercise.html       # Day 3 exercise, not a production page
|-- responsive-repair-exercise.html     # Day 4 exercise, not a production page
|-- assets/
|   |-- css/
|   |   |-- style.css
|   |   |-- specificity-exercise.css
|   |   `-- responsive-repair-exercise.css
|   `-- images/
|       `-- profile.jpg
|-- screenshots/
|   |-- day4-mobile.png
|   |-- day4-tablet.png
|   |-- day4-desktop.png
|   |-- final-mobile.png
|   |-- final-tablet.png
|   `-- final-desktop.png
|-- README.md
|-- DAY5-QA.md
`-- TRAINER-REVIEW.md
```

Case studies use text cards because the local photo is a personal profile image, not a project screenshot. No remote placeholder images are used.

## How to Run

Open [index.html](index.html) directly in a browser, or open this folder in VS Code and use Live Server.
There is no Node/npm setup.

If Python is already installed, an optional local server can be started from `day-01-html/`:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000/index.html` in a browser. Stop the server with Ctrl+C.

### Demo form behavior

Forms validate in the browser and retain `action="#"` because no processing backend exists.
A valid submit can attempt a request to the current page; a static server may respond with an unsupported-method message.
The form does not create an account, save a CV, or deliver an application. Use sample values and files during practice.
The file input accepts `.pdf`, `.doc`, and `.docx`; its form uses `multipart/form-data`. The `accept` attribute is a file-picker hint, not a security check.
The [privacy notice](privacy.html) and [terms](terms.html) are educational samples, not professional legal advice.

## Responsive Design

Base rules support narrow screens. Wrapping Flexbox navigation keeps all links available; Grid uses
`repeat(auto-fit, minmax(min(100%, var(--card-min-width)), 1fr))` to adapt card columns.
A single `min-width: 40rem` media query increases spacing. Fluid gutters and heading sizes reduce abrupt layout changes.
Images preserve aspect ratio, and controls/fieldsets fit their containers. No horizontal overflow is hidden with CSS.

All thirteen production pages were checked at 320, 390, 768, and 1366 pixels, with extra checks at 480 and 1024 pixels.
At the four required widths, the home card grid has one, one, two, and three columns respectively.

## Screenshots

These are real full-page browser captures of the final home page, including its updated navigation and footer.

| View | Viewport width | Screenshot |
|---|---:|---|
| Mobile | 390px | [Final mobile](screenshots/final-mobile.png) |
| Tablet | 768px | [Final tablet](screenshots/final-tablet.png) |
| Desktop | 1366px | [Final desktop](screenshots/final-desktop.png) |

Historical Day 4 screenshots are preserved: [mobile](screenshots/day4-mobile.png), [tablet](screenshots/day4-tablet.png), and [desktop](screenshots/day4-desktop.png).
Use the final screenshots for delivery because navigation and the footer have changed.

## Delivery Review

- [Day 5 technical self-QA](DAY5-QA.md): verification evidence, Git history, pending peer review, and exit-ticket drafts.
- [Trainer review preparation](TRAINER-REVIEW.md): artifact checklist, live explanation notes, and blank trainer fields.
- [Specificity exercise](css-specificity-exercise.html): type/class/ID priority, source order, and inheritance.
- [Responsive repair exercise](responsive-repair-exercise.html): an isolated oversized card and its flexible repair.

## Author

Omar Farran

## Repository

[grids-apps-training on GitHub](https://github.com/omarfarran/grids-apps-training)
