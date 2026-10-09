import "dotenv/config";

// Single source of truth for the UI site under test. Overridable via a
// BASE_URL env var (see .env.example) so the same suite can point at a
// staging/local environment without touching code.
export const UI_BASE_URL = process.env.BASE_URL || "https://automationexercise.com";

// The API test's target is intentionally separate from the UI base URL:
// these are two different systems under test (see playwright.config.js).
export const API_BASE_URL =
  process.env.API_BASE_URL || "https://restful-booker.herokuapp.com/booking";
