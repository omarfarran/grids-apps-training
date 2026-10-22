export const STATUS_LABELS = { todo: "Todo", "in-progress": "In progress", completed: "Completed" };
export const PRIORITY_LABELS = { low: "Low", medium: "Medium", high: "High" };
export const TITLE_LIMIT = 100;
export const DESCRIPTION_LIMIT = 1000;

export function isValidDueDate(value) {
  if (value === "") return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1900 || year > 9999) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function validateTask(input) {
  const values = {
    title: typeof input.title === "string" ? input.title.trim() : "",
    description: typeof input.description === "string" ? input.description.trim() : "",
    status: input.status,
    priority: input.priority,
    dueDate: typeof input.dueDate === "string" ? input.dueDate.trim() : "",
  };
  const errors = {};
  if (!values.title) errors.title = "Enter a task title.";
  else if (values.title.length > TITLE_LIMIT) errors.title = "Use 100 characters or fewer.";
  if (values.description.length > DESCRIPTION_LIMIT) errors.description = "Use 1,000 characters or fewer.";
  if (!Object.hasOwn(STATUS_LABELS, values.status)) errors.status = "Choose a valid status.";
  if (!Object.hasOwn(PRIORITY_LABELS, values.priority)) errors.priority = "Choose a valid priority.";
  if (!isValidDueDate(values.dueDate)) errors.dueDate = "Enter a real date from 1900 to 9999.";
  return { valid: Object.keys(errors).length === 0, errors, values };
}

function isIsoTimestamp(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

export function validateStoredTasks(value) {
  if (!Array.isArray(value)) throw new Error("Expected a task array");
  const ids = new Set();
  return value.map((task) => {
    if (!task || typeof task !== "object" || typeof task.id !== "string" || !task.id.trim() || task.id.length > 100 ||
        ids.has(task.id) || typeof task.title !== "string" || typeof task.description !== "string" ||
        typeof task.dueDate !== "string" || !isIsoTimestamp(task.createdAt) || !isIsoTimestamp(task.updatedAt)) {
      throw new Error("Invalid task record");
    }
    const result = validateTask(task);
    if (!result.valid) throw new Error("Invalid task fields");
    ids.add(task.id);
    // Whitelist the model's fields; do not restore arbitrary saved properties.
    return { id: task.id, ...result.values, createdAt: task.createdAt, updatedAt: task.updatedAt };
  });
}
