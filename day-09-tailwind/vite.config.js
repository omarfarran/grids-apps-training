import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// Explicit multi-page inputs: every view is emitted by the production build.
const pages = [
  "index",
  "dashboard",
  "customers",
  "products",
  "analytics",
  "reports",
  "settings",
  "profile",
  "auth",
];

export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
  build: {
    rolldownOptions: {
      input: Object.fromEntries(
        pages.map((page) => [
          page,
          fileURLToPath(new URL(`./${page}.html`, import.meta.url)),
        ]),
      ),
    },
  },
});
