import { validateStoredTasks } from "./validation.js";

export const STORAGE_KEY = "day15TaskManager";

export function loadTasks(storage) {
  let raw;
  try {
    // Access the browser storage getter inside try: privacy settings can throw here.
    raw = (storage ?? window.localStorage).getItem(STORAGE_KEY);
  } catch (error) {
    return { tasks: [], warning: "Browser storage could not be read. A new list is shown. Changes will try to save, but may be lost after refresh." };
  }
  if (raw === null || raw.trim() === "") return { tasks: [], warning: "" };
  try {
    return { tasks: validateStoredTasks(JSON.parse(raw)), warning: "" };
  } catch (error) {
    return { tasks: [], warning: "Saved tasks are invalid. A new list is shown. Your next successful change will replace the saved data." };
  }
}

export function saveTasks(tasks, storage) {
  try {
    const validTasks = validateStoredTasks(tasks);
    (storage ?? window.localStorage).setItem(STORAGE_KEY, JSON.stringify(validTasks));
    return { saved: true, warning: "" };
  } catch (error) {
    return { saved: false, warning: "Tasks could not be saved. They are available in this tab, but changes may be lost after refresh. Check browser storage permissions or available space." };
  }
}
