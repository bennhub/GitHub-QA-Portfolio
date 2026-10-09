# PR Review Reference

The checklist the PR Review Agent applies to an automation test pull request before
it merges. Pulls directly from
[automation_standards.md](./automation_standards.md) rather than inventing a separate
set of rules.

## Checklist

- [ ] Real assertions at every meaningful step (`expect(...).toBeVisible()` /
  `.toHaveText()` / etc.) — not just "it didn't throw."
- [ ] No `page.waitForTimeout()`. Timing issues are fixed with a real wait condition,
  not papered over.
- [ ] Selectors prefer `[data-qa="..."]` / `[data-testid="..."]` over text selectors,
  per [ui_flows_reference.md](./ui_flows_reference.md).
- [ ] Setup shared with an existing spec is extracted to `tests/helpers/`, not
  copy-pasted (this suite has already paid for that mistake once).
- [ ] One behavior per test; the test name says what it actually covers.
- [ ] `npm test` actually runs the new spec — confirm it isn't silently excluded.
- [ ] If this is a bug-driven test, the PR links the originating bug report
  (see [QA-Practices.md](../../../QA-Practices/QA-Practices.md)) rather than
  describing the bug only in prose.

## Review Outcome

A review should end with one of: **approve**, **approve with nits** (name them), or
**request changes** (name exactly which checklist item failed and why) — never a
vague "looks good, some comments."
