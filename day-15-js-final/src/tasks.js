import { validateTask, STATUS_LABELS } from "./validation.js";

function checkedValues(input) {
  const result = validateTask(input);
  if (!result.valid) throw new Error("Task data is invalid. Review the form and try again.");
  return result.values;
}

export function findTask(tasks, id) {
  const task = tasks.find((task) => task.id === id);
  if (!task) throw new Error("This task is no longer available. The list has been refreshed.");
  return task;
}

export function createTask(tasks, input, now = new Date().toISOString()) {
  const values = checkedValues(input);
  let id;
  do { id = crypto.randomUUID(); } while (tasks.some((task) => task.id === id));
  return [{ id, ...values, createdAt: now, updatedAt: now }, ...tasks];
}

export function updateTask(tasks, id, input, now = new Date().toISOString()) {
  findTask(tasks, id);
  const values = checkedValues(input);
  return tasks.map((task) => task.id === id ? { ...task, ...values, updatedAt: now } : task);
}

export function deleteTask(tasks, id) {
  findTask(tasks, id);
  return tasks.filter((task) => task.id !== id);
}

export function nextStatus(status) {
  if (!Object.hasOwn(STATUS_LABELS, status)) throw new Error("The task status is invalid. Refresh the workspace to recover.");
  return { todo: "in-progress", "in-progress": "completed", completed: "todo" }[status];
}

export function filterTasks(tasks, filters) {
  const query = filters.search.trim().toLowerCase();
  return tasks.filter((task) =>
    (task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)) &&
    (filters.status === "all" || task.status === filters.status) &&
    (filters.priority === "all" || task.priority === filters.priority)
  );
}

export function sortTasks(tasks, sort) {
  const priorityRank = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => {
    let order = 0;
    if (sort === "oldest") order = a.createdAt.localeCompare(b.createdAt);
    else if (sort === "due-date") order = (a.dueDate || "9999-99-99").localeCompare(b.dueDate || "9999-99-99");
    else if (sort === "priority") order = priorityRank[a.priority] - priorityRank[b.priority];
    else order = b.createdAt.localeCompare(a.createdAt);
    return order || a.id.localeCompare(b.id);
  });
}

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function isOverdue(task, today = localDateKey()) {
  // Validated YYYY-MM-DD strings compare chronologically without UTC conversion.
  return Boolean(task.dueDate && task.dueDate < today && task.status !== "completed");
}

export function summarizeTasks(tasks, today = localDateKey()) {
  return tasks.reduce((summary, task) => {
    summary.total++;
    summary[task.status]++;
    if (isOverdue(task, today)) summary.overdue++;
    return summary;
  }, { total: 0, todo: 0, "in-progress": 0, completed: 0, overdue: 0 });
}

export function formatDueDate(value) {
  if (!value) return "No due date";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day));
}
