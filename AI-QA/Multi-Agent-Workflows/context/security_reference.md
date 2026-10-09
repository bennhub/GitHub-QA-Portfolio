# Security Reference

What the Security Agent checks, grounded in OWASP Top 10 categories and real findings
from this repo, not hypothetical ones.

## Secrets Management (OWASP A02:2021, Cryptographic Failures)

A real Gemini API key was once hardcoded directly in
[AI-QA/Test-Case-Generator/main.js](../../Test-Case-Generator/main.js), confirmed
recoverable from this repo's git history even after a later commit replaced it (a
follow-up commit doesn't erase history; only a rewrite does). The key was rotated and
the practice fixed. The current, correct pattern to point to:

- `Test-Case-Generator/config.js` is gitignored; the key is imported from it, never
  committed.
- `Automation-Project/Playwright/config/env.js` reads `BASE_URL`/`API_BASE_URL` from
  `process.env` (via `.env`, gitignored, with `.env.example` documenting the vars),
  and CI sets them as workflow-level `env:` instead of a committed secret.

A new feature that needs a credential should follow one of these two patterns, never
a literal string in a source file.

## Injection / XSS (OWASP A03:2021)

`Test-Case-Generator/main.js` renders both user input and AI-generated text through
`markdown-it` directly into `innerHTML` (`chatArea.innerHTML += userDiv(md.render(...))`).
This is currently safe only because `markdown-it`'s default `html` option is `false`
(raw HTML in the input is escaped, not executed). This is a real, specific thing to
re-verify on any change here:

- If `MarkdownIt` is ever constructed with `{ html: true }`, both user input and
  AI output become a live stored/reflected XSS vector, since neither path currently
  sanitizes with something like DOMPurify.
- Any new place that writes AI-generated or user-supplied content into `innerHTML`
  (rather than `textContent`) needs the same scrutiny, not an assumption that
  "it's just markdown so it's fine."

## Dependency Hygiene (OWASP A06:2021, Vulnerable and Outdated Components)

`Test-Case-Generator` has a known, currently-accepted gap: 9 npm vulnerabilities
remain after `npm audit fix`, because the rest require a Tailwind v4 breaking bump
that hasn't been scheduled. That's a documented, deliberate deferral, not an
oversight; flag it as "known, tracked" rather than re-discovering it as new. Any
newly added dependency should still be checked with `npm audit` before merging.

## CI/CD

This repo's CI currently has no actual secrets to leak (`BASE_URL`/`API_BASE_URL`
are public values, set as plaintext workflow `env:` on purpose). If a future CI step
ever needs a real credential (an API key, a deploy token), it belongs in GitHub
Actions' encrypted repository/environment secrets, never as plaintext in the
workflow YAML, even temporarily "to test it."

## Recommended Scanning Tools

Don't rely on manual review alone; these are the concrete tools to actually run:

- **[TruffleHog](https://github.com/trufflesecurity/trufflehog)**: scans git
  history (not just the current working tree) for secrets, exactly the class of
  issue the Gemini key incident above was. Run it against the full history
  (`trufflehog git file://. --since-commit <first-commit>`) periodically, and
  ideally as a pre-merge CI check so a secret never lands on `main` in the first
  place, rather than being found and rotated after the fact.
- **[Semgrep](https://semgrep.dev/)**: static analysis across the JS codebase
  (`Test-Case-Generator/`, `Automation-Project/Playwright/`). Its default
  `p/javascript` and `p/owasp-top-ten` rule sets would catch exactly the pattern
  above (untrusted content flowing into `innerHTML`) if it ever regresses, plus
  issues neither this doc nor a human reviewer thought to check for.
- **`npm audit`**: already in use (see Dependency Hygiene above); keep it as part
  of the normal review flow, not a one-off.

A security pass that only reads the code and never runs any of these is a weaker
pass than one that does, even if nothing is ultimately found.

## Output

A security pass should end with one of: **no issue found** (say what was checked,
including which of the tools above were run), **fix required** (name the exact
OWASP category and the concrete change), or **accepted risk, already tracked**
(point to where it's documented, e.g. the npm audit gap above). Never a vague
"looks fine" with nothing checked.
