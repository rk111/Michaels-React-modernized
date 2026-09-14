# Subscribe & Save — FRD coverage audit

Status: incomplete local prototype, not production acceptance.

This audit compares the supplied excerpts of Michaels-Subscription-FRD.docx (Draft v0.2) with the connected entry point `src/main.jsx`, `src/app/Prototype.jsx`, `src/app/Cart.jsx`, and `src/app/Checkout.jsx`. It does not claim access to the entire attachment or runtime verification. Requirements whose full wording was not supplied, including FR-3.6 and FR-4.6, cannot be assessed.

## Connected flow

Product → in-memory mixed cart → simulated payment → review → demo confirmation → receipt preview. Add-to-cart shows a status message and View cart button, not a mini-cart. Shipping/customer details and order identifiers are fixtures. Refresh resets cart state. No order is submitted, payment token created, or receipt email sent.

## Requirement coverage

| Requirement | Code evidence and status |
| --- | --- |
| FR-1.1–1.3: independently deployable, versioned eligibility service and terms | Missing. No eligibility service is called by the connected product page; frequencies and prices are literals. No cycle bounds. |
| FR-1.4–1.7: explicit ineligible response, batch lookup, cache TTL, eligibility events | Missing from connected flow. No service boundary implementing these behaviors. |
| FR-1.8: recurring scheduling excluded | Respected: no future orders are scheduled. |
| FR-2.1: lookup on product load | Missing. Subscription is initially selected without an eligibility result. |
| FR-2.2–2.4: selector, terms, reactive pricing and action | Present in source for the fixture product: labeled radios, frequency select, price/savings and button updates. Runtime tests remain unverified. |
| FR-2.5 and FR-2.7: timeout and ineligible fallback | Missing. Subscription UI is always offered. |
| FR-2.6: pass purchase attributes to cart | Partial. Purchase flag, frequency, price and quantity reach React state; no stable SKU on newly added lines. |
| FR-3.1–3.2: distinct subscription line and presentation | Partial. Badge, frequency and price exist; line IDs are not a reliable product/SKU contract. |
| FR-3.3: bidirectional conversion and recalculation | Partial. Frequency editing and subscription → one-time work in source; eligible one-time → subscription is absent. Price conversion is hard-coded. |
| FR-3.4: recurring/management disclosure in cart, mini-cart and review | Partial. Cart summary supplies it, including during checkout. Mini-cart is missing. |
| FR-3.5: order attributes for downstream handoff | Missing integration. Review renders shared state, but no order payload/snapshot captures SKU, terms, discount, consent and payment token for handoff. |
| FR-4.3: configurable recurring capability | Missing configurability. Four labels are hard-coded, and only Affirm is disabled for subscriptions. Other providers' actual gateway/merchant capability is not checked. |
| FR-4.4: one-time payment options unchanged | Present for the four fixture choices; Affirm is enabled without subscription lines. This does not establish parity with the live site's enabled methods. |
| FR-4.5: incompatible payment blocks submission with explanation | Partial. Affirm radio is disabled with explanatory text, but there is no independent capability guard on form submission or Place demo order. |

Service requirements: [Source: Michaels-Subscription-FRD.docx, section 4] [Source: Michaels-Subscription-FRD.docx, section 5]

PDP requirements: [Source: Michaels-Subscription-FRD.docx, section 6]

Cart requirements: [Source: Michaels-Subscription-FRD.docx, section 7]

Payment requirements: [Source: Michaels-Subscription-FRD.docx, section 9]

## Consent and payment boundary

A required recurring-consent checkbox exists on the simulated payment form, but consent is not included in an order record. Credit-card inputs are local demo inputs, not hosted tokenization fields. PayPal and Google Pay only display simulation notices. A valid reusable payment token is not obtained. The FRD requires checkout to capture consent and a chargeable credential, and mixed carts use one recurring-capable instrument. [Source: Michaels-Subscription-FRD.docx, section 3]

Do not implement recurring billing, future fulfillment, or subscription account management as part of this checkout scope. Account destinations may be referenced but their management UI is excluded. [Source: Michaels-Subscription-FRD.docx, section 3]

## Remaining implementation work

1. Define a versioned eligibility contract and implement the service separately from its frontend adapter; include explicit ineligibility, batch requests, cache policy, terms and events.
2. Connect the PDP to eligibility with loading, timeout/error fail-closed behavior and tests; never silently treat network failure as eligibility.
3. Give cart lines stable SKUs and explicit subscription terms/discount metadata; support both conversion directions only for eligible products.
4. Implement the Figma mini-cart with recurring disclosures, keyboard/focus behavior and responsive tests.
5. Move payment support into capability configuration, then enforce the selected capability and consent at both review and submission boundaries.
6. Define a checkout handoff contract and order snapshot; integrate real payment tokenization only when the gateway contract is supplied. Keep demo behavior visibly labeled until then.
7. Complete desktop/mobile visual comparison and test primary flows, service failure, conversion, mixed/one-time payment availability, consent, empty checkout and receipt attributes.

## Information needed for full sign-off

- Full FRD text, especially missing functional requirements and architecture/flow sections; only excerpts were available for this audit.
- Eligibility ownership/source, authenticated API/schema, timeout/cache expectations and analytics destination.
- Configured payment capability signal and gateway tokenization/authorization interfaces.
- Order submission/handoff schema. The FRD itself says this downstream contract needs follow-on definition. [Source: Michaels-Subscription-FRD.docx, section 15]

## Validation

Source inspection is not a passing functional or visual test. Run `npm test`, `npm run build`, and `npm run test:layout` after dependency installation in an appropriately configured environment. No handwritten lockfile should be added to bypass installation safeguards. Existing section markers and dynamic totals are present in source; old literal-text preflight failures alone do not prove rendered content is absent.
