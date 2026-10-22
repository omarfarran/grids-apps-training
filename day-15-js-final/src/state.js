export const DEFAULT_FILTERS = { search: "", status: "all", priority: "all", sort: "newest" };

// This small coordinator-owned object intentionally changes as the user acts.
// Task array/record updates themselves are immutable (see tasks.js).
export const state = {
  tasks: [],
  filters: { ...DEFAULT_FILTERS },
  editingId: null,
  initialized: false,
};

export function setTasks(tasks) { state.tasks = tasks; }
export function setFilters(filters) { state.filters = { ...state.filters, ...filters }; }
export function resetFilters() { state.filters = { ...DEFAULT_FILTERS }; }
export function setEditing(id) { state.editingId = id; }
