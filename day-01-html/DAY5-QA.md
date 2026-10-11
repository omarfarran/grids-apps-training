# Day 5 Technical Self-QA

Review date: October 11, 2026 (Asia/Hebron).
Scope: thirteen production pages; two educational exercises are retained but excluded from the production count.
This is technical self-QA, not a peer review, trainer score, or complete assistive-technology audit.

## HTML

- [x] PASS - 10+ final pages: 13 production pages cover all 11 required workbook page types.
- [x] PASS - Semantic structure: source inspection, tag-stack/content-model checks, and browser rendering preserve landmarks, sections, articles, lists, and forms.
- [x] PASS - Unique titles: all 13 production titles are distinct.
- [x] PASS - Meta descriptions: all 13 are present, meaningful, and distinct; language, charset, viewport, and doctype are present.
- [x] PASS - Working links: 232 local HTML references resolve; fragment targets exist. All production pages are reachable from Home.
- [x] PASS - No duplicate IDs within any page.
- [x] PASS - Logical heading hierarchy: one h1 per production page, with no skipped heading levels.

## Accessibility

- [x] PASS - Image alt text: the local profile photo has meaningful alt text and retains its aspect ratio. Case studies use text cards.
- [x] PASS - Form labels: every control has a matching label/ID and a name; original form-control and validation attributes are preserved.
- [x] PASS - Keyboard focus: 52 skip-link checks passed; Enter focuses main. Form controls, CV selection, actions, and footer links retain visible focus.
- [x] PASS - Readable navigation: primary and footer menus are named, wrap in source order, and retain targets at least 44px high and wide.
- [x] PASS - Current-page markers: exactly one production link points to the current document and uses aria-current="page".
- [x] PASS - Contrast checks: minimum measured text contrast was 5.62:1 across inspected text states; form-control boundary contrast was 6.09:1 against its background.

## CSS

- [x] PASS - Design tokens: all 38 Day 3/4 custom properties remain unchanged and are reused.
- [x] PASS - No inline styles or internal style blocks.
- [x] PASS - No !important declarations.
- [x] PASS - Flexbox used intentionally for one-dimensional navigation and registration actions.
- [x] PASS - Grid used intentionally for responsive rows and columns of cards.
- [x] PASS - Shared CSS retains border-box sizing, focus states, fluid typography, image limits, and one mobile-first media query.
- [x] PASS - No JavaScript or framework introduced. Exercise-only conflicts and the deliberate repair bug remain isolated.

## Responsive

- [x] PASS - 320px.
- [x] PASS - 390px.
- [x] PASS - 768px.
- [x] PASS - 1366px.
- [x] PASS - No horizontal page overflow; no overflow-x:hidden masking.

| Viewport | Production pages checked | Home card columns | Overflow result |
|---|---:|---:|---|
| 320px | 13/13 | 1 | PASS: scrollWidth equals clientWidth |
| 390px | 13/13 | 1 | PASS: scrollWidth equals clientWidth |
| 768px | 13/13 | 2 | PASS: scrollWidth equals clientWidth |
| 1366px | 13/13 | 3 | PASS: scrollWidth equals clientWidth |

Additional checks at 480px and 1024px also passed. Including both exercise pages, 90 page-width checks passed.
Navigation, typography, images, grids, forms, and footer bounds were inspected. Real final screenshots and additional new-page/form captures were visually reviewed.

## Forms and Navigation Evidence

- Contact: 9 controls, 8 required; registration: 25 controls, 16 individually marked required, with radio-group validation and six fieldsets.
- 8 form checks across the four required widths rejected blank required values and accepted valid sample data.
- Actual typed inputs below minimum length were rejected. Malformed email/URL values and experience above the maximum were rejected.
- Checkbox labels toggle their controls; CV selection remains configured for PDF/Word files with multipart/form-data.
- All 78 primary-menu links across the 13 production pages were activated successfully in the browser.
- All three blog detail links reached their matching article IDs, and each Back to Blog link returned to the listing.
- Footer navigation was checked on every production page; keyboard traversal covered the narrow-screen footer and its links.
- Final documentation audit: all 39 local Markdown references resolve, including screenshots and the review documents.
- Forms retain action="#" with no invented backend. A valid submission is not a completed business operation and may be unsupported by a static server.

## Project

- [x] PASS - [README](README.md) covers features, pages, technologies, structure, local running, responsive design, screenshots, author, and repository.
- [x] PASS - [Final mobile](screenshots/final-mobile.png), [tablet](screenshots/final-tablet.png), and [desktop](screenshots/final-desktop.png) screenshots are authentic browser captures.
- [x] PASS - Clean folder structure: production pages remain at the root; styles, image, screenshots, and named exercise files are understandable. Debug scripts and browser reports are outside the project.
- [x] PASS - Git history reviewed; no commits, pushes, or history rewrites performed.

## Git History

Reviewed current branch through commit `43163ed`.

- Total commits: **20**.
- Meaningful commits by review: **19** (setup, substantive implementation, corrections, CSS exercises, responsive work, and screenshots).
- Excluded `552adad`: it only added an empty registration.html placeholder (0-byte blob) despite its completion message.
- The workbook minimum of 8 meaningful commits is **PASS**.
- No artificial commits were created to reach the requirement.

## Findings and Repairs

- No broken local paths were found in the initial or final HTML-reference audit.
- Five missing workbook pages were created and integrated into primary/footer navigation.
- Corrected the Blog link's inaccurate current-page marker on blog-details.html; the marker now identifies the actual detail page in the footer.
- Added skip-to-main links, distinguished the two navigation regions, and linked the demo policies near both forms.
- Strengthened form-control borders using the existing muted-color token; measured boundary contrast is 6.09:1.
- No production overflow was found. The retained Day 4 repair lab still shows a fixed-width content-box card overflowing its local region and a 100%-width border-box repair that fits.
- Preserved the Day 3/4 exercise files, profile image, historical screenshots, and native validation attributes.
- Updated delivery screenshots because final navigation and footer differ from Day 4.

## Verification Scope

Checks used source inspection and an isolated Chromium browser with a local static server.
External URL availability, real form delivery, screen-reader behavior, and trainer judgment were not claimed as verified.
The form backend is intentionally absent from this frontend-only project. Privacy and terms pages are educational samples.

## Peer Review

Status: PENDING HUMAN REVIEW

A peer should test these five items manually:

1. Navigation: visit each primary/footer page; follow blog and portfolio detail links and return links.
2. Responsive behavior: resize through 320, 390, 768, and 1366 pixels; check wrapping and sideways scrolling.
3. Forms: use sample data to test required fields, formats, radio choices, labels, CV selection, and Reset.
4. Visual consistency: compare headings, cards, spacing, form controls, and footer across pages.
5. Keyboard/accessibility: use Tab, Shift+Tab, and Enter; test skip links, focus visibility, and logical source order.

## Day 5 Exit Ticket

Draft answers for the student to review and personalize:

**What did I build today?**
I completed five missing corporate pages, integrated thirteen production pages, and prepared documentation and final screenshots.

**What bug/difficulty did I solve?**
I corrected an inaccurate current-page marker on blog details and kept a larger page set discoverable through compact primary navigation and footer links.

**What concept can I explain clearly?**
I can explain why Flexbox fits a wrapping navigation row, why Grid fits card collections, and how border-box prevents padding from expanding a declared width.

**What remains incomplete?**
Human peer QA and the live presentation/trainer review are pending. The site deliberately has no backend submission service.
