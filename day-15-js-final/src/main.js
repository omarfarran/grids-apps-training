import { state, setTasks, setFilters, resetFilters, setEditing } from "./state.js";
import { loadTasks, saveTasks } from "./storage.js";
import { createTask, updateTask, deleteTask, findTask, nextStatus, filterTasks, sortTasks } from "./tasks.js";
import { validateTask } from "./validation.js";
import { renderSummary, renderTasks, fillTaskForm, showFormErrors, notify, focusTaskAction } from "./ui.js";

const elements = {
  form: document.querySelector("#task-form"),
  fields: document.querySelector("#task-fields"),
  formHeading: document.querySelector("#form-heading"),
  formHelp: document.querySelector("#form-help"),
  submit: document.querySelector("#submit-task"),
  cancel: document.querySelector("#cancel-edit"),
  inputs: {
    title: document.querySelector("#task-title"), description: document.querySelector("#task-description"),
    status: document.querySelector("#task-status"), priority: document.querySelector("#task-priority"), dueDate: document.querySelector("#task-due-date"),
  },
  errors: Object.fromEntries(["title", "description", "status", "priority", "dueDate"].map((field) => [field, document.querySelector(`#${field}-error`)])),
  viewForm: document.querySelector("#view-form"), viewFields: document.querySelector("#view-fields"),
  search: document.querySelector("#task-search"), statusFilter: document.querySelector("#status-filter"),
  priorityFilter: document.querySelector("#priority-filter"), sort: document.querySelector("#task-sort"), reset: document.querySelector("#reset-view"),
  workspace: document.querySelector("#task-workspace"), list: document.querySelector("#task-list"), count: document.querySelector("#result-count"),
  empty: document.querySelector("#empty-state"), emptyHeading: document.querySelector("#empty-heading"), emptyCopy: document.querySelector("#empty-copy"),
  notification: document.querySelector("#action-status"), storageWarning: document.querySelector("#storage-warning"),
  summary: { total: document.querySelector("#summary-total"), todo: document.querySelector("#summary-todo"), "in-progress": document.querySelector("#summary-progress"), completed: document.querySelector("#summary-completed"), overdue: document.querySelector("#summary-overdue") },
};

function renderWorkspace() {
  renderSummary(elements, state.tasks);
  const visible = sortTasks(filterTasks(state.tasks, state.filters), state.filters.sort);
  renderTasks(elements, visible, state.tasks.length, state.filters, state.editingId);
}

function safely(action) {
  try { action(); }
  catch (error) {
    renderWorkspace();
    notify(elements, error.message || "The action could not be completed. Please try again.", true);
  }
}

function commitTasks(nextTasks, message) {
  setTasks(nextTasks);
  const result = saveTasks(state.tasks);
  elements.storageWarning.textContent = result.warning;
  renderWorkspace();
  notify(elements, message);
}

function resetTaskForm() {
  setEditing(null);
  fillTaskForm(elements);
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.initialized) return;
  const input = Object.fromEntries(Object.entries(elements.inputs).map(([key, element]) => [key, element.value]));
  const result = validateTask(input);
  if (elements.inputs.dueDate.validity.badInput) {
    result.valid = false;
    result.errors.dueDate = "Complete the due date or leave it empty.";
  }
  showFormErrors(elements, result.errors);
  if (!result.valid) {
    elements.inputs[Object.keys(result.errors)[0]].focus();
    notify(elements, "Review the highlighted task details.", true);
    return;
  }
  safely(() => {
    const editing = state.editingId !== null;
    const nextTasks = editing ? updateTask(state.tasks, state.editingId, result.values) : createTask(state.tasks, result.values);
    const affectedId = editing ? state.editingId : nextTasks[0].id;
    const isVisible = filterTasks(nextTasks, state.filters).some((task) => task.id === affectedId);
    resetTaskForm();
    commitTasks(nextTasks, `Task ${editing ? "updated" : "created"}.${isVisible ? "" : " Adjust search or filters to see it."}`);
    elements.inputs.title.focus();
  });
});

elements.cancel.addEventListener("click", () => {
  const previousId = state.editingId;
  resetTaskForm();
  renderWorkspace();
  notify(elements, "Edit cancelled.");
  focusTaskAction(elements, previousId, "edit");
});

elements.form.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.editingId !== null) {
    event.preventDefault();
    elements.cancel.click();
  }
});

// Delegation handles all task buttons, including cards created by later renders.
elements.list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = button.closest("[data-id]").dataset.id;
  safely(() => {
    const task = findTask(state.tasks, id);
    const action = button.dataset.action;
    if (action === "edit") {
      setEditing(id);
      fillTaskForm(elements, task);
      renderWorkspace();
      notify(elements, `Editing: ${task.title}`);
      elements.inputs.title.focus();
      elements.inputs.title.select();
    } else if (action === "delete") {
      const nextTasks = deleteTask(state.tasks, id);
      if (state.editingId === id) resetTaskForm();
      commitTasks(nextTasks, "Task deleted.");
      focusTaskAction(elements, id, "delete");
    } else if (action === "status") {
      const nextTasks = updateTask(state.tasks, id, { ...task, status: nextStatus(task.status) });
      // Keep an open edit form in sync with status actions on the same record.
      if (state.editingId === id) elements.inputs.status.value = nextTasks.find((item) => item.id === id).status;
      commitTasks(nextTasks, "Task status updated.");
      focusTaskAction(elements, id, "status");
    }
  });
});

function updateView() {
  setFilters({ search: elements.search.value, status: elements.statusFilter.value, priority: elements.priorityFilter.value, sort: elements.sort.value });
  renderWorkspace();
  notify(elements, elements.count.textContent);
}
elements.viewForm.addEventListener("submit", (event) => event.preventDefault());
elements.search.addEventListener("input", updateView);
[elements.statusFilter, elements.priorityFilter, elements.sort].forEach((control) => control.addEventListener("change", updateView));
elements.reset.addEventListener("click", () => {
  resetFilters();
  elements.viewForm.reset();
  renderWorkspace();
  notify(elements, "View reset. Showing all tasks.");
  elements.search.focus();
});

// Truthful initialization: disabled HTML/loading remain until saved data is read
// and validated. localStorage is synchronous; there is no fake delay or request.
const loaded = loadTasks();
setTasks(loaded.tasks);
elements.storageWarning.textContent = loaded.warning;
renderWorkspace();
state.initialized = true;
elements.fields.disabled = false;
elements.viewFields.disabled = false;
notify(elements, "Workspace ready.");

// Recalculate calendar-dependent badges when the user returns to this tab.
window.addEventListener("focus", renderWorkspace);
