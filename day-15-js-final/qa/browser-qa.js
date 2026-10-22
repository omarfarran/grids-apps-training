// Run npm run build and npm run preview first. npm run dev is also smoke-tested.
// Defaults to installed Google Chrome; QA_BROWSER_PATH can select another Chromium.
import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "screenshots");
const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:4173/";
const devUrl = process.env.QA_DEV_URL || "http://127.0.0.1:5173/";
const KEY = "day15TaskManager";
const report = { runAt: new Date().toISOString(), timezone: "Asia/Hebron", results: [], consoleErrors: [], uncaught: [], failedRequests: [] };
let browser;
function pass(name, detail) { report.results.push({ name, status: "PASS", detail }); console.log("PASS " + name); }
async function context(options = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 1100 }, timezoneId: "Asia/Hebron", ...options });
  const page = await ctx.newPage();
  page.on("console", message => { if (message.type() === "error") report.consoleErrors.push(message.text()); });
  page.on("pageerror", error => report.uncaught.push(error.message));
  page.on("requestfailed", request => report.failedRequests.push(request.url() + ": " + request.failure().errorText));
  page.on("response", response => { if (response.status() >= 400) report.failedRequests.push("HTTP " + response.status() + " " + response.url()); });
  return { ctx, page };
}
async function ready(page) { await page.waitForFunction(() => !document.querySelector("#task-fields").disabled); }
const rows = page => page.locator("#task-list > li");
const row = (page, title) => rows(page).filter({ has: page.locator(".task-title", { hasText: title }) });
const readStorage = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), KEY);
async function fillForm(page, values) {
  await page.locator("#task-title").fill(values.title);
  await page.locator("#task-description").fill(values.description || "");
  await page.locator("#task-status").selectOption(values.status || "todo");
  await page.locator("#task-priority").selectOption(values.priority || "medium");
  await page.locator("#task-due-date").fill(values.dueDate || "");
}
async function add(page, values) { await fillForm(page, values); await page.locator("#submit-task").click(); }
async function resetView(page) { await page.locator("#reset-view").click(); }
async function count(page, expected) { assert.equal(await rows(page).count(), expected); }
async function screenshot(page, name, fullPage = true) { await page.screenshot({ path: path.join(output, name + ".png"), fullPage }); }
async function noOverflow(page) {
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, doc: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert.ok(dimensions.doc <= dimensions.viewport && dimensions.body <= dimensions.viewport, JSON.stringify(dimensions));
}
async function dates(page) {
  return page.evaluate(() => {
    const key = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const today = new Date();
    const past = new Date(today); past.setDate(today.getDate() - 1);
    const future = new Date(today); future.setDate(today.getDate() + 1);
    const later = new Date(today); later.setDate(today.getDate() + 2);
    return { today: key(today), past: key(past), future: key(future), later: key(later) };
  });
}

