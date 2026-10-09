// Test data factory for the registration flow. Keeps magic strings out of
// the specs and gives every test run a unique email so registration doesn't
// collide against the shared public demo site.

let counter = 0;

export function buildNewUser(overrides = {}) {
  counter += 1;
  const unique = `${Date.now()}${counter}`;

  return {
    name: "TestingName",
    email: `qa.portfolio.${unique}@example.com`,
    password: "Password123!",
    day: "14",
    month: "3",
    year: "1985",
    firstName: "Ben",
    lastName: "Tester",
    company: "QA Wolf",
    address: "WFH",
    country: "Canada",
    state: "BC",
    city: "Vancouver",
    zipcode: "V6E1L8",
    mobile: "1234567",
    ...overrides,
  };
}
