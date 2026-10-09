import js from "@eslint/js";
import playwright from "eslint-plugin-playwright";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    plugins: { playwright },
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // This suite relies on Playwright's built-in auto-waiting; an
      // explicit waitForTimeout is exactly the anti-pattern
      // automation_standards.md (see ../AI-QA/Multi-Agent-Workflows/)
      // calls out.
      "playwright/no-wait-for-timeout": "error",
      "playwright/no-conditional-in-test": "warn",
      // Lets a fixture be requested purely for its setup side effect (e.g.
      // registeredUser) by aliasing it to an underscore-prefixed name
      // instead of silencing the rule entirely.
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
  },
  {
    ignores: ["node_modules/**", "playwright-report/**", "test-results/**"],
  },
];
