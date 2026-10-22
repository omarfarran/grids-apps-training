# Day 11 — Delivery Preparation

**Project:** Forma · Grids Apps Foundation Track · Omar Farran  
**Prepared:** October 22, 2026  
**Final screen count:** 9  
**Status:** Implementation and local technical QA complete; human demonstration and review pending.

This document prepares a demo. It does not record an actual live demo or trainer/peer review.

## Before the Demo

From `day-09-tailwind/`:

```sh
npm install
npm run build
npm run preview
```

Open the printed Local URL. On this machine, use `npm.cmd` in PowerShell if `npm.ps1` is blocked. Keep the terminal visible to show the build result, and use a browser responsive viewport for the breakpoint demonstration.

## Demo Script — Approximately 6–8 Minutes

1. **Explain the Tailwind/Vite setup.** Open `vite.config.js`: show the official Tailwind Vite plugin and all nine HTML inputs. Show `src/style.css` starting with `@import "tailwindcss";` and explain that `src/main.js` only imports CSS. Point out the vanilla multi-page structure and shared focus baseline.
2. **Introduce the landing page.** Start at `index.html`: explain the Forma workspace concept and show the preserved split hero, local workspace illustration, and CTA group. Scroll through features, product modules, workflow, pricing, illustrative testimonials, FAQ, and final CTA. Clarify that the brand, testimonials, and data are fictional samples.
3. **Demonstrate responsive variants.** At 390px, show the stacked hero and product cards. At 768px, show the two-column product grid; at 1024px, show three columns and the split hero. Inspect `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, responsive padding, and heading-size utilities. Mention that 320px and 1366px were also checked.
4. **Show dashboard navigation.** Follow “Workspace” into Overview. Visit Customers, Products, Analytics, Reports, Settings, and Profile; explain their distinct purposes. Resize to show compact navigation and the persistent desktop sidebar. Point out the active-page marker.
5. **Show KPI and data surfaces.** Read the Overview KPIs and chart caption. On Customers, scroll the table sideways at 390px to show that essential columns remain available. On Analytics, explain the labeled native conversion meters and channel totals. On Reports, open a summary and download a static sample text report.
6. **Demonstrate focus and form states.** Reload and press Tab to reveal the skip link; press Enter to focus main content. Tab through navigation, table regions, and inputs. Use ArrowRight in a narrow table region. In Settings, change a sample preference and use Reset to restore it; explain why Save is disabled. On Auth, show labels, focus, disabled submit states, and the explicitly labeled error-ready example.
7. **Explain the utility-first approach.** Use one card, navigation link, and form field to explain spacing, type, color, border, and hover/focus utilities. Point out the common green/lime/stone palette and standard utility scales. Explain that no component library, custom drawer script, or arbitrary utility values were needed.
8. **Close with build and QA evidence.** Show the successful `npm run build` output and the nine generated HTML files in `dist/`. Mention that the same nine pages were checked through production preview at the five requested widths. Open `QA.md`, the machine-readable reports, and representative screenshots. Invite human feedback without implying it has already happened.

## Useful Demo Route

`index.html` → `dashboard.html` → `customers.html` → `products.html` → `analytics.html` → `reports.html` → `settings.html` → `profile.html` → `auth.html`

The seven workspace views share navigation. The public navigation and workspace “Auth demo” link connect the remaining views.

## Evidence to Have Ready

- [README](README.md): installation, development, production build, preview, and page map.
- [QA report](QA.md): actual responsive/build/browser results and limitations.
- [Development browser measurements](qa/browser-results-day11.json).
- [Production browser measurements](qa/browser-results-day11-production.json).
- [Landing mobile](screenshots/day11-index-390.png) and [desktop](screenshots/day11-index-1366.png).
- [Dashboard mobile](screenshots/day11-dashboard-390.png) and [desktop](screenshots/day11-dashboard-1366.png).
- [Customer directory](screenshots/day11-customers-1366.png), [analytics](screenshots/day11-analytics-1366.png), [settings mobile](screenshots/day11-settings-390.png), and [profile](screenshots/day11-profile-1366.png).

## Trainer / Peer Review — Unfilled

Reviewer: ____________________  
Role (trainer/peer): ____________________  
Demo date: ____________________  
Review date: ____________________

- [ ] Student explained the current Tailwind/Vite setup.
- [ ] Reviewer saw all nine distinct views.
- [ ] Landing sections form a coherent SaaS presentation.
- [ ] Dashboard pages share a consistent visual system.
- [ ] Mobile/tablet/desktop behavior was demonstrated.
- [ ] Tables kept essential columns accessible.
- [ ] Keyboard focus and skip links were demonstrated.
- [ ] Settings/auth states and frontend limitations were explained.
- [ ] Reviewer saw a successful production build or its recorded output.
- [ ] README setup/build/preview instructions were reviewed.
- [ ] Feedback and follow-up actions were recorded below.

Feedback:

____________________________________________________________________

____________________________________________________________________

Follow-up actions:

____________________________________________________________________

____________________________________________________________________

Reviewer decision/sign-off: __________________________________________

## Remaining Human Work

Perform the live demonstration, obtain trainer/peer feedback, and complete the blank review fields. Screen-reader, other-browser, and physical-device checks may be added separately; they have not been claimed. Decide which suggested milestones to commit after review. No commits or pushes were made by the implementation session.
