# Playwright Docker Demo

This folder contains a Docker setup that runs the QA portfolio's Playwright test suite
headlessly inside a container, using Microsoft's official Playwright image (which
bundles matching browser binaries) so the suite runs identically regardless of the
host machine.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.

## Setup

### 1. Build the Docker Image

```bash
docker build -t qa-portfolio-docker .
```

### 2. Run the Docker Container

```bash
docker run --rm qa-portfolio-docker
```

This runs `npx playwright test` inside the container against the same scenarios
described in [Automation Demo](../Automation-Project/Automation-Demo.md) — account
registration, cart/checkout, product search, UI scroll behavior, and API request
validation — and prints a list-style report of pass/fail results to the console.

## Optional: standalone screenshot script

`example.js` is a small standalone script (not run by the container's default command)
that launches Chromium, navigates to a URL, and saves a screenshot — useful as a quick
sanity check that the Playwright/Chromium install works:

```bash
docker run --rm -v "$(pwd)":/app qa-portfolio-docker node example.js
```
