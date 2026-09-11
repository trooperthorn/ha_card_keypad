import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";

// VERSION is the single source of truth for the shipped version (CalVer
// YYYY.MM.DD.V); package.json stays at an inert 0.0.0 because npm requires
// SemVer there.
const version = readFileSync(new URL("./VERSION", import.meta.url), "utf8").trim();

export default defineConfig({
  define: {
    __CARD_VERSION__: JSON.stringify(version),
  },
  build: {
    target: "es2021",
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/keypad-card.ts",
      formats: ["es"],
      fileName: () => "keypad-card.js",
    },
    rolldownOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
  test: {
    dir: "tests",
    environment: "node",
  },
});
