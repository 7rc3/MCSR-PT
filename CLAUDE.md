# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static website for the Portuguese Minecraft Speedrun (MCSR Ranked) community (https://www.mcsrpt.org). No tests. The only build step is Tailwind: `npm ci && npm run build` writes `assets/styles.css` (gitignored) from `tailwind.config.js` + `src/tailwind.css`. `npm run site` (`scripts/build-site.sh`) builds the CSS and copies the deployable files into `_site/`, minus tooling (node_modules, src/, scripts/, package*.json, tailwind.config.js, vercel.json); new tooling files must be added to its excludes. Every push to `main` runs it in `.github/workflows/static.yml` and deploys `_site` to GitHub Pages; Vercel previews run the same script via `vercel.json`.

To preview locally, run `npm run build` (or `npm run watch`), then serve the directory (e.g. `python -m http.server`) and open the page in a browser; all data is fetched client-side, so an internet connection is required.

User-facing text is in Portuguese (pt-PT); code comments are in English. Keep that split.

## Architecture

Each page is a self-contained HTML file with its own inline `<script>` — there is no shared JS module. Helpers like `fmt()` (ms → `mm:ss`) and `esc()` (HTML escaping) are duplicated per page; if you change one, check the others.

- `index.html`, `leaderboard.html`, `torneios.html`, `tvmcsrpt.html` (plus `jogador.html`, `404.html`) share the same look: Tailwind compiled to `assets/styles.css` (theme in `tailwind.config.js`: Inter / JetBrains Mono fonts, `pt.red` / `pt.green` flag colors), Bootstrap Icons (`bi bi-*`), and a duplicated header/nav. Layout or nav changes must be applied to each page by hand. Tailwind scans `*.html` and `assets/*.js` as raw text (including JS template strings), so always write class names whole — never build them like `'text-' + color`.
- SEO: each public page has its own `<title>`, meta description, canonical, Open Graph tags and favicons in `<head>`; `index.html` also has JSON-LD (Organization + WebSite). `robots.txt` and `sitemap.xml` are at the root; add new indexable pages to the sitemap. Noindex pages: 404, splits overlay, `tvmcsrpt-test.html`, `discord/`. Header/footer logos use `assets/logo-64.png`; the full-size logo is the og:image. Keep exactly one `<h1>` per page.
- `mcsr-splits-overlay.html` is a standalone OBS browser-source overlay with its own plain-CSS pixel-art styling (no Tailwind) and English UI. It is not linked from the nav.

### Data sources

- **MCSR Ranked API** (`https://api.mcsrranked.com`), responses shaped `{ status: 'success', data: ... }`. Every endpoint sends `cache-control: max-age=14400`, so anything that polls must `fetch(..., { cache: 'no-store' })` or the browser keeps returning the first response for 4 hours:
  - `/leaderboard?country=pt` → `data.season`, `data.users` (index.html top players, leaderboard.html).
  - `/users/{nickname}` → per-player season stats at `data.statistics.season.{wins,loses,playedMatches,bestTime}.ranked`. leaderboard.html fetches these in batches of 5 with a 100 ms pause, re-rendering progressively.
  - `/live` (tvmcsrpt.html) → `data.liveMatches[]`, each with `currentTime`, `players[]` (including `country`) and `data[uuid].{liveUrl, timeline}`. `liveUrl` is the player's Twitch URL, set only while they stream with stream sharing enabled; `timeline` is only their latest split.
  - `/users/{ign}/matches?count=20` and `/matches/{id}` (splits overlay). Split timeline keys are matched against several candidate advancement names in `SPLITS_DEF`.
- **Avatars**: `mc-heads.net` with `minotar.net` as `onerror` fallback.

### leaderboard.html

Rank tiers come from the `RANKS` table (Elo thresholds + colors). The row grid classes live in `ROW_COLS` and must stay in sync with the header/skeleton markup. Sorting: players without a best time always sink to the bottom regardless of direction; "Melhor tempo" defaults to ascending.

### jogador.html (player profile)

Reached via `jogador.html?u=<nickname>`; it's one template, so it's not in the sitemap and has no static canonical — the script adds a per-player canonical, or `noindex` when no/unknown player; every player name on the leaderboard, index and TV pages links here (not in the nav). Fetches `/users/{u}`, `/users/{u}/matches?type=2&count=100` (current-season ranked) and `/users/{u}/seasons` (`data.seasonResults[n].{last,highest,lowest}`) in parallel. The ELO chart is hand-drawn inline SVG, re-rendered on resize. In a match's `changes[]`, `eloRate` is the ELO *before* the match, so the post-match value is `eloRate + change`. On a forfeit, `result.time` is when the match ended, not a completion time. Unknown nicknames return `{status:'error'}` with HTTP 400.

### tvmcsrpt.html (MCSR TV Portugal)

Polls `/live` every 15 s (paused while the tab is hidden) and shows matches where a PT player is streaming: a featured Twitch embed plus a sidebar of other live matches and PT players in a match without a stream. The URL hash holds the nickname being watched, so a link follows that player into later matches. The Twitch embed needs a real hostname for its `parent` param, so it won't play from `file://`; serve the directory to test.

`?country=xx` swaps the PT filter for another country and shows a test-mode banner. `tvmcsrpt-test.html` is just a redirect to `?country=us`, for testing when no PT player is live.

### Tournaments

`torneios.html` renders from the `TORNEIOS` array in `assets/torneios.js`. The file header documents the entry schema (`status`: `'a-decorrer' | 'em-breve' | 'terminado'`, `date` as `YYYY-MM-DD` or `null`, `links` where the first is highlighted, `podium`, etc.). Adding/finishing an event is a data-only edit there; the page groups by status and sorts by date.
