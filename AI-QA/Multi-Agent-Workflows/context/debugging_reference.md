# Debugging Reference

What the Debugging Agent checks when a test fails, grounded in the real CI setup
already in this repo.

## Triage Order

1. **Did it fail on retry too?** `playwright.config.js` sets `trace: 'on-first-retry'`
   and CI retries failed tests (`retries: process.env.CI ? 2 : 0`). A test that fails
   once but passes on retry is flaky, not broken — treat it as a stability problem in
   the test (selector timing, an unguarded animation, a race condition), not a product
   bug.
2. **Pull the uploaded report, don't guess.** `.github/workflows/ci.yml` uploads the
   HTML report (`playwright-report/`) as a build artifact on every run via
   `actions/upload-artifact`, `if: always()`. Open the trace before changing any
   assertion — a trace shows exactly what the page looked like at the moment of
   failure.
3. **Check the selector against known-brittle patterns.** Per
   [ui_flows_reference.md](./ui_flows_reference.md), text selectors (`text=...`,
   `:text("...")`) are the known-fragile category in this suite — a failure on one of
   those is more likely a copy change than a real regression than a failure on a
   `[data-qa="..."]` selector.
4. **Separate "test is wrong" from "product is wrong."** If the assertion itself
   doesn't match current, intended product behavior, the fix is updating the test
   (and saying so in the PR). If the assertion is correct and the product violated it,
   that's a real bug report, not a test fix.

## Output

A debugging pass should end with one of: **flaky — stabilize** (name the fix),
**test is wrong — update it** (name the correct expected behavior), or **real
regression — file a bug** (name what broke), never just "investigating."
