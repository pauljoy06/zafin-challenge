# Zafin Product Showcase

Frontend assignment scaffolded with Vite (React + TypeScript). The app presents a product hierarchy, product detail views, and customer reviews backed by a json-server mock API.

## Prerequisites

- Node.js 20.x (LTS) or newer
- npm 10.x or newer

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/pauljoy06/zafin-challenge
   cd zafin-challenge
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the mock API** (runs on http://localhost:4000)
   ```bash
   npm run mock:server
   ```
4. **Start the Vite dev server** in another terminal (http://localhost:5173)
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` – launch the development server with hot reloading.
- `npm run mock:server` – start json-server using `mock/db.json`.
- `npm run lint` – run ESLint with strict type-aware rules.
- `npm run build` – type-check and create a production build.
- `npm run preview` – preview the production build locally.

## Project Structure

```
src/
  api/             // API helpers (products, reviews)
  components/      // Reusable UI components (header, sidebar, table, markdown)
  hooks/           // Shared React Query hooks
  pages/           // Route-level screens (ProductView, ProductDetail, ProductReviews)
  utils/           // Shared utilities (apiFetch, formatters)
mock/db.json        // Mock dataset for products, details, and reviews
```

## Mock Data

`mock/db.json` contains:
- `products` – hierarchical catalog items with parent relationships.
- `productDetails` – detail data consumed by the Product Detail page.
- `reviews` – review records rendered on the Reviews page.

Run `npm run mock:server` to expose these collections via REST-style endpoints (e.g., `/products`, `/productDetails`, `/reviews`).


## Solution Overview

The app exposes a three-part product experience: a lazy-loading product tree, a product detail view with rich markdown content and category highlights, and a reviews page that surfaces customer feedback. Data flows through a `json-server` backend so the UI behaves like it would against real endpoints.


## Key Design Decisions

- **TanStack Query for data flow** – A custom `useFetch` sounds simple, but the moment the tree lazy-loads children the edge cases stack up: we’d have to keep a cache per node, decide when to refetch after collapse/expand, dedupe concurrent clicks, surface loading/error state consistently, and expire stale data. That essentially means rebuilding a mini query client from scratch (plus tests). TanStack Query already solves those problems—query keys map naturally to product nodes, `staleTime`/`gcTime` let us tune how long child data sticks around, and automatic request deduplication keeps the network quiet even if someone hammers expand. Added perks like retries, background refresh, Devtools, and mutation helpers mean we can grow into write flows later without changing the architecture. In short, TanStack lets us focus on the tree UI while keeping production-grade data behavior.
- **Reusable TreeTable** – I reviewed component libraries (PrimeReact, MUI, Ant) and none offered the mix we need: lazily fetched children *and* a path to row virtualization. PrimeReact, for example, handles lazy loading but leaves virtualization to manual hacks. Rolling our own table means we can add virtualization when the dataset grows without fighting a black-box API. It also keeps styling in our control, avoids bundling a large UI kit just for one widget, and keeps bundle size lighter. Finally, we can reuse the same table for any hierarchical data set simply by swapping the column config and child hook—no need to fork library components or accept their accessibility decisions sight unseen.
- **Shared presentation pieces** – Components like `Markdown`, `BackButton`, and `Button`, plus currency/date helpers, sit in one place so every screen looks and behaves the same. I could have styled each page separately, but that gets inconsistent quickly.
- **CSS organization** – I briefly weighed a utility framework (Tailwind, etc.) but stayed with nested PostCSS and grouped rules (layout, size, visuals). It keeps the styles readable while still letting us apply focused tweaks as the layout grows.
- **Virtualization deferment** – Tree virtualization can break built-in browser affordances like Ctrl+F, scrollbar accuracy, and smooth scroll-to-row. Given the current dataset size, I kept a plain DOM tree so those features keep working, while structuring the component so virtualization can drop in later without a full rewrite.
- **Chunked fetching roadmap** – If a node eventually exposes thousands of children, the plan is to pair the existing lazy loading with chunked fetches (and optional virtualization) so both network payloads and DOM stay manageable. Today’s implementation keeps the fetch layer simple, knowing that TanStack Query gives us the hooks to introduce pagination when needed.
- **Responsive layout postponed** – We deliberately skipped mobile responsiveness for the initial delivery to focus on desktop UX and data flows. The CSS grouping makes it easy to bolt on media queries once we align on breakpoints and interaction tweaks.
- **Folder organization** – With the app still small, shared components live under `src/components/` and cross-cutting utilities stay in `src/utils/`. Types sit next to their API helpers (e.g., `src/api/products.ts`) so contracts stay local. If the app expands, we can migrate to feature folders (`features/products/{components,api,types}`) without breaking imports. `ProductTree` already ships as a reusable component so other areas (e.g., category trees) can plug into it later.
- **Runtime validation backlog** – API helpers currently rely on TypeScript generics (`apiFetch<T>`) and trusted mock data. In production we’d add runtime validation (Zod or similar) before returning responses to catch schema drift or unexpected payloads.
- **Server quirks handled client-side** – json-server’s beta version doesn’t filter child records exactly the way we need, so `fetchChildProducts` applies an extra client-side filter. That keeps behavior predictable until we either swap the server or write a custom route.
- **Optimistic expanders** – The tree shows an expander control by default and removes it only after confirming a node has no children. That avoids extra “probe” requests just to decide whether the toggle should exist, keeping interactions snappy even over slow connections.
- **Local fallback components** – Loading and empty states are defined alongside their pages for now. If multiple screens start sharing those UIs, they can move into `src/components/` as reusable banners or skeletons.


## Future Roadmap

- **Row virtualization & chunked fetches** – Keep performance snappy on huge datasets by: (1) rendering only the rows on screen (virtualization), (2) loading child items in small batches as branches open instead of all at once, and (3) optionally detecting fast scrolling to fetch the next batch early. These techniques prevent enormous DOMs and oversized network requests when teams load tens of thousands of products.
- **Keyboard & accessibility polish** – Add arrow/enter navigation, ARIA attributes, and focus management to the TreeTable and buttons for a fully accessible experience.
- **Runtime schema validation** – Layer Zod (or similar) into the API helpers so the UI can guard against malformed or evolving backend payloads.
- **Feature-based folders** – When the app grows, migrate to a `features/<domain>` structure to keep components, hooks, and API logic co-located.
- **Testing strategy** – Introduce unit and integration tests (React Testing Library + MSW) to cover tree interactions, routing, and data fetching edge cases.
