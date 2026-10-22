"use strict";

// 1. Cache DOM references. Dynamic task controls use event delegation below.
const taskForm = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const titleError = document.querySelector("#title-error");
const taskList = document.querySelector("#task-list");
const searchInput = document.querySelector("#task-search");
const filterButtons = document.querySelectorAll("[data-filter]");
const totalCount = document.querySelector("#total-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const emptyHeading = document.querySelector("#empty-heading");
const emptyDescription = document.querySelector("#empty-description");
const actionStatus = document.querySelector("#action-status");
const storageStatus = document.querySelector("#storage-status");

// 2. Application state: only tasks are persisted; search/edit/filter are temporary.
const STORAGE_KEY = "day13Tasks";
const MAX_TITLE_LENGTH = 160;
let tasks = [];
let searchText = "";
let currentFilter = "all";
let editingId = null;

// 3. Storage: validate the entire record set before using saved data.
function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks === null || savedTasks.trim() === "") return [];

    const parsedTasks = JSON.parse(savedTasks);
    const seenIds = new Set();
    const valid = Array.isArray(parsedTasks) && parsedTasks.every((task) => {
      if (!task || typeof task !== "object" ||
          typeof task.id !== "string" || !task.id.trim() || seenIds.has(task.id) ||
          typeof task.title !== "string" || !task.title.trim() ||
          task.title.trim().length > MAX_TITLE_LENGTH ||
          typeof task.completed !== "boolean" ||
          typeof task.createdAt !== "string" || !Number.isFinite(Date.parse(task.createdAt))) {
        return false;
      }
      seenIds.add(task.id);
      return true;
    });

    if (!valid) throw new Error("Invalid saved task data");
    // Copy only the fields used by the app, rather than trusting extra stored fields.
    return parsedTasks.map((task) => ({
      id: task.id,
      title: task.title.trim(),
      completed: task.completed,
      createdAt: task.createdAt,
    }));
  } catch (error) {
    storageStatus.textContent = "Saved tasks could not be read. You can start a new list. Your next change will try to replace the saved data.";
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    storageStatus.textContent = "";
  } catch (error) {
    storageStatus.textContent = "Tasks are available in this tab, but could not be saved. Allow browser storage or free some space; changes may be lost after refresh.";
  }
}

// 4. Shared validation for create and edit.
function validateTitle(title) {
  if (!title) return "Enter a task title. A title cannot be blank.";
  if (title.length > MAX_TITLE_LENGTH) return "Use 160 characters or fewer.";
  return "";
}

// 5. Rendering always derives the list, counts and empty state from current state.
function createActionButton(text, action, title) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("task-action");
  if (action === "delete") button.classList.add("delete-button");
  button.dataset.action = action;
  button.textContent = text;
  button.setAttribute("aria-label", `${text} task: ${title}`);
  return button;
}

function createEditForm(task) {
  const form = document.createElement("form");
  form.classList.add("edit-form");
  form.noValidate = true;
  const label = document.createElement("label");
  label.htmlFor = "edit-title";
  label.textContent = "Edit task title";
  const input = document.createElement("input");
  input.id = "edit-title";
  input.name = "editTitle";
  input.type = "text";
  input.value = task.title;
  input.maxLength = MAX_TITLE_LENGTH;
  input.required = true;
  input.setAttribute("aria-describedby", "edit-error");
  const error = document.createElement("p");
  error.id = "edit-error";
  error.classList.add("error");
  error.setAttribute("role", "alert");
  const actions = document.createElement("div");
  actions.classList.add("task-actions");
  const saveButton = createActionButton("Save", "save", task.title);
  saveButton.type = "submit";
  saveButton.classList.add("primary");
  actions.append(saveButton, createActionButton("Cancel", "cancel", task.title));
  form.append(label, input, error, actions);
  return form;
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.classList.add("task-item");
  item.classList.toggle("is-completed", task.completed);
  item.dataset.id = task.id;
  if (task.id === editingId) {
    item.append(createEditForm(task));
    return item;
  }

  const checkboxLabel = document.createElement("label");
  checkboxLabel.classList.add("task-check");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.dataset.action = "toggle";
  const accessibleLabel = document.createElement("span");
  accessibleLabel.classList.add("visually-hidden");
  accessibleLabel.textContent = `Mark ${task.title} as ${task.completed ? "active" : "completed"}`;
  checkboxLabel.append(checkbox, accessibleLabel);

  const content = document.createElement("div");
  content.classList.add("task-content");
  const title = document.createElement("span");
  title.classList.add("task-title");
  title.textContent = task.title; // User text is never interpreted as HTML.
  const meta = document.createElement("span");
  meta.classList.add("task-meta");
  meta.textContent = `${task.completed ? "Completed" : "Active"} · Added ${new Date(task.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  content.append(title, meta);
  const actions = document.createElement("div");
  actions.classList.add("task-actions");
  actions.append(createActionButton("Edit", "edit", task.title), createActionButton("Delete", "delete", task.title));
  item.append(checkboxLabel, content, actions);
  return item;
}

function getVisibleTasks() {
  return tasks.filter((task) => {
    const matchesStatus = currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);
    return matchesStatus && task.title.toLowerCase().includes(searchText);
  });
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  const completed = tasks.filter((task) => task.completed).length;
  totalCount.textContent = tasks.length;
  activeCount.textContent = tasks.length - completed;
  completedCount.textContent = completed;
  resultsCount.textContent = `Showing ${visibleTasks.length} of ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === currentFilter));
  });
  taskList.replaceChildren(...visibleTasks.map(createTaskElement));
  emptyState.hidden = visibleTasks.length > 0;
  emptyHeading.textContent = tasks.length === 0 ? "A fresh page." : "No matching tasks.";
  emptyDescription.textContent = tasks.length === 0
    ? "No tasks yet. Add your first task above to get started."
    : "Try another search or choose a different status filter.";
}

