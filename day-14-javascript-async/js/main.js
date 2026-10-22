import { fetchCountries } from "./api.js";
import { filterCountries } from "./utils.js";
import { renderLoading, renderCountries, renderError, renderRegionOptions, setControlsDisabled } from "./ui.js";

// Application coordination: references, state, events, and the async lifecycle.
const elements = {
  form: document.querySelector("#explorer-controls"),
  search: document.querySelector("#country-search"),
  region: document.querySelector("#region-filter"),
  reset: document.querySelector("#reset-filters"),
  section: document.querySelector("#results-section"),
  list: document.querySelector("#country-list"),
  panel: document.querySelector("#state-panel"),
  title: document.querySelector("#state-title"),
  description: document.querySelector("#state-description"),
  icon: document.querySelector("#state-icon"),
  retry: document.querySelector("#retry-button"),
  count: document.querySelector("#result-count"),
  status: document.querySelector("#live-status"),
};

const state = { countries: [], loading: false, error: null };

function renderCurrentView() {
  const visibleCountries = filterCountries(state.countries, elements.search.value, elements.region.value);
  renderCountries(elements, visibleCountries, state.countries.length);
}

async function loadCountries(restoreFocus = false) {
  if (state.loading) return; // Prevent overlapping retry requests.
  state.loading = true;
  state.error = null;
  setControlsDisabled(elements, true);
  elements.retry.disabled = true;
  renderLoading(elements);

  try {
    state.countries = await fetchCountries();
    renderRegionOptions(elements, state.countries);
    renderCurrentView();
  } catch (error) {
    state.countries = [];
    state.error = error.message || "Check your connection and try again.";
    renderError(elements, state.error);
  } finally {
    state.loading = false;
    elements.retry.disabled = false;
    setControlsDisabled(elements, state.error !== null);
    // Only a user-initiated retry changes focus; initial loading never steals it.
    if (restoreFocus) (state.error ? elements.retry : elements.search).focus();
  }
}

elements.form.addEventListener("submit", (event) => event.preventDefault());
elements.search.addEventListener("input", renderCurrentView);
elements.region.addEventListener("change", renderCurrentView);
elements.reset.addEventListener("click", () => {
  elements.search.value = "";
  elements.region.value = "all";
  renderCurrentView();
  elements.search.focus();
});
elements.retry.addEventListener("click", () => loadCountries(true));

loadCountries();
