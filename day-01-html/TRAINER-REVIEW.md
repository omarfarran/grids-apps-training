# Trainer Review Preparation

This document prepares the student for a live review. It does not record a trainer's judgment.
Technical self-QA is recorded separately in [DAY5-QA.md](DAY5-QA.md).

## Preparation Checklist

Checked items mean that an artifact or explanation is ready, not that a trainer has awarded a score.

- [x] Semantic HTML: demonstrate header, navigation, main, sections, articles, lists, and forms.
- [x] Page completeness: show the 13 production pages listed in [README.md](README.md); exclude the two exercises from the count.
- [x] Navigation: show six primary links, the additional footer pages, article anchors, and case-study links.
- [x] Forms: demonstrate labels, required values, email/URL types, length/range limits, fieldsets, radio groups, and CV selection.
- [x] CSS architecture: locate the commented sections in [style.css](assets/css/style.css) and explain shared component rules.
- [x] Design tokens: explain color, spacing, radius, shadow, typography, and sizing variables.
- [x] Flexbox explanation: identify navigation and registration action rows.
- [x] Grid explanation: identify responsive card sections and the track-size expression.
- [x] Responsive behavior: demonstrate narrow layouts, fluid sizes, and the 40rem spacing enhancement.
- [x] Accessibility: demonstrate skip links, visible focus, named navigation regions, correct aria-current, labels, and profile alt text.
- [x] Debugging explanation: open the [specificity lab](css-specificity-exercise.html) and [responsive repair lab](responsive-repair-exercise.html).
- [x] Git history: explain the 20 total / 19 meaningful commits reviewed in the QA document.
- [x] README: show running instructions, page inventory, architecture, and project structure.
- [x] Screenshots: compare [mobile](screenshots/final-mobile.png), [tablet](screenshots/final-tablet.png), and [desktop](screenshots/final-desktop.png).

## Suggested Live Walkthrough

1. Open Home, resize the viewport, and explain the navigation and card layout.
2. Follow Web development details and show its overview, workflow, and Contact CTA.
3. Open Portfolio and follow a case-study anchor into the Gallery.
4. Open Blog, follow an article, and use Back to Blog.
5. Open Contact and Registration; demonstrate invalid sample values and describe the frontend-only submission limit.
6. Use the keyboard to demonstrate the skip link, input focus, and footer links.
7. Open style.css and the isolated exercises to explain cascade, box sizing, and overflow diagnosis.
8. Finish with the README, screenshots, Git history, and pending human review items.

## Live Explanation Notes

1. **Why semantic HTML was used.**
   Elements describe the purpose of content. Landmarks and headings make the page easier to navigate, understand, and maintain.

2. **Difference between section and article.**
   A section groups content around a topic, usually with a heading. An article is a self-contained item, such as a blog post or project card.

3. **How native form validation works.**
   The browser checks attributes such as required, type=email, minlength, and min/max before submission. A radio group shares a name; one required option makes a selection necessary. These checks do not create a backend.

4. **What CSS specificity means.**
   Among competing normal rules in the same origin and layer, a more specific selector wins. IDs outrank classes, which outrank types; equal specificity is resolved by source order. The exercise demonstrates this without !important.

5. **Why box-sizing: border-box is used.**
   Declared width includes padding and borders. A 100%-wide card or control therefore fits its parent instead of adding extra width outside it.

6. **Why CSS variables/design tokens are useful.**
   They give repeated design choices one name and one source. Changing a shared color or spacing token updates related components consistently.

7. **Why Flexbox was used for navigation.**
   Navigation is mainly a row of links. Flexbox aligns the links, gives them consistent gaps, and wraps them without hiding links or using a script.

8. **Why Grid was used for cards.**
   Card collections need rows and columns. Auto-fit and minmax adapt the number of tracks; min(100%, the preferred minimum) prevents a track from exceeding a narrow container.

9. **What mobile-first means.**
   Base CSS works on narrow screens. Flexible sizes handle most changes, and a min-width media query adds spacing when more room is available.

10. **How horizontal overflow was diagnosed and repaired.**
    Compare document scrollWidth with clientWidth and inspect the box causing the excess. Production pages fit; the isolated lab shows a fixed-width content-box card overflowing locally. A flexible width and border-box sizing repair the cause without hiding it.

## Trainer Review Fields

Leave these fields for the human trainer.

| Field | Trainer entry |
|---|---|
| Trainer name | |
| Review date | |
| Score / rubric result | |
| Strengths | |
| Improvements required | |
| Live explanation feedback | |
| Final decision | |

## Human Review Status

Peer QA: PENDING HUMAN REVIEW.
Live presentation and trainer review: PENDING HUMAN REVIEW.
