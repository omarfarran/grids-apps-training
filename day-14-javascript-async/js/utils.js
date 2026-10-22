// Pure helpers: no DOM access or network requests.
export function normalizeSearch(value) {
  return value.trim().toLowerCase();
}

export function normalizeCountry(country) {
  const polarRegions = ["Polar", "Antarctic", "Antarctic Ocean"];
  return {
    code: country.alpha2Code.toUpperCase(),
    name: country.name.trim(),
    capital: typeof country.capital === "string" && country.capital.trim()
      ? country.capital.trim() : "Not listed",
    region: polarRegions.includes(country.region) ? "Antarctic" : country.region.trim(),
    population: Number.isFinite(country.population) && country.population >= 0
      ? country.population : null,
    languages: Array.isArray(country.languages)
      ? country.languages.map((language) => language?.name).filter((name) => typeof name === "string" && name.trim()).join(", ") || "Not listed"
      : "Not listed",
  };
}

export function filterCountries(countries, search, region) {
  const query = normalizeSearch(search);
  return countries.filter((country) =>
    country.name.toLowerCase().includes(query) &&
    (region === "all" || country.region === region)
  );
}

const populationFormatter = new Intl.NumberFormat("en");
export function formatPopulation(population) {
  return population === null ? "Not listed" : populationFormatter.format(population);
}

export function getFlagUrl(code) {
  // The validated ISO code, rather than an arbitrary API URL, controls this URL.
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
}
