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

## Implementation notes

- Checkout is intentionally local-only (no payment, account, or subscription API calls).
- Design tokens are defined in `src/styles/tokens.css` using values extracted from Figma token notes and section JSON.
- Reusable controls included:
  - purchase type radio cards
  - delivery frequency selector
  - quantity stepper
  - cart actions
  - payment method selection with Subscribe & Save tender restriction
- Figma assets are loaded from `public/figma-assets/`.
- The app includes `data-figma-section="01"` through `"35"` markers and exported anchor copy for parity checks against section-level exports.

## Accessibility

- Semantic landmarks (`header`, `main`, `section`, `footer`)
- Keyboard reachable controls and native form elements
- Visible focus styles on actionable controls
- Named controls/inputs for assistive tech
- Informational status updates (`aria-live`) in mini-cart feedback

## Known deviations

- The flow is implemented as a consolidated interactive prototype page rather than 35 separate route-level pages.
- Some micro-icons and exact vector placements are represented via exported asset grid and product artwork, not one-to-one absolute placement for every node in the source frames.
- Email receipt and order-confirmation are static local prototypes (no transactional state or persistence).
