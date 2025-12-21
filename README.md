# .github

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release: node](https://img.shields.io/badge/semantic--release-node-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Release](https://github.com/extrapreneur/.github/actions/workflows/release.yml/badge.svg)](https://github.com/extrapreneur/.github/actions/workflows/release.yml)

📖 A simple node js application that scrapes an element and a list of urls, then replaces sections in [profile/README.md](./profile/README.md) from a page on the internet.

> **Note:** As of December 2025, scraping functionality is disabled due to changes on https://extrapreneur.se. Scraping will be restored if/when the homepage provides usable data again. The public profile/README.md does not reflect this change.

## Prerequisites

- [gh-cli](https://github.com/cli/cli?tab=readme-ov-file#installation)
- [Node JS](https://nodejs.org/en/download/package-manager)

## Install

1. Clone repository

   ```bash
   gh repo clone extrapreneur/.github
   ```

1. Navigate to directory

   ```bash
   cd .github/
   ```

1. Install dependencies

   ```bash
   npm install
   ```

## Usage

### Start application

Scrape page and generate a [README.md](profile/README.md) with scraped data

```bash
npm run start
```

### Run tests

Suites: Scraping Tests

Tests:

- Verify index URL loads correctly
- Verify posts URL loads correctly
- Verify scraped data contains valid links

```bash
npm run test
```
