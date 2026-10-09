# Use the official Playwright image as base (bundles matching browser binaries)
FROM mcr.microsoft.com/playwright:v1.64.0-noble

WORKDIR /app

# Install from the canonical automation suite's own package.json/lockfile,
# so dependencies are declared in exactly one place in this repo.
COPY Automation-Project/Playwright/package*.json ./
RUN npm install

# Copy the real suite (tests, pages, fixtures, test-data, config) plus this
# folder's standalone smoke-check script.
COPY Automation-Project/Playwright/ ./
COPY Docker/example.js ./

RUN npx playwright install --with-deps chromium

# Run the Playwright test suite headlessly
CMD ["npx", "playwright", "test", "--reporter=list"]
