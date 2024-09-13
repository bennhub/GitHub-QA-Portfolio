# Playwright Docker Example

This repository contains a Docker setup for running Playwright tests. Follow the instructions below to build the Docker image and run your Playwright script.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.

## Setup

### 1. Build the Docker Image

To build the Docker image for running Playwright, use the following command. This command reads the `Dockerfile` and creates an image named `playwright-example`.

```bash
docker build -t playwright-example .
```

## 2. Run the Docker Container
To start a container from the playwright-example image and run the Playwright script, use the following command:

```bash
docker run -it --rm -v "$(pwd)":/app playwright-example
```

## Playwright Script
The Docker container runs example.js, which is a Playwright script that performs the following actions:

 - Launches a Chromium browser.
 - Navigates to a specified URL (https://www.b-n.me).
 - Takes a screenshot and saves it as example.png.
 - Closes the browser.

