# Playwright Docker Demo

This folder contains a Docker setup that runs the real
[Automation-Project/Playwright](../Automation-Project/Playwright/) suite headlessly
inside a container, using Microsoft's official Playwright image (which bundles
matching browser binaries) so the suite runs identically regardless of the host
machine.

The image installs and runs that suite directly rather than keeping a second copy
of it in this folder. Two copies drifting apart is exactly the kind of duplication
this portfolio has already run into once elsewhere; not repeating it here.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.

## Setup

### 1. Build the Docker Image

Build from the **repository root** (not this folder), since the image needs both
`Automation-Project/Playwright/` and this folder's Dockerfile:

```bash
docker build -f Docker/Dockerfile -t qa-portfolio-docker .
```

### 2. Run the Docker Container

```bash
docker run --rm qa-portfolio-docker
```

This runs `npx playwright test` inside the container against the same scenarios
described in [Automation Demo](../Automation-Project/Automation-Demo.md): account
registration, cart/checkout, product search, UI scroll behavior, and API request
validation. It prints a list-style report of pass/fail results to the console.

To point it at a different environment, pass env vars at run time (see
`Automation-Project/Playwright/.env.example` for what's available):

```bash
docker run --rm -e BASE_URL=https://staging.example.com qa-portfolio-docker
```

## Optional: standalone screenshot script

`example.js` is a small standalone script (not run by the container's default
command) that launches Chromium, navigates to a URL, and saves a screenshot. Useful
as a quick sanity check that the Playwright/Chromium install works:

```bash
docker run --rm qa-portfolio-docker node example.js
```
