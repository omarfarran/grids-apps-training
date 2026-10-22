import { loadBrokenCountries } from "./broken-app.js";
import { loadFixedCountries } from "./fixed-app.js";

const elements = {
  output: document.querySelector("#lab-output"),
  status: document.querySelector("#lab-status"),
  inspection: document.querySelector("#lab-inspection"),
  results: document.querySelector("#lab-results"),
};
const brokenButton = document.querySelector("#run-broken");
const fixedButton = document.querySelector("#run-fixed");

async function runExample(loader) {
  brokenButton.disabled = true;
  fixedButton.disabled = true;
  try {
    await loader(elements);
  } finally {
    brokenButton.disabled = false;
    fixedButton.disabled = false;
  }
}

brokenButton.addEventListener("click", () => runExample(loadBrokenCountries));
fixedButton.addEventListener("click", () => runExample(loadFixedCountries));
