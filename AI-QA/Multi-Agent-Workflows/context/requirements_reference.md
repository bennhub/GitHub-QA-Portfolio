# Requirements Reference

Example of how requirements reach this team: a design doc summary, a Jira-style
ticket, and an engineering breakdown. The Requirements Agent treats this format as the
template for translating a feature ask into testable acceptance criteria.

## Sample Ticket: JIRA-142, Add promo code field at checkout

**Design doc summary:** Checkout should accept an optional promo code. A valid code
applies a discount to the order total before payment; an invalid code shows an inline
error and does not block checkout without one.

**Acceptance Criteria (Gherkin-style):**

```gherkin
Scenario: Apply a valid promo code
  Given a user has products in their cart and is on the checkout page
  When they enter a valid promo code and click "Apply"
  Then the order total updates to reflect the discount
  And the applied code is shown next to the total

Scenario: Apply an invalid promo code
  Given a user is on the checkout page
  When they enter an invalid promo code and click "Apply"
  Then an inline error message appears
  And the order total is unchanged

Scenario: Checkout without a promo code
  Given a user is on the checkout page
  When they proceed to checkout without entering a code
  Then checkout completes normally at full price
```

**Engineering breakdown notes:**
- New `POST /cart/promo` endpoint validates a code against an active-promotions table
  and returns the discount amount or a 422 with an error reason.
- Frontend: promo field + "Apply" button on the checkout page; discount line item
  shown once applied.
- No change to existing checkout flow when no code is entered (covers the "no
  regression" case).

## Conventions

- Every ticket's acceptance criteria should be written so each scenario maps cleanly
  to one automated test case. If a scenario can't be stated as a single Given/When/
  Then, it's probably two tickets.
- Engineering breakdown notes call out new API surface and UI changes separately,
  since those typically become separate automation/dev-integration concerns.
