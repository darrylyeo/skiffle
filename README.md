# SKIFFLE

SKIFFLE is a framework that lets you embed a website in a [Farcaster snap](https://docs.farcaster.xyz/snap/). A snapsite, if you will.

Navigate the snap just like you would click links on a website. Share any sub-URL back to the feed, and it still functions as an entry point to the snapsite no matter how deeply nested you are.

Webpage contents also render directly to snap images, so devs (and agents) can leverage the familiar HTML templating, CSS styling, param-based state and hierarchical data loading techniques of a modern route-based web framework.

- Live demo: [https://snap.skiffle.dev](https://snap.skiffle.dev)


## How SKIFFLE works

SKIFFLE works by extending SvelteKit with:

- an `HTML/CSS -> SVG -> PNG` render pipeline (`satori` + `resvg`)
- middleware-based content negotiation for Snap JSON, HTML, and raster image variants
- relative URL navigation handlers for snap clients
- adapters that bridge Snap POST input into SvelteKit Form Actions
- TypeScript helpers for building Snap elements and full Snap JSON payloads

The most crucial code path is in `src/hooks.server.ts` plus `src/lib/snap-routes.ts`: page URLs are overloaded and resolved through normal SvelteKit routing, while output modality is selected via HTTP `Accept` headers and related request context.


### Why this matters

SKIFFLE treats SvelteKit routes as the canonical source of truth, then projects that same route into:

- interactive web HTML
- shareable, navigable snap entry points
- server-rendered image previews

That keeps state, data loading, route hierarchy, and navigation semantics unified while still satisfying Farcaster frame/snap protocol requirements.


## Architecture Overview

### Core request model

Given a single SvelteKit route URL, SKIFFLE can produce different representations:

- **HTML**: default browser rendering
- **Snap JSON** (`application/farcaster-frame`): for Farcaster Snap clients
- **PNG raster** (`?image`): server-rasterized page preview from the HTML/CSS result

In practice:

1. `GET` with Snap `Accept` header triggers `snapGetResponse(...)`
2. `POST` with Snap JFS payload triggers `snapPostResponse(...)`
3. `GET` with `?image` resolves the page as HTML, transforms to SVG with Satori, then to PNG with Resvg
4. Frame signature packets (`POST`) are adapted into SvelteKit action-compatible requests
5. Responses include `link` alternates and `vary: Accept` where relevant


### `src/hooks.server.ts`

Global middleware that:

- normalizes request URL origin/host for proxied deployments (`publicRequestUrl(...)`)
- adds snap alternate `link` metadata to HTML responses
- handles Snap CORS preflight (`OPTIONS`)
- routes Snap `GET` / `POST` flows
- handles frame signature packet POST requests
- overloads `?image` into HTML->PNG server rasterization

### `src/lib/snap-routes.ts`

Snap protocol adapters that:

- force HTML resolution for canonical route parsing
- parse `fc:frame:*` metadata from HTML
- convert resolved pages to Snap JSON via `framePageToSnap(...)`
- detect SvelteKit internal action URLs (`?/actionName`)
- transform Snap inputs into form-encoded action submissions (`x-sveltekit-action: true`)
- merge action-returned `frame` / `snap` / `title` overrides back into a final Snap response

### `src/lib/snap.ts`

Snap composition logic for:

- converting frame-like page data into final snap UI trees
- constructing action rows, page footer/meta, and route navigation controls
- generating page raster preview URLs

### Supporting libraries

- `src/lib/snap-components.ts`: typed helpers for buttons, groups, and higher-level page building
- `src/lib/snap-spec.ts`: Snap media type/version/constants
- `src/lib/snap-jfs.ts`: JFS payload parsing and signature envelope handling
- `src/lib/frame-satori.ts`: HTML document preparation for Satori parsing


## Developing locally

Install and run:

```bash
pnpm install
pnpm dev
```

Run on a specific port:

```bash
pnpm dev --port 4000
```

Optional public tunnel for client integrations:

```bash
pnpm tunnel:ngrok
```


## Scripts

- `pnpm dev` - run Vite dev server
- `pnpm build` - production build
- `pnpm preview` - preview production build
- `pnpm check` - Svelte type-check pipeline
- `pnpm lint` / `pnpm format` - lint and format
- `pnpm test:unit` - Vitest
- `pnpm test:integration` - Playwright
- `pnpm test:integration:snap` - snap-focused Playwright config


## Design constraints and caveats

When rendering HTML/CSS through `satori` / `resvg`, some CSS features differ from browser behavior. In this codebase that often means:

- preferring solid colors over layered/translucent gradients in snap-rendered surfaces
- limiting complex multi-shadow text styling for raster stability
- keeping route output deterministic across HTML, Snap JSON, and image variants
- keep layout primitive (`flex`/block flow, simple `position`, no grid-like assumptions)
- avoid browser-only features like `calc`, `z-index`, and 3D transforms
- keep sizing/background values conservative (single-layer backgrounds, explicit sizes)
- treat text rendering as approximate vs browser typography (limited shaping/RTL behavior)
- if a style looks valid in browser CSS but fails in snap image rendering, verify it against Satori's supported property/value table first
