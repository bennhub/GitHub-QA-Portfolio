# Debugging Reference

What the Debugging Agent checks when a test fails, grounded in the real CI setup
already in this repo.

## Triage Order

1. **Did it fail on retry too?** `playwright.config.js` sets `trace: 'on-first-retry'`
   and CI retries failed tests (`retries: process.env.CI ? 2 : 0`). A test that fails
   once but passes on retry is flaky, not broken. Treat it as a stability problem in
   the test (selector timing, an unguarded animation, a race condition), not a product
   bug.
2. **Pull the uploaded report, don't guess.** `.github/workflows/ci.yml` uploads the
   HTML report (`playwright-report/`) as a build artifact on every run via
   `actions/upload-artifact`, `if: always()`. Open the trace before changing any
   assertion. A trace shows exactly what the page looked like at the moment of
   failure.
3. **Check the selector against known-brittle patterns.** Per
   [ui_flows_reference.md](./ui_flows_reference.md), text selectors (`text=...`,
   `:text("...")`) are the known-fragile category in this suite. A failure on one of
   those is more likely a copy change than a real regression than a failure on a
   `[data-qa="..."]` selector.
4. **Separate "test is wrong" from "product is wrong."** If the assertion itself
   doesn't match current, intended product behavior, the fix is updating the test
   (and saying so in the PR). If the assertion is correct and the product violated it,
   that's a real bug report, not a test fix.

## Known External Gotcha

automationexercise.com (the app under test) sits behind bot-protection that can
return a "One moment, please..." interstitial to any client, including plain
`curl`, not just headless browsers. If `expect(page).toHaveTitle` reports that
string instead of `/Automation Exercise/`, that's the site blocking the runner's
network path, not a regression. Confirm with a plain `curl` before touching any
test code. See
[Automation-Project/Playwright/agent/automation-agent.md](../../../Automation-Project/Playwright/agent/automation-agent.md)
for the full note; this was found for real while building this suite, not
hypothesized.

## Output

A debugging pass should end with one of: **flaky, stabilize it** (name the fix),
**test is wrong, update it** (name the correct expected behavior), or **real
regression, file a bug** (name what broke), never just "investigating."
