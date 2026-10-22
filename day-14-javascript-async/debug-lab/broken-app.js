import { API_URL } from "../js/api.js";

// INTENTIONALLY BROKEN. This file is loaded only by the separate debugging lab.
export async function loadBrokenCountries(elements) {
  elements.output.setAttribute("aria-busy", "true");
  elements.status.textContent = "Loading countries…";
  elements.results.replaceChildren();
  try {
    const response = await fetch(API_URL);
    // BUG 1: HTTP error responses are not rejected here.
    // BUG 2: response.json() returns a Promise, not the parsed array.
    const countries = response.json();
    elements.inspection.textContent = `response.ok: ${response.ok}\ntypeof countries: ${typeof countries}\ncountries instanceof Promise: ${countries instanceof Promise}`;
    countries.forEach((country) => {
      const item = document.createElement("li");
      item.textContent = country.name;
      elements.results.append(item);
    });
    elements.status.textContent = "Countries loaded.";
  } catch (error) {
    console.error(error); // BUG 3: console-only handling gives the user no recovery feedback.
  }
  // BUG 4: aria-busy/loading is never cleared on success or error.
}
