# .github

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release: node](https://img.shields.io/badge/semantic--release-node-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Release](https://github.com/extrapreneur/.github/actions/workflows/release.yml/badge.svg)](https://github.com/extrapreneur/.github/actions/workflows/release.yml)

📖 A simple node js application that scrapes an element and a list of urls, then replaces sections in [profile/README.md](./profile/README.md) from a page on the internet.

## Prerequisites

- [gh-cli](https://github.com/cli/cli?tab=readme-ov-file#installation)
- [Node JS](https://nodejs.org/en/download/package-manager)

## Requirements

Personal access token is required to query GitHub API to get members from a GitHub organisation using [Octokit](https://github.com/octokit).  
`OWNER` environment variable is the repository owner's username or organisation name. For example, octocat or octoorg.

### How to create a personal access token

[Creating secrets for a repository](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets#creating-secrets-for-a-repository) using your own personal access token set as environment variable `TOKEN`

`github.repository_owner` return the owner of the repository, see [GitHub context: repository_owner](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#github-context)

#### Running app locally

```bash
export TOKEN=your-personal-access-token
export OWNER=your-github-organisation
```

#### Running in a GitHub action with a workflow

```bash
jobs:
  run-node-js-app:
    runs-on: ubuntu-latest
    steps:
      - name: Add PAT and run node js
        env:
          TOKEN: ${{ secrets.TOKEN }}
          OWNER: ${{ github.repository_owner }}
```

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

Srape page and generate a [README.md](profile/README.md) with scraped data

```bash
npm run start
```

### Run tests

Suites: Scraping Tests:

Tests:

- Verify index URL loads correctly
- Verify posts URL loads correctly
- Verify scraped data contains valid links

```bash
npm run tests
```

## Cleanup environment variables after use

```bash
unset TOKEN
unset OWNER
```
