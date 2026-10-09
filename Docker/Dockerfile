# Use the official Playwright image as base (bundles matching browser binaries)
FROM mcr.microsoft.com/playwright:v1.64.0-noble

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app (test suite + config)
COPY . .

# Run the Playwright test suite headlessly
CMD ["npx", "playwright", "test", "--reporter=list"]
