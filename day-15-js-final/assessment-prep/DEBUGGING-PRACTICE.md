# Debugging Practice

Unofficial self-study practice. These snippets are intentionally broken and are not imported by the application. No fixes or official assessment results are supplied.

For every exercise: reproduce it in a separate scratch page, read the exact error or wrong output, inspect values/types, identify the root cause, make the smallest responsible correction, and retest both success and failure/boundary cases.

## 1. A Total Turns into Text

```js
function totalPrices(prices) {
  let total = 0;
  for (const price of prices) total += price;
  return total;
}
console.log(totalPrices(["10", "5", "2"]));
```

**Symptom:** The result is a concatenated string rather than a numeric sum.  
**Expected:** A numeric total of 17, with a deliberate policy for invalid entries.

## 2. The Form Clears the Page

Assume the page has a normal form and a text input inside it.

```js
document.querySelector("form").addEventListener("submit", () => {
  const title = document.querySelector("input").value;
  if (title.length > 0) console.log("Added:", title);
});
```

**Symptom:** Submitting navigates/reloads; whitespace-only text is accepted.  
**Expected:** Stay on the page, reject a blank trimmed title, and show visible feedback.

## 3. The Original Order Changes

```js
const tasks = [{ title: "B" }, { title: "A" }];
function sortedTasks(items) {
  return items.sort((a, b) => a.title.localeCompare(b.title));
}
const sorted = sortedTasks(tasks);
console.log(tasks[0].title);
```

**Symptom:** The original `tasks` array is now ordered differently.  
**Expected:** Return a sorted result while preserving the original order.

## 4. Async Data Is Not an Array

Assume `endpoint` is a valid API URL whose successful body is an array.

```js
async function loadItems(endpoint) {
  try {
    const response = await fetch(endpoint);
    const items = response.json();
    items.forEach((item) => console.log(item.name));
  } catch (error) {
    console.log(error.message);
  }
}
```

**Symptom:** `items.forEach is not a function`; HTTP errors are not explicitly checked, and failures are console-only.  
**Expected:** Use parsed array data, check HTTP status, and display understandable loading/success/error states.

## 5. New Buttons Do Nothing

Assume new `.delete-task` buttons are later appended to the list.

```js
document.querySelectorAll(".delete-task").forEach((button) => {
  button.addEventListener("click", () => button.closest("li").remove());
});
```

**Symptom:** Initial buttons work, but newly rendered ones have no handler; removing a row does not update saved task data.  
**Expected:** Dynamic actions affect the correct stable-ID record, persist the change, and render a consistent UI.
