# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Working professionals, young adults, and individuals who want to track their daily discretionary expenditures (UPI payments, cards, cash transactions) manually and privately on laptops/PCs, tablets, or mobile phones, without linking bank accounts or granting access to SMS/banking credentials.

## Product Purpose

1Pavala helps users build disciplined spending habits through frictionless manual expense logging, immediate visual feedback, monthly budget threshold monitoring, and month-over-month clarity. Success means a user can open the app, log an expenditure in seconds, know their exact remaining safe runway, and never worry about financial data leakage.

## Positioning

Zero-trust, 100% on-device privacy combined with Apple-grade design clarity and daily safe allowance pacing. Unlike automated aggregators that break sync, expose sensitive bank feeds, or push unsolicited financial products, 1Pavala operates entirely in the user's browser sandbox with complete offline sovereignty.

## Operating Context

- Used in everyday moments immediately following a purchase (e.g. Swiggy order, grocery run, chai, cab fare, utility bills).
- Accessed across desktop/laptop workstations and mobile/tablet browser viewports.
- Operates offline and survives browser refreshes via client-side `localStorage`.

## Capabilities and Constraints

- **Manual Expense Logging:** Fast recording of amount (> 0), category, date (defaults to today with shortcuts), optional payment method (UPI, Credit card, Debit card, Cash, Other), and optional note.
- **Budget Pacing & Warnings:** Monthly spending ceiling with dynamic multi-stage threshold warnings (75% Caution, 90% Warning, 100% Limit Exhausted) and a safe daily spending calculator. Budget alerts never block expense recording.
- **Visual Analytics:** Interactive category breakdown (SVG Donut with hover details), daily spending trajectory trend chart, payment channel breakdown, and day-of-week analysis.
- **Transaction Ledger:** Searchable, multi-field filterable (category, month, payment method), and sortable (date, amount, category) transaction history with inline editing and deletion.
- **Monthly Summary:** Statistical audit for any selected month with largest single expense, average expense, and month-over-month delta calculations.
- **Data Sovereignty:** Client-side persistence, one-click JSON backup export/restore, CSV spreadsheet export, demo sample data generator, and data reset.
- **Technical Constraint:** Zero backend servers, zero external financial API calls, zero tracking telemetry.

## Brand Commitments

- **Name:** 1Pavala.
- **Voice:** Calm, disciplined, transparent, and direct. Financial numbers are presented with deference and clarity without patronizing copy or decorative fluff.
- **Aesthetics:** Apple-inspired design standards—deference to content, continuous squircle curvature, San Francisco / system typography, clear semantic color accents (system blue, mint green, warning amber, danger red), and subtle liquid glass functional layers.

## Evidence on Hand

- Fully functional React 18 + Vite 6 + Tailwind CSS single page web application in active workspace.
- Comprehensive local storage and statistics calculation engine in [`src/services/storage.ts`](file:///c:/Users/sanka/OneDrive/Desktop/1Pavala/src/services/storage.ts) and [`src/context/AppContext.tsx`](file:///c:/Users/sanka/OneDrive/Desktop/1Pavala/src/context/AppContext.tsx).
- Complete technical PRD and architecture reference documented in [`README.md`](file:///c:/Users/sanka/OneDrive/Desktop/1Pavala/README.md) and [`1Pavala_Project_Documentation.md`](file:///C:/Users/sanka/.gemini/antigravity/brain/c98ee418-d285-4e09-9180-0e536315af38/1Pavala_Project_Documentation.md).

## Product Principles

1. **Deference over Decoration:** Financial figures and budget status are the hero. Decorative clutter, heavy saturated gradients, and AI tropes must never compete with legibility.
2. **Privacy as an Invariant:** Never require banking logins, never scrape external feeds, and keep all data strictly client-side.
3. **Speed & Frictionlessness:** Logging an expense must take fewer than three taps/clicks or keyboard shortcuts (<kbd>n</kbd> / <kbd>+</kbd>).
4. **Deterministic Pacing:** Calculations, month-over-month variances, and safe daily allowances must be derived directly from raw transaction records.
5. **Universal Responsiveness:** The experience must feel equally native and polished on wide desktop monitors, laptops, tablets, and mobile screens.

## Accessibility & Inclusion

- WCAG AA compliant contrast ratios across text and controls.
- Tabular figures (`tabular-nums`) for currency columns and numeric metrics.
- Touch target sizes minimum 44×44pt on mobile.
- Support for keyboard navigation and screen-reader accessibility labels on icon controls.
