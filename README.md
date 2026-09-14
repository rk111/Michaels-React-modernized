# Michaels · Subscribe & Save (React prototype)

Responsive local prototype of the Subscribe & Save purchase flow from the provided Figma exports.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4 (tokenized via `@theme`)
- shadcn-compatible UI primitives (`Button` with `cva` + Radix `Slot`)
- Vitest + Testing Library
- Playwright (viewport overflow checks)

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tests

```bash
npm run test
npm run test:layout
```

## Implementation scope

The entry point renders only Figma **10 Prototype — Subscribe every 30/60/90 days**, through `src/app/Prototype.jsx`. No cart screen, checkout, receipt, asset grid, or design coverage map is rendered. Earlier draft modules remain in the repository but are not used by the entry point.

The page uses the exported paint-tube artwork and Arimo/Yellowtail fonts. Shared price and purchase-card components preserve the specified content. Frequency, quantity, favorites, and cart count are local React state; refreshing resets them. There is no backend or checkout integration. Search and informational navigation have no service integration.

Native labeled radio/select controls provide keyboard operation. Focus indicators and visually hidden cart announcements provide accessible feedback without extra visible content. Desktop and mobile reproduce the supplied column/stack structure; the intermediate layout stacks to keep purchase controls usable.

## Validation status

Dependency versions were checked against the package registry. Build and unit tests were attempted, but Vite and Vitest are unavailable until dependencies are installed. No passing build, tests, or screenshot comparison is claimed.

Layout tests cover 375px, 768px, and 1440px widths, frequency selection, unwanted-content absence, overflow, and selected Figma measurements. They save full-page screenshots for review. Install the Playwright browser locally before running them:

```bash
npx playwright install chromium
npm run test:layout
```

Visual acceptance remains pending an executed browser comparison. Native select menus use browser rendering rather than a custom painted dropdown.