// Restore keyboard focus after replacing dynamic list elements.
function focusTaskControl(id, action) {
  const item = Array.from(taskList.children).find((row) => row.dataset.id === id);
  const control = item && item.querySelector(`[data-action="${action}"]`);
  const fallback = taskList.querySelector(`[data-action="${action}"]`);
  (control || fallback || titleInput).focus();
}

function finishChange(message) {
  saveTasks();
  renderTasks();
  actionStatus.textContent = message;
}

// 6. CRUD operations locate records with stable IDs, never array positions.
function addTask(title) {
  let id;
  do {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  } while (tasks.some((task) => task.id === id));
  tasks.unshift({ id, title, completed: false, createdAt: new Date().toISOString() });
  editingId = null;
  finishChange("Task added. Use All or adjust your search if it is hidden by the current view.");
}

function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (!task) return;
  task.completed = !task.completed;
  finishChange(`Task marked ${task.completed ? "completed" : "active"}.`);
  focusTaskControl(id, "toggle");
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  if (editingId === id) editingId = null;
  finishChange("Task deleted.");
  focusTaskControl(id, "delete");
}

function startEditing(id) {
  editingId = id;
  renderTasks();
  const editInput = taskList.querySelector("#edit-title");
  if (editInput) {
    editInput.focus();
    editInput.select();
  }
}

function cancelEditing() {
  const previousId = editingId;
  editingId = null;
  renderTasks();
  actionStatus.textContent = "Edit cancelled.";
  focusTaskControl(previousId, "edit");
}

function updateTask(id, title) {
  const task = tasks.find((task) => task.id === id);
  if (!task) return;
  task.title = title;
  editingId = null;
  finishChange("Task updated.");
  focusTaskControl(id, "edit");
}

// 7. Search and status combine in getVisibleTasks(); neither changes stored tasks.
searchInput.addEventListener("input", () => {
  searchText = searchInput.value.trim().toLowerCase();
  editingId = null;
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    editingId = null;
    renderTasks();
  });
});

// 8. Forms prevent navigation; delegated handlers also cover newly rendered tasks.
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const error = validateTitle(title);
  titleError.textContent = error;
  titleInput.setAttribute("aria-invalid", String(Boolean(error)));
  if (error) {
    titleInput.focus();
    return;
  }
  addTask(title);
  taskForm.reset();
  titleInput.focus();
});

titleInput.addEventListener("input", () => {
  titleError.textContent = "";
  titleInput.removeAttribute("aria-invalid");
});

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = button.closest("[data-id]");
  if (button.dataset.action === "edit") startEditing(item.dataset.id);
  if (button.dataset.action === "delete") deleteTask(item.dataset.id);
  if (button.dataset.action === "cancel") cancelEditing();
});

taskList.addEventListener("change", (event) => {
  if (event.target.matches('[data-action="toggle"]')) {
    toggleTask(event.target.closest("[data-id]").dataset.id);
  }
});

taskList.addEventListener("submit", (event) => {
  if (!event.target.matches(".edit-form")) return;
  event.preventDefault();
  const input = event.target.querySelector("input");
  const title = input.value.trim();
  const error = validateTitle(title);
  event.target.querySelector(".error").textContent = error;
  input.setAttribute("aria-invalid", String(Boolean(error)));
  if (error) {
    input.focus();
    return;
  }
  updateTask(event.target.closest("[data-id]").dataset.id, title);
});

taskList.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && editingId !== null) {
    event.preventDefault();
    cancelEditing();
  }
});

// 9. Initialize without seeding or overwriting existing browser data.
tasks = loadTasks();
renderTasks();
