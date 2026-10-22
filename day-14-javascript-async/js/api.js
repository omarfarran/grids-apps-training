import { normalizeCountry } from "./utils.js";

// REST Countries v3.1 returned a deprecation payload during verification.
// Countries.dev is a keyless, CORS-enabled alternative; request only needed fields.
export const API_URL = "https://countries.dev/countries?fields=name,alpha2Code,capital,region,population,languages";

export async function fetchCountries() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(API_URL, { signal: controller.signal, cache: "no-store" });
    // fetch rejects for network failures, but HTTP errors still resolve to a Response.
    if (!response.ok) {
      throw new Error(`The country service returned HTTP ${response.status}. Please try again.`);
    }
    const data = await response.json();
    const codes = new Set();
    const valid = Array.isArray(data) && data.every((country) => {
      if (!country || typeof country.name !== "string" || !country.name.trim() ||
          typeof country.region !== "string" || !country.region.trim() ||
          typeof country.alpha2Code !== "string" || !/^[a-z]{2}$/i.test(country.alpha2Code) ||
          codes.has(country.alpha2Code.toUpperCase())) return false;
      codes.add(country.alpha2Code.toUpperCase());
      return true;
    });
    if (!valid) throw new Error("The country service sent unexpected data. Please try again.");
    return data.map(normalizeCountry).sort((a, b) => a.name.localeCompare(b.name, "en"));
  } catch (error) {
    if (controller.signal.aborted) throw new Error("The request took too long. Please try again.");
    if (error instanceof SyntaxError) throw new Error("The country service sent invalid JSON. Please try again.");
    if (error instanceof TypeError) throw new Error("Check your connection and try again. The country service may be unavailable.");
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
