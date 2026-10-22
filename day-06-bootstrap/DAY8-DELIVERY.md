# Day 8 — Delivery and demo preparation

## Rubric map

| Requirement | Implementation |
| --- | --- |
| Ten required pages | Home, About, Services, Service Detail, Products, Pricing, Blog, Blog Detail, FAQ, Contact |
| Navbar and footer | Shared responsive navbar/offcanvas; footer links to all eleven pages |
| Hero and cards | Home hero/features; Services and Products cards |
| Pricing and testimonials | Three sample tiers; two explicitly fictional Home testimonials |
| Contact/application form | Contact brief plus retained Home consultation modal |
| Two or more JS components | Offcanvas, modal, and accordion: three retained components |
| Custom branding | Teal/navy/mint colors and focus styles |
| Responsive/accessibility checks | Actual evidence and limitations in QA.md |
| README | Final page map, setup, components, behavior, screenshots, limitations |
| Peer review | Checklist prepared; real review pending |
| Presentation | Script prepared; live delivery pending |
| Meaningful commits | Suggestions provided; author action pending; no commits or push |

## Five-minute presentation

1. **0:00–0:40 — Purpose and Home.** Explain the fictional workspace concept. Show the hero, feature cards, and labeled sample testimonials.
2. **0:40–1:30 — Company journey.** Follow About → Services → Service Detail → Contact. Explain the responsive cards and shared visual design.
3. **1:30–2:10 — Products and plans.** Show Products, Pricing, and the extra Dashboard. Explain KPI breakpoints and the mobile table. Prices/data are fictional.
4. **2:10–2:40 — Content.** Follow Blog → Blog Detail → related guide → Back to Blog. Point out breadcrumbs and real section destinations.
5. **2:40–3:30 — Bootstrap interaction.** Narrow the viewport; operate offcanvas with keyboard/Escape. Open the Home modal, demonstrate invalid submission and focus return. Toggle two FAQ answers to show one-open behavior.
6. **3:30–4:15 — Contact and accessibility.** Show labels, required fields, email validation, message help, and consent. Explain why demo values are not sent. Demonstrate Tab focus and skip link.
7. **4:15–5:00 — Evidence.** Show screenshots and Day 8 QA. Explain that Bootstrap owns layout/interaction; custom CSS supplies branding. Mention pending peer review, live presentation, and author-controlled commits.

## Peer review — NOT YET PERFORMED

Reviewer: ____________________  Date: ____________________

- [ ] Visit ten required pages and optional dashboard.
- [ ] Confirm consistent header/footer and clear current section.
- [ ] Follow Services → Service Detail → Contact; Products → Pricing; Blog → Blog Detail → Blog.
- [ ] Check mobile, tablet, and desktop readability and overflow.
- [ ] Operate offcanvas with keyboard, close button, backdrop, and Escape.
- [ ] Open/close modal and confirm focus returns to trigger.
- [ ] Operate FAQ by keyboard and check previous answers close.
- [ ] Test both forms: blank, malformed email, short text, missing consent, valid sample input.
- [ ] Check visible focus, skip links, labels, contrast, and keyboard table scrolling.
- [ ] Confirm fictional content and frontend-only notices are clear.
- [ ] Check console and broken navigation/assets.
- [ ] Record feedback and recheck fixes with the author.

Feedback: ___________________________________________________________

Author response / retest: ____________________________________________

Reviewer decision: ____________________

## Remaining author actions

Obtain real classmate/trainer feedback, deliver the live presentation, review the diff, and create meaningful commits when ready. Commit and push were explicitly excluded from this task.

## Suggested commits — not executed

- `add Bootstrap company and service pages`
- `add product blog and contact pages`
- `integrate final navbar footer and customer journeys`
- `document Day 8 responsive QA and delivery preparation`

Review and stage intended files only. Keep `day-01-html` out of Day 8 changes.
