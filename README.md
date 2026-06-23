# MH4U Database — Web

> The web client for the **Monster Hunter 4 Ultimate** database. Browse monsters,
> weapons, armor, decorations, items and quests, with universal search — all
> served from the [mh4u-api](https://github.com/Snitzle/mh4u-api).

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

Built with Next.js 16 (App Router), React 19 and Tailwind CSS 4. The typed API
client is generated from the API's OpenAPI spec.

## Prerequisites

- **Node.js 20+** and npm.
- **The API running** at `http://localhost:8088`. Follow the setup in
  [mh4u-api](https://github.com/Snitzle/mh4u-api) first — the quickest path is
  `docker compose up --build` in that repo.

## Getting started

```bash
# 1. Make sure the API is up (see mh4u-api), then:
npm install

# 2. (Optional) copy the env template. The defaults already point at
#    http://localhost:8088, so this is only needed to override them.
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Every variable has a sensible default for local development (the API on
`localhost:8088`), so a `.env.local` is optional. Override in `.env.local`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `API_BASE_URL` | `http://localhost:8088/api/v1` | Base URL for **server-side** requests (SSR / route handlers) |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8088/api/v1` | Base URL for **browser** requests |
| `NEXT_PUBLIC_ASSET_HOST` | `localhost` | Host that serves game images (`next/image` remote patterns). Host only — no scheme/port |
| `API_DOCS_URL` | `http://localhost:8088/docs.openapi` | OpenAPI spec consumed by `npm run generate:api` |

## Scripts

```bash
npm run dev          # start the dev server on :3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint
npm run generate:api # regenerate the typed API client from the live API
```

### Regenerating the typed API client

`src/lib/api/schema.d.ts` is generated from the API's OpenAPI spec and is **not**
committed. With the API running:

```bash
npm run generate:api
```

This reads `${API_DOCS_URL:-http://localhost:8088/docs.openapi}` and writes
`src/lib/api/schema.d.ts`.

## Project structure

```
src/
  app/            # App Router pages (monsters, weapons, armor, items, quests, search)
  components/     # Shared UI (Header, SearchBox, Filters, Pagination, …)
  lib/
    api/          # API client + types (client.ts, types.ts)
    nav.ts        # Top-level navigation config
    url.ts        # Query-string helpers
```

## Attribution & license

The application source code is released under the [MIT License](LICENSE).

*Monster Hunter 4 Ultimate*, all related names, assets and imagery are
trademarks of **© CAPCOM CO., LTD.** This is an unofficial, non-commercial fan
project and is not affiliated with or endorsed by Capcom. Game data lineage and
attribution are documented in the [mh4u-api](https://github.com/Snitzle/mh4u-api)
repository.
