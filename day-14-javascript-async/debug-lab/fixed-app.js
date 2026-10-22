import { API_URL } from "../js/api.js";

// A small, direct correction of the broken example, kept readable for comparison.
export async function loadFixedCountries(elements) {
  elements.output.setAttribute("aria-busy", "true");
  elements.status.textContent = "Loading countries…";
  elements.results.replaceChildren();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(API_URL, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const countries = await response.json();
    if (!Array.isArray(countries) || !countries.every((country) => country && typeof country.name === "string")) {
      throw new Error("Unexpected country data");
    }
    elements.inspection.textContent = `response.ok: ${response.ok}\ntypeof countries: ${typeof countries}\nArray.isArray(countries): ${Array.isArray(countries)}\ncountries.length: ${countries.length}`;
    countries.slice(0, 3).forEach((country) => {
      const item = document.createElement("li");
      item.textContent = country.name;
      elements.results.append(item);
    });
    elements.status.textContent = `Loaded ${countries.length} countries. Showing the first ${Math.min(3, countries.length)}.`;
  } catch (error) {
    const message = controller.signal.aborted ? "Request timed out" : error.message;
    elements.status.textContent = `Unable to load countries: ${message}. Run the fixed example to try again.`;
    elements.inspection.textContent = "The failure was caught; no country data was rendered.";
  } finally {
    clearTimeout(timeoutId);
    elements.output.setAttribute("aria-busy", "false");
  }
}
