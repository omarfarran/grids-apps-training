import test from "node:test";
import assert from "node:assert/strict";
import { validateTask, validateStoredTasks, isValidDueDate } from "../src/validation.js";
import { createTask, updateTask, deleteTask, nextStatus, filterTasks, sortTasks, isOverdue, localDateKey, summarizeTasks } from "../src/tasks.js";
import { loadTasks, saveTasks, STORAGE_KEY } from "../src/storage.js";

const input = { title: "Plan release", description: "Review the checklist", status: "todo", priority: "medium", dueDate: "2026-10-23" };
const timestamp = "2026-10-22T12:00:00.000Z";
const record = { id: "task-a", ...input, createdAt: timestamp, updatedAt: timestamp };
function memoryStorage(raw = null) {
  let value = raw;
  return { getItem: (key) => { assert.equal(key, STORAGE_KEY); return value; }, setItem: (key, next) => { assert.equal(key, STORAGE_KEY); value = next; }, value: () => value };
}

test("validation trims title, description and optional due date", () => {
  const result = validateTask({ ...input, title: "  Plan  ", description: "  Details  ", dueDate: "  " });
  assert.equal(result.valid, true);
  assert.equal(result.values.title, "Plan");
  assert.equal(result.values.description, "Details");
  assert.equal(result.values.dueDate, "");
});
test("blank title is rejected", () => {
  assert.equal(validateTask({ ...input, title: " \n " }).valid, false);
  assert.ok(validateTask({ ...input, title: "" }).errors.title);
});
test("title and description length boundaries", () => {
  assert.equal(validateTask({ ...input, title: "x".repeat(100), description: "x".repeat(1000) }).valid, true);
  assert.ok(validateTask({ ...input, title: "x".repeat(101) }).errors.title);
  assert.ok(validateTask({ ...input, description: "x".repeat(1001) }).errors.description);
});
test("status and priority are constrained to known values", () => {
  assert.ok(validateTask({ ...input, status: "unknown" }).errors.status);
  assert.ok(validateTask({ ...input, priority: "__proto__" }).errors.priority);
});
test("due date validates format, actual calendar dates and supported range", () => {
  for (const value of ["", "2024-02-29", "1900-01-01", "9999-12-31"]) assert.equal(isValidDueDate(value), true);
  for (const value of ["2026-02-29", "2026-04-31", "2026-13-01", "2026-1-01", "1899-12-31", "tomorrow"]) assert.equal(isValidDueDate(value), false);
});
test("stored records whitelist known fields and normalize text", () => {
  const saved = validateStoredTasks([{ ...record, title: "  Plan  ", extra: "discard" }]);
  assert.equal(saved[0].title, "Plan");
  assert.equal(Object.hasOwn(saved[0], "extra"), false);
  assert.equal(saved[0].id, record.id);
});
test("invalid stored schema, IDs, timestamps and duplicate IDs rejected", () => {
  for (const value of [{}, [null], [{ ...record, id: "" }], [record, record], [{ ...record, description: null }], [{ ...record, dueDate: "2026-02-30" }], [{ ...record, createdAt: "bad" }], [{ ...record, updatedAt: "2026-02-30T12:00:00.000Z" }]]) {
    assert.throws(() => validateStoredTasks(value));
  }
});
test("create returns unique IDs and a new array without mutating input", () => {
  const before = Object.freeze([Object.freeze({ ...record })]);
  const next = createTask(before, input, timestamp);
  assert.equal(before.length, 1);
  assert.equal(next.length, 2);
  assert.notEqual(next[0].id, record.id);
  assert.equal(next[0].createdAt, timestamp);
  assert.notEqual(createTask([], input)[0].id, createTask([], input)[0].id);
});
test("update preserves stable ID/createdAt and updates all editable fields immutably", () => {
  const before = Object.freeze([Object.freeze({ ...record })]);
  const updatedAt = "2026-10-23T10:00:00.000Z";
  const next = updateTask(before, record.id, { title: "Updated", description: "New details", status: "completed", priority: "high", dueDate: "" }, updatedAt);
  assert.equal(before[0].title, input.title);
  assert.equal(next[0].id, record.id);
  assert.equal(next[0].createdAt, timestamp);
  assert.equal(next[0].updatedAt, updatedAt);
  assert.equal(next[0].description, "New details");
  assert.equal(next[0].status, "completed");
  assert.equal(next[0].priority, "high");
  assert.equal(next[0].dueDate, "");
});
test("delete removes only the requested ID and rejects stale actions", () => {
  const before = [record, { ...record, id: "task-b" }];
  assert.deepEqual(deleteTask(before, record.id).map((task) => task.id), ["task-b"]);
  assert.equal(before.length, 2);
  assert.throws(() => deleteTask(before, "missing"), /no longer available/);
  assert.throws(() => updateTask(before, "missing", input), /no longer available/);
});
test("status cycles through all states and rejects unknown state", () => {
  assert.equal(nextStatus("todo"), "in-progress");
  assert.equal(nextStatus("in-progress"), "completed");
  assert.equal(nextStatus("completed"), "todo");
  assert.throws(() => nextStatus("bad"));
});
test("search title/description combines with both filters", () => {
  const tasks = [record, { ...record, id: "b", title: "Other", status: "completed", priority: "high" }];
  assert.equal(filterTasks(tasks, { search: "  CHECKLIST ", status: "todo", priority: "medium" }).length, 1);
  assert.equal(filterTasks(tasks, { search: "plan", status: "all", priority: "high" }).length, 0);
  assert.equal(filterTasks(tasks, { search: " ", status: "all", priority: "all" }).length, 2);
});
test("all sort modes have correct order, no due date last, and no mutation", () => {
  const tasks = [
    { ...record, id: "a", createdAt: "2026-10-21T10:00:00.000Z", priority: "low", dueDate: "" },
    { ...record, id: "b", createdAt: "2026-10-22T10:00:00.000Z", priority: "high", dueDate: "2026-10-24" },
    { ...record, id: "c", createdAt: "2026-10-23T10:00:00.000Z", priority: "medium", dueDate: "2026-10-23" },
  ];
  const order = (sort) => sortTasks(tasks, sort).map((task) => task.id);
  assert.deepEqual(order("newest"), ["c", "b", "a"]);
  assert.deepEqual(order("oldest"), ["a", "b", "c"]);
  assert.deepEqual(order("due-date"), ["c", "b", "a"]);
  assert.deepEqual(order("priority"), ["b", "c", "a"]);
  assert.deepEqual(tasks.map((task) => task.id), ["a", "b", "c"]);
});
test("local dates and overdue logic exclude today, missing date and completed", () => {
  assert.equal(localDateKey(new Date(2026, 9, 23, 0, 5)), "2026-10-23");
  assert.equal(isOverdue({ ...record, dueDate: "2026-10-22" }, "2026-10-23"), true);
  for (const changes of [{ dueDate: "2026-10-23" }, { dueDate: "" }, { dueDate: "2026-10-22", status: "completed" }]) assert.equal(isOverdue({ ...record, ...changes }, "2026-10-23"), false);
});
test("dashboard summary derives all counts from actual records", () => {
  const tasks = [record, { ...record, id: "b", status: "in-progress", dueDate: "2026-10-21" }, { ...record, id: "c", status: "completed", dueDate: "2026-10-20" }];
  assert.deepEqual(summarizeTasks(tasks, "2026-10-23"), { total: 3, todo: 1, "in-progress": 1, completed: 1, overdue: 1 });
});
test("storage handles missing, empty, whitespace and valid JSON", () => {
  for (const raw of [null, "", "  ", "[]"]) assert.deepEqual(loadTasks(memoryStorage(raw)), { tasks: [], warning: "" });
  assert.deepEqual(loadTasks(memoryStorage(JSON.stringify([record]))).tasks, [record]);
});
test("malformed storage recovery does not overwrite original data", () => {
  for (const raw of ["{bad", "null", "{}", "[null]", JSON.stringify([record, record])]) {
    const storage = memoryStorage(raw);
    const result = loadTasks(storage);
    assert.deepEqual(result.tasks, []);
    assert.match(result.warning, /invalid/);
    assert.equal(storage.value(), raw);
  }
});
test("storage read exceptions return visible warning text", () => {
  const result = loadTasks({ getItem() { throw new Error("Blocked"); } });
  assert.deepEqual(result.tasks, []);
  assert.match(result.warning, /could not be read/);
});
test("save serializes only valid model data as JSON", () => {
  const storage = memoryStorage();
  assert.equal(saveTasks([{ ...record, extra: "omit" }], storage).saved, true);
  assert.deepEqual(JSON.parse(storage.value()), [record]);
});
test("save handles quota and invalid-record failures without corrupting storage", () => {
  assert.equal(saveTasks([record], { setItem() { throw new Error("Quota"); } }).saved, false);
  const storage = memoryStorage("original");
  assert.equal(saveTasks([{ ...record, priority: "invalid" }], storage).saved, false);
  assert.equal(storage.value(), "original");
});