async function run() {
  browser = await chromium.launch({ headless: true, ...(process.env.QA_BROWSER_PATH ? { executablePath: process.env.QA_BROWSER_PATH } : { channel: "chrome" }) });
  report.browser = browser.version();
  report.baseUrl = baseUrl;
  if (process.env.QA_SKIP_DEV !== "1") {
    const { ctx, page } = await context();
    await page.goto(devUrl); await ready(page);
    await add(page, { title: "Development server smoke test" });
    await page.reload(); await ready(page); await count(page, 1);
    await row(page, "Development server smoke test").locator('[data-action="delete"]').click();
    await count(page, 0);
    await ctx.close();
    pass("Vite development server", "npm run dev serves the app; create/refresh/delete passed at localhost:5173.");
  }

  // Hold only the real application module, making truthful startup HTML observable.
  {
    const { ctx, page } = await context();
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await page.route("**/assets/*.js", async route => { await gate; await route.continue(); });
    await page.goto(baseUrl, { waitUntil: "commit" });
    await page.locator('[data-state="loading"]').waitFor();
    assert.equal(await page.locator("#task-fields").evaluate(element => element.disabled), true);
    assert.equal(await page.locator("#view-fields").evaluate(element => element.disabled), true);
    assert.equal(await page.locator("#task-title").isDisabled(), true);
    assert.equal(await page.locator("#task-search").isDisabled(), true);
    assert.equal(await page.locator("#task-workspace").getAttribute("aria-busy"), "true");
    await screenshot(page, "initialization");
    release(); await ready(page);
    assert.equal(await page.locator("#task-workspace").getAttribute("aria-busy"), "false");
    await ctx.close();
    pass("Truthful initialization", "Initial HTML has loading/busy and disabled fieldsets until the held JS module runs, loads and validates real storage; no application timer or fake request.");
  }

  const { ctx, page } = await context();
  await page.goto(baseUrl); await ready(page);
  let navigations = 0;
  page.on("framenavigated", frame => { if (frame === page.mainFrame()) navigations++; });
  await count(page, 0);
  assert.match(await page.locator("#empty-copy").textContent(), /No tasks yet/);
  assert.equal(await page.evaluate(key => localStorage.getItem(key), KEY), null);
  await screenshot(page, "empty-state");
  pass("Initial empty state", "Empty workspace, zero derived counts, and no automatic seed/storage write.");

  await add(page, { title: "   " }); await count(page, 0);
  assert.match(await page.locator("#title-error").textContent(), /Enter a task title/);
  assert.equal(await page.locator("#task-title").getAttribute("aria-invalid"), "true");
  assert.equal(await page.locator("#task-title").evaluate(element => element === document.activeElement), true);
  await screenshot(page, "validation-error");
  await fillForm(page, { title: "Title limit" });
  await page.locator("#task-title").evaluate(element => { element.value = "x".repeat(101); });
  await page.locator("#submit-task").click();
  assert.match(await page.locator("#title-error").textContent(), /100 characters/);
  await fillForm(page, { title: "Description limit" });
  await page.locator("#task-description").evaluate(element => { element.value = "x".repeat(1001); });
  await page.locator("#submit-task").click();
  assert.match(await page.locator("#description-error").textContent(), /1,000/);
  await fillForm(page, { title: "Invalid date", dueDate: "1899-12-31" });
  await page.locator("#submit-task").click();
  assert.match(await page.locator("#dueDate-error").textContent(), /real date/);
  pass("Form validation", "Whitespace title, programmatic overlength title/description, and out-of-range date rejected; inline associated errors and invalid/focus state verified.");

  const date = await dates(page);
  await add(page, { title: "  Plan the release  ", description: "  Review launch checklist  ", priority: "high", dueDate: date.past });
  await add(page, { title: "Design navigation", description: "Polish keyboard focus", status: "in-progress", priority: "medium", dueDate: date.future });
  await add(page, { title: "Write project notes", description: "Explain module boundaries", status: "completed", priority: "low" });
  await count(page, 3);
  assert.equal(navigations, 0);
  let saved = await readStorage(page);
  const original = saved.find(task => task.title === "Plan the release");
  assert.equal(original.description, "Review launch checklist");
  assert.equal(await page.locator("#task-title").inputValue(), "");
  assert.equal(await page.locator("#task-title").evaluate(element => element === document.activeElement), true);
  assert.equal(await page.locator("#summary-total").textContent(), "3");
  assert.equal(await page.locator("#summary-todo").textContent(), "1");
  assert.equal(await page.locator("#summary-progress").textContent(), "1");
  assert.equal(await page.locator("#summary-completed").textContent(), "1");
  assert.equal(await page.locator("#summary-overdue").textContent(), "1");
  await page.reload(); await ready(page); await count(page, 3);
  pass("Create/read and persistence", "Three trimmed tasks with distinct fields created without navigation; form reset/focus, summaries, JSON and refresh restoration verified.");

  await row(page, "Plan the release").locator('[data-action="edit"]').click();
  assert.equal(await page.locator("#task-title").evaluate(element => element === document.activeElement), true);
  await fillForm(page, { title: "  Prepare release  ", description: "Review final accessibility checklist", status: "in-progress", priority: "low", dueDate: date.later });
  await screenshot(page, "edit-state");
  await page.locator("#submit-task").click();
  saved = await readStorage(page);
  const edited = saved.find(task => task.id === original.id);
  assert.equal(edited.title, "Prepare release");
  assert.equal(edited.description, "Review final accessibility checklist");
  assert.equal(edited.status, "in-progress");
  assert.equal(edited.priority, "low");
  assert.equal(edited.dueDate, date.later);
  assert.equal(edited.createdAt, original.createdAt);
  assert.ok(edited.updatedAt > original.updatedAt);
  await page.reload(); await ready(page);
  assert.equal(await row(page, "Prepare release").count(), 1);
  await row(page, "Prepare release").locator('[data-action="edit"]').click();
  await page.locator("#task-title").fill(" "); await page.locator("#submit-task").click();
  assert.match(await page.locator("#title-error").textContent(), /Enter/);
  assert.equal((await readStorage(page)).find(task => task.id === original.id).title, "Prepare release");
  await page.locator("#task-title").press("Escape");
  assert.equal(await row(page, "Prepare release").locator('[data-action="edit"]').evaluate(element => element === document.activeElement), true);
  await row(page, "Prepare release").locator('[data-action="edit"]').click();
  await page.locator("#task-description").fill("Unsaved draft"); await page.locator("#cancel-edit").click();
  pass("Edit all fields and cancel", "Title, description, priority, status and due date updated with stable ID/createdAt and new updatedAt; refresh persisted; blank edit rejected; Escape and Cancel discarded drafts and restored focus.");

  await row(page, "Prepare release").locator('[data-action="status"]').click();
  await page.reload(); await ready(page);
  assert.equal((await readStorage(page)).find(task => task.id === original.id).status, "completed");
  await row(page, "Prepare release").locator('[data-action="status"]').click();
  await page.reload(); await ready(page);
  assert.equal((await readStorage(page)).find(task => task.id === original.id).status, "todo");
  await row(page, "Write project notes").locator('[data-action="edit"]').click();
  await page.locator("#task-due-date").fill(date.past); await page.locator("#submit-task").click();
  assert.equal(await row(page, "Write project notes").locator(".is-overdue").count(), 0);
  await row(page, "Write project notes").locator('[data-action="edit"]').click();
  await page.locator("#task-due-date").fill(""); await page.locator("#submit-task").click();
  assert.match(await row(page, "Write project notes").locator(".due-label").textContent(), /No due date/);
  await add(page, { title: "Fix color contrast", description: "Review buttons and labels", status: "todo", priority: "high", dueDate: date.past });
  pass("Status and calendar behavior", "Complete/reopen survived refresh; overdue incomplete task counted; completed past-due task excluded; clearing a due date supported.");
  await screenshot(page, "desktop-dashboard");
  await screenshot(page, "populated-task-list");

  const search = query => page.locator("#task-search").fill(query);
  await search("Prepare release"); await count(page, 1);
  await search("preP"); await count(page, 1);
  await search("  ACCESSIBILITY  "); await count(page, 1);
  await search("zzzz-no-task"); await count(page, 0);
  assert.equal(await page.locator("#empty-heading").textContent(), "No tasks match your search.");
  await screenshot(page, "search-empty");
  await search(""); await count(page, 4);
  await search("   "); await count(page, 4); await search("");
  pass("Live search", "Title and description, partial/mixed-case/padded/blank queries, no results, and clearing tested.");

  saved = await readStorage(page);
  for (const status of ["all", "todo", "in-progress", "completed"]) {
    await page.locator("#status-filter").selectOption(status);
    await count(page, saved.filter(task => status === "all" || task.status === status).length);
  }
  await resetView(page);
  for (const priority of ["all", "low", "medium", "high"]) {
    await page.locator("#priority-filter").selectOption(priority);
    await count(page, saved.filter(task => priority === "all" || task.priority === priority).length);
  }
  await resetView(page); await search("review");
  await page.locator("#status-filter").selectOption("todo"); await count(page, 2);
  await page.locator("#priority-filter").selectOption("low"); await count(page, 1);
  await page.locator("#status-filter").selectOption("all"); await count(page, 1);
  await resetView(page); await page.locator("#status-filter").selectOption("in-progress");
  await page.locator("#priority-filter").selectOption("high"); await count(page, 0);
  assert.equal(await page.locator("#empty-heading").textContent(), "No tasks match these filters.");
  await resetView(page); await search("module");
  await page.locator("#status-filter").selectOption("completed");
  await page.locator("#priority-filter").selectOption("low"); await count(page, 1);
  await screenshot(page, "filtered-state");
  pass("Every filter and combinations", "All status/priority options; search+status, search+priority, status+priority and all three combined; filtered empty state and reset verified.");

  await resetView(page);
  const visibleIds = () => rows(page).evaluateAll(items => items.map(item => item.dataset.id));
  await page.locator("#task-sort").selectOption("oldest");
  let order = await visibleIds();
  assert.equal(order[0], original.id);
  await page.locator("#task-sort").selectOption("newest");
  order = await visibleIds();
  assert.equal(order[0], saved.find(task => task.title === "Fix color contrast").id);
  await page.locator("#task-sort").selectOption("due-date");
  order = await visibleIds();
  assert.equal(order[0], saved.find(task => task.title === "Fix color contrast").id);
  assert.equal(order.at(-1), saved.find(task => task.title === "Write project notes").id);
  await page.locator("#task-sort").selectOption("priority");
  order = await visibleIds();
  assert.equal(order[0], saved.find(task => task.priority === "high").id);
  assert.equal(order[1], saved.find(task => task.priority === "medium").id);
  pass("All sorting modes", "Oldest/newest creation order, earliest due date with undated last, and high-to-low priority verified without mutating stored order.");
  await resetView(page);

  const malicious = '<img src=x onerror="window.injected=true">';
  await add(page, { title: malicious, description: "<script>window.injected=true</script>" });
  assert.equal(await row(page, malicious).locator(".task-title").textContent(), malicious);
  assert.equal(await page.locator("#task-list img, #task-list script").count(), 0);
  assert.equal(await page.evaluate(() => window.injected), undefined);
  await row(page, malicious).locator('[data-action="delete"]').click();
  pass("Safe DOM rendering", "HTML-like title/description displayed literally, without injected nodes or script execution.");

  const notes = (await readStorage(page)).find(task => task.title === "Write project notes");
  await row(page, "Write project notes").locator('[data-action="delete"]').click();
  assert.equal((await readStorage(page)).some(task => task.id === notes.id), false);
  assert.equal(await page.evaluate(() => document.activeElement.dataset.action), "delete");
  await page.reload(); await ready(page); await count(page, 3);
  assert.equal((await readStorage(page)).some(task => task.id === notes.id), false);
  pass("Delete correct record and persist", "Requested ID removed while other records remained; focus moved to a remaining delete control; deletion survived refresh.");

  const beforeStale = (await readStorage(page)).length;
  await rows(page).first().evaluate(element => { element.dataset.id = "missing-record"; });
  await rows(page).first().locator('[data-action="delete"]').click();
  assert.match(await page.locator("#action-status").textContent(), /no longer available/);
  await count(page, beforeStale);
  pass("Unexpected stale action", "Simulated stale task ID produced user-facing recovery feedback and a refreshed list without changing saved data or throwing uncaught errors.");

  await page.locator("#task-title").focus(); await page.keyboard.type("Keyboard task");
  await page.keyboard.press("Enter");
  assert.equal(await row(page, "Keyboard task").count(), 1);
  await page.keyboard.press("Tab");
  assert.equal(await page.locator("#task-description").evaluate(element => element === document.activeElement), true);
  assert.equal(await page.locator("#task-description").evaluate(element => getComputedStyle(element).outlineStyle), "solid");
  await row(page, "Keyboard task").locator('[data-action="status"]').focus(); await page.keyboard.press("Enter");
  assert.equal(await row(page, "Keyboard task").locator(".status-badge").textContent(), "In progress");
  await row(page, "Keyboard task").locator('[data-action="edit"]').focus(); await page.keyboard.press("Enter");
  await page.locator("#task-title").press("Escape");
  assert.equal(await page.locator("input, select, textarea").evaluateAll(inputs => inputs.every(input => input.labels.length > 0)), true);
  assert.equal(await page.locator("button").evaluateAll(buttons => buttons.every(button => button.textContent.trim() || button.getAttribute("aria-label"))), true);
  for (const field of ["title", "description", "status", "priority", "dueDate"]) {
    const target = field === "dueDate" ? "task-due-date" : "task-" + field;
    assert.ok((await page.locator("#" + target).getAttribute("aria-describedby")).includes(field + "-error"));
  }
  pass("Keyboard, labels and focus", "Enter creates/changes status/opens edit; Escape cancels; Tab enters description; visible focus, all control labels, real named buttons and associated errors verified.");
  const json = await readStorage(page);
  assert.equal(new Set(json.map(task => task.id)).size, json.length);
  for (const task of json) {
    assert.deepEqual(Object.keys(task).sort(), ["createdAt", "description", "dueDate", "id", "priority", "status", "title", "updatedAt"]);
    assert.ok(Number.isFinite(Date.parse(task.createdAt)) && Number.isFinite(Date.parse(task.updatedAt)));
  }
  pass("Storage JSON inspection", "day15TaskManager parsed directly in the browser; unique IDs, eight expected serializable fields, valid timestamps, no DOM/functions.");
  const beforeActions = navigations;
  await search("keyboard"); await page.locator("#status-filter").selectOption("in-progress");
  await row(page, "Keyboard task").locator('[data-action="status"]').click();
  await resetView(page);
  assert.equal(navigations, beforeActions);
  pass("No core reloads and notifications", "Core actions/search/filter/sort operate without navigation; create/update/delete/validation/stale feedback observed in the live status region.");
  await ctx.close();

  // All core operations are exercised independently at each required width.
  for (const width of [320, 390, 768, 1024, 1366]) {
    const { ctx: responsiveContext, page: tab } = await context({ viewport: { width, height: 1100 } });
    await tab.goto(baseUrl); await ready(tab);
    const localDates = await dates(tab);
    await add(tab, { title: `Responsive review ${width}`, description: "x".repeat(180), priority: "high", dueDate: localDates.today });
    await add(tab, { title: `Other task ${width}`, description: "Keep another record", priority: "low" });
    await noOverflow(tab);
    await row(tab, `Responsive review ${width}`).locator('[data-action="edit"]').click();
    await fillForm(tab, { title: `Updated review ${width}`, description: "x".repeat(180), status: "in-progress", priority: "medium", dueDate: localDates.future });
    await noOverflow(tab);
    await screenshot(tab, `edit-width-${width}`);
    await tab.locator("#submit-task").click();
    await tab.reload(); await ready(tab);
    assert.equal(await row(tab, `Updated review ${width}`).count(), 1);
    await row(tab, `Updated review ${width}`).locator('[data-action="status"]').click();
    await tab.locator("#task-search").fill("updated");
    await tab.locator("#status-filter").selectOption("completed");
    await tab.locator("#priority-filter").selectOption("medium");
    await tab.locator("#task-sort").selectOption("due-date");
    await count(tab, 1); await noOverflow(tab);
    assert.deepEqual(await tab.locator("button:visible, input:visible, select:visible").evaluateAll(controls => controls.filter(control => control.getBoundingClientRect().height < 44).map(control => control.id || control.textContent)), []);
    await screenshot(tab, `width-${width}`);
    if (width === 390) await screenshot(tab, "mobile-view");
    await resetView(tab);
    await row(tab, `Updated review ${width}`).locator('[data-action="delete"]').click();
    await tab.reload(); await ready(tab); await count(tab, 1);
    assert.equal(await row(tab, `Other task ${width}`).count(), 1);
    await row(tab, `Other task ${width}`).locator('[data-action="delete"]').click();
    await count(tab, 0); await noOverflow(tab);
    await responsiveContext.close();
    pass(`Core flows at ${width}px`, "Create/read/edit all fields/status/search/combined filters/sort/reset/delete/refresh completed; long unbroken description, edit form, empty state fit; buttons/inputs/selects at least 44px high; no overflow.");
  }

  const fixture = { id: "fixture", title: "Saved task", description: "Persistence fixture", status: "todo", priority: "medium", dueDate: "", createdAt: "2026-10-23T00:00:00.000Z", updatedAt: "2026-10-23T00:00:00.000Z" };
  async function withSaved(raw, check) {
    const { ctx: storageContext, page: tab } = await context({ storageState: { cookies: [], origins: [{ origin: new URL(baseUrl).origin, localStorage: [{ name: KEY, value: raw }] }] } });
    await tab.goto(baseUrl); await ready(tab); await check(tab); await storageContext.close();
  }
  for (const raw of ["", "  ", "[]"]) await withSaved(raw, async tab => {
    await count(tab, 0); assert.equal(await tab.locator("#storage-warning").textContent(), "");
  });
  pass("Empty saved data", "Empty string, whitespace, and JSON empty array initialize safely without a warning.");
  for (const raw of ["{bad json", "{}", "null", "[null]", JSON.stringify([fixture, fixture]), JSON.stringify([{ ...fixture, status: "invalid" }]), JSON.stringify([{ ...fixture, priority: "invalid" }]), JSON.stringify([{ ...fixture, dueDate: "2026-02-30" }]), JSON.stringify([{ ...fixture, createdAt: "bad" }])]) {
    await withSaved(raw, async tab => {
      await count(tab, 0);
      assert.match(await tab.locator("#storage-warning").textContent(), /invalid/);
      assert.equal(await tab.evaluate(key => localStorage.getItem(key), KEY), raw);
      await add(tab, { title: "Recovered task" });
      assert.equal((await readStorage(tab))[0].title, "Recovered task");
      assert.equal(await tab.locator("#storage-warning").textContent(), "");
    });
  }
  pass("Malformed/invalid storage recovery", "Nine bad JSON/schema/duplicate/enum/date/timestamp cases handled visibly without overwriting originals until a successful new change; recovery save cleared warning.");
  {
    const { ctx: errorContext, page: tab } = await context();
    await errorContext.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } }); });
    await tab.goto(baseUrl); await ready(tab);
    assert.match(await tab.locator("#storage-warning").textContent(), /could not be read/);
    await add(tab, { title: "Memory-only task" }); await count(tab, 1);
    assert.match(await tab.locator("#storage-warning").textContent(), /could not be saved/);
    await screenshot(tab, "storage-error");
    await row(tab, "Memory-only task").locator('[data-action="status"]').click();
    await row(tab, "Memory-only task").locator('[data-action="delete"]').click(); await count(tab, 0);
    await errorContext.close();
    pass("Storage getter/read failure", "SecurityError thrown by localStorage getter caught during initialization and saving; controls enabled, memory-only create/status/delete worked with persistent warning.");
  }
  {
    const { ctx: errorContext, page: tab } = await context();
    await errorContext.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException("Full", "QuotaExceededError"); }; });
    await tab.goto(baseUrl); await ready(tab);
    await add(tab, { title: "Quota test task" }); await count(tab, 1);
    assert.match(await tab.locator("#storage-warning").textContent(), /could not be saved/);
    await tab.reload(); await ready(tab); await count(tab, 0);
    await errorContext.close();
    pass("Storage quota/write failure", "Simulated quota error kept task usable in memory and showed refresh-loss warning; refreshing confirmed it was not persisted.");
  }
  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.uncaught, []);
  assert.deepEqual(report.failedRequests, []);
  pass("Console, imports and local assets", "Zero console errors, uncaught exceptions/rejections, failed requests or HTTP errors across development/production, normal flows and handled storage-failure scenarios.");
}

await fs.mkdir(output, { recursive: true });
try { await run(); }
catch (error) { report.results.push({ name: "Run failure", status: "NEEDS FIX", detail: error.stack }); console.error(error); process.exitCode = 1; }
finally {
  await fs.writeFile(path.join(root, "qa", "browser-results.json"), JSON.stringify(report, null, 2));
  if (browser) await browser.close();
}
