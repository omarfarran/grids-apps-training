import { formatPopulation, getFlagUrl } from "./utils.js";

// UI functions receive cached elements; they do not fetch or own application state.
export function setControlsDisabled(elements, disabled) {
  elements.search.disabled = disabled;
  elements.region.disabled = disabled;
  elements.reset.disabled = disabled;
}

function renderState(elements, state, title, description, icon) {
  elements.list.replaceChildren();
  elements.panel.hidden = false;
  elements.panel.dataset.state = state;
  elements.title.textContent = title;
  elements.description.textContent = description;
  elements.icon.textContent = icon;
  elements.retry.hidden = state !== "error";
  elements.section.setAttribute("aria-busy", String(state === "loading"));
  elements.status.textContent = `${title} ${description}`;
}

export function renderLoading(elements) {
  renderState(elements, "loading", "Loading countries…", "Fetching a fresh list of places to explore.", "◌");
  elements.count.textContent = "Waiting for data";
}

export function renderError(elements, message) {
  renderState(elements, "error", "Unable to load countries.", message, "!");
  elements.count.textContent = "Countries unavailable";
}

export function renderEmpty(elements, hasCountries) {
  renderState(elements, "empty", hasCountries ? "No countries match your search." : "No countries available.",
    hasCountries ? "Try a different name or reset the filters to explore every region." : "The service returned an empty list. Refresh the page to check again.", "↗");
}

export function renderRegionOptions(elements, countries) {
  const previousRegion = elements.region.value;
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All regions";
  const regions = [...new Set(countries.map((country) => country.region))].sort();
  const options = regions.map((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    return option;
  });
  elements.region.replaceChildren(allOption, ...options);
  elements.region.value = regions.includes(previousRegion) ? previousRegion : "all";
}

function createCountryCard(country) {
  const item = document.createElement("li");
  item.classList.add("country-card");
  item.dataset.code = country.code;
  const article = document.createElement("article");
  const flagStage = document.createElement("div");
  flagStage.classList.add("flag-stage");
  const flag = document.createElement("img");
  flag.classList.add("flag-image");
  flag.alt = `Flag of ${country.name}`;
  flag.width = 152;
  flag.height = 94;
  flag.loading = "lazy";
  flag.decoding = "async";
  flag.addEventListener("error", () => {
    const fallback = document.createElement("span");
    fallback.classList.add("flag-fallback");
    fallback.textContent = `Flag unavailable · ${country.code}`;
    flag.replaceWith(fallback);
  }, { once: true });
  flag.src = getFlagUrl(country.code);
  flagStage.append(flag);

  const content = document.createElement("div");
  content.classList.add("card-content");
  const region = document.createElement("span");
  region.classList.add("country-region");
  region.textContent = country.region;
  const name = document.createElement("h3");
  name.classList.add("country-name");
  name.textContent = country.name;
  const facts = document.createElement("dl");
  facts.classList.add("country-facts");
  const fields = [
    ["Capital", country.capital],
    ["Population", formatPopulation(country.population)],
    ["Languages", country.languages],
  ];
  fields.forEach(([label, value]) => {
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = value;
    facts.append(term, detail);
  });
  content.append(region, name, facts);
  article.append(flagStage, content);
  item.append(article);
  return item;
}

export function renderCountries(elements, countries, total) {
  elements.panel.hidden = true;
  elements.retry.hidden = true;
  elements.section.setAttribute("aria-busy", "false");
  elements.list.replaceChildren(...countries.map(createCountryCard));
  elements.count.textContent = `${countries.length} of ${total} countries & territories`;
  elements.status.textContent = `Showing ${countries.length} of ${total} countries and territories.`;
  if (countries.length === 0) renderEmpty(elements, total > 0);
}
