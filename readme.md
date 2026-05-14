# Github mergedby

Did you know github doesn't provide a search filter to see who merged a PR?

Are you missing out on sweet sweet maintainer street cred by not knowing how many PRs you've merged on a particular repo?

Then you've found the right obscure, single-source-file repo to solve all your problems!

# Setup

Rename `.env.example` to `.env` and fill it out with the name and owner of the repository you wish to scrape plus a personal access token with at least read access to the repository (no additional access required if the repository is public) - see https://github.com/settings/personal-access-tokens/new

Then run

```
npm install
npx ts-node requester.ts
```

And get a nice json printout of how many PRs each maintainer has merged.

# FAQs

## Why aren't you using bun?

https://github.com/oven-sh/bun/pull/30412

## I want this script to do something else

Nope, it just does this. I wrote it because I was annoyed at github.

## What colour is your cat?

Grey and white.
