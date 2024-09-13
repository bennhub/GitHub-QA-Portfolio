# Use the official Playwright image as base
FROM mcr.microsoft.com/playwright:v1.47.0-jammy


# Install ImageMagick
RUN apt-get update && apt-get install -y imagemagick

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Run the example script
CMD ["node", "example.js"]
