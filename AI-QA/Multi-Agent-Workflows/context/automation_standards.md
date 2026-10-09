# Automation Standards

The strict guidelines the Automation Engineer Agent enforces when writing or
reviewing test code, distilled from the real conventions used in
[Automation-Project/Playwright](../../../Automation-Project/Playwright/).

## Structure

- Test files live in `tests/`, named `<behavior>.spec.js` (kebab-case, no typos —
  this repo has already paid for that mistake once).
- Shared setup used by more than one spec (e.g. account registration) belongs in
  `tests/helpers/`, not copy-pasted across files.
- One behavior per test. A test that both registers an account *and* checks out
  should say so in its name, not hide a second scenario inside a differently-named
  test.

## Assertions

- Every meaningful step ends in a real `expect(...)` assertion — `toBeVisible()`,
  `toHaveText()`, `toContainText()`, or an explicit value check. No test should pass
  purely because nothing threw.
- Never use `page.waitForTimeout()` to paper over timing issues. Rely on Playwright's
  built-in auto-waiting, or wait on a specific condition (`toBeVisible()`, a network
  response, etc.) instead.
- A global test timeout should stay at Playwright's default (30s) unless there's a
  documented reason for a longer one — a long global timeout usually means a flaky
  step is being hidden rather than fixed.

## Selectors

- Prefer `[data-qa="..."]` / `[data-testid="..."]` / id-based selectors — see
  `ui_flows_reference.md` for the ones already documented for this app.
- Text selectors are a fallback, not a default, since they break on copy changes.

## Config

- The site under test's base URL lives in one place (`tests/helpers/config.js`), not
  hardcoded per file.
- `npm test` must actually run the suite (`playwright test`) — never leave the
  default npm-init stub in place.

## CI

- Every pushed suite needs to actually run in CI against the same command a human
  would run locally (`npm test`), not a hand-rolled subset.
