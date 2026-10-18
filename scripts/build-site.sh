#!/bin/sh
# Builds the deployable site into _site/: compiles Tailwind, then copies the repo minus
# build tooling and repo-only files. Used by .github/workflows/static.yml and Vercel (vercel.json).
set -e
cd "$(dirname "$0")/.."
npm run build
rm -rf _site && mkdir _site
tar -cf - \
  --exclude=./.git --exclude=./.github --exclude=./.gitignore --exclude=./.vercel \
  --exclude=./node_modules --exclude=./_site --exclude=./src --exclude=./scripts \
  --exclude=./package.json --exclude=./package-lock.json --exclude=./tailwind.config.js \
  --exclude=./vercel.json --exclude=./CLAUDE.md \
  . | tar -xf - -C _site
test -s _site/assets/styles.css
