# Dev Repo Reference

What the Dev Integration Agent knows about the backend/API surface, unit-test-level
contract checks, and the CI/CD pipeline, grounded in the real artifacts already in
this repo.

## API Under Test

Example: the booking API used in
[post-api-request.spec.js](../../../Automation-Project/Playwright/tests/post-api-request.spec.js).

- `POST /booking` accepts `firstname`, `lastname`, `totalprice`, `depositpaid`,
  `bookingdates: { checkin, checkout }`, `additionalneeds`.
- Response: `{ bookingid, booking: { ...same fields... } }`.
- Contract checks at this level assert on **status code** (`response.status()`) and
  **nested JSON fields** (`booking.bookingdates.checkin`, etc.), not just "did it
  return 200."

## Unit Test / API Control Flow Conventions

- A contract test should fail if a required field is dropped from the response, not
  just if the whole request fails. Assert on the fields that matter, individually.
- API-level tests set `baseURL` once (see `playwright.config.js`) and call relative
  paths (`request.post("/booking", ...)`), the same pattern UI tests should follow
  for their own base URL.

## CI/CD Pipeline

Real pipeline: [.github/workflows/ci.yml](../../../.github/workflows/ci.yml).

- Triggers on push/PR to `main`.
- Node 22, with `cache: npm` keyed on the lockfile.
- `npm ci` (not `npm install`) for reproducible installs from the committed lockfile.
- `npx playwright install --with-deps chromium`: only the browser(s) actually used by
  `playwright.config.js`'s active projects, not the full browser matrix.
- `npx playwright test`: the same command a human runs locally.
- HTML report uploaded as a build artifact on every run (`if: always()`), so a failure
  can be inspected without re-running locally.

## Conventions

- A CI pipeline is only trustworthy if it runs the exact command a developer runs
  locally, not a bespoke "CI-only" test subset.
- Dependency installs in CI always come from the lockfile (`npm ci`), never a fresh
  `npm install` that could silently drift.
