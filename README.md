# .github

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release: node](https://img.shields.io/badge/semantic--release-node-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Release](https://github.com/extrapreneur/.github/actions/workflows/release.yml/badge.svg)](https://github.com/extrapreneur/.github/actions/workflows/release.yml)

A simple node js application that scrapes an element and a list of urls, then replaces sections in [profile/README.md](./profile/README.md).

<center>
  <img width="640" src="docs/images/screenshot.webp" alt="Screenshot">
</center>

## Prerequisites

- [gh-cli](https://github.com/cli/cli?tab=readme-ov-file#installation)
- [Node JS](https://nodejs.org/en/download/package-manager)

## Required

Personal access token is required to get members from a GitHub organisation using [Octokit](https://github.com/octokit)

### Example running app locally

```bash
export TOKEN=your-personal-access-token
```

### Example GitHub action

[Creating secrets for a repository](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets#creating-secrets-for-a-repository) using your own `TOKEN`

1. Add to GitHub workflow

   ```bash
   jobs:
     run-node-js-app:
       runs-on: ubuntu-latest
       steps:
         - name: Add PAT and run node js
           env:
             TOKEN: ${{ secrets.TOKEN }}
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

1. Start application

```bash
npm run start
```
