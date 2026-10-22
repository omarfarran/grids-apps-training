import { STATUS_LABELS, PRIORITY_LABELS } from "./validation.js";
import { isOverdue, localDateKey, formatDueDate, summarizeTasks } from "./tasks.js";

export function showFormErrors(elements, errors = {}) {
  Object.keys(elements.inputs).forEach((field) => {
    elements.errors[field].textContent = errors[field] || "";
    if (errors[field]) elements.inputs[field].setAttribute("aria-invalid", "true");
    else elements.inputs[field].removeAttribute("aria-invalid");
  });
}

export function renderSummary(elements, tasks) {
  const summary = summarizeTasks(tasks);
  Object.entries(elements.summary).forEach(([key, element]) => { element.textContent = summary[key]; });
}

function actionButton(label, action, task) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("task-action");
  button.dataset.action = action;
  button.textContent = label;
  button.setAttribute("aria-label", `${label}: ${task.title}`);
  if (action === "delete") button.classList.add("delete-action");
  return button;
}

function createTaskCard(task, editingId) {
  const item = document.createElement("li");
  item.classList.add("task-card");
  item.classList.toggle("is-editing", task.id === editingId);
  item.classList.toggle("is-completed", task.status === "completed");
  item.dataset.id = task.id;
  const heading = document.createElement("div");
  heading.classList.add("task-heading");
  const title = document.createElement("h3");
  title.classList.add("task-title");
  title.textContent = task.title;
  const status = document.createElement("span");
  status.classList.add("status-badge", `status-${task.status}`);
  status.textContent = STATUS_LABELS[task.status];
  heading.append(title, status);
  const description = document.createElement("p");
  description.classList.add("task-description");
  description.textContent = task.description || "No description added.";
  const meta = document.createElement("div");
  meta.classList.add("task-meta");
  const priority = document.createElement("span");
  priority.classList.add("priority-label", `priority-${task.priority}`);
  priority.textContent = `${PRIORITY_LABELS[task.priority]} priority`;
  const due = document.createElement("span");
  due.classList.add("due-label");
  const overdue = isOverdue(task);
  due.classList.toggle("is-overdue", overdue);
  due.textContent = `${overdue ? "Overdue · " : task.dueDate === localDateKey() ? "Due today · " : ""}${formatDueDate(task.dueDate)}`;
  meta.append(priority, due);
  const actions = document.createElement("div");
  actions.classList.add("task-actions");
  const statusAction = { todo: "Start task", "in-progress": "Complete task", completed: "Reopen task" }[task.status];
  actions.append(actionButton(statusAction, "status", task), actionButton("Edit task", "edit", task), actionButton("Delete task", "delete", task));
  item.append(heading, description, meta, actions);
  return item;
}

export function renderTasks(elements, tasks, total, filters, editingId) {
  elements.list.replaceChildren(...tasks.map((task) => createTaskCard(task, editingId)));
  elements.workspace.setAttribute("aria-busy", "false");
  elements.count.textContent = `Showing ${tasks.length} of ${total} ${total === 1 ? "task" : "tasks"}`;
  elements.empty.hidden = tasks.length > 0;
  elements.empty.dataset.state = "empty";
  if (total === 0) {
    elements.emptyHeading.textContent = "Your next step starts here.";
    elements.emptyCopy.textContent = "No tasks yet. Add your first task to give it a place to grow.";
  } else if (filters.search.trim()) {
    elements.emptyHeading.textContent = "No tasks match your search.";
    elements.emptyCopy.textContent = "Try another title or description, or reset the view.";
  } else {
    elements.emptyHeading.textContent = "No tasks match these filters.";
    elements.emptyCopy.textContent = "Choose another status or priority, or reset the view.";
  }
  elements.empty.querySelector(".empty-icon").textContent = "✓";
}

export function fillTaskForm(elements, task) {
  elements.form.reset();
  if (task) Object.keys(elements.inputs).forEach((key) => { elements.inputs[key].value = task[key]; });
  elements.formHeading.textContent = task ? "Edit task" : "New task";
  elements.formHelp.textContent = task ? "Update the details, then save your changes." : "Start with one thing you want to move forward.";
  elements.submit.textContent = task ? "Save changes" : "Add task";
  elements.cancel.hidden = !task;
  showFormErrors(elements);
}

export function notify(elements, message, isError = false) {
  // Alternating a zero-width suffix ensures repeated actions are announced too.
  elements.notification.dataset.error = String(isError);
  elements.notification.textContent = message + (elements.notification.textContent.endsWith("\u200b") ? "" : "\u200b");
}

export function focusTaskAction(elements, id, action) {
  const row = Array.from(elements.list.children).find((item) => item.dataset.id === id);
  const target = row?.querySelector(`[data-action="${action}"]`) || elements.list.querySelector(`[data-action="${action}"]`) || elements.inputs.title;
  target.focus();
}
