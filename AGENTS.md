# AGENTS.md

## Purpose

This document is the operating guide for AI coding agents working in this repository.

Primary goals:
- Make safe, minimal, production-quality changes.
- Preserve existing architecture and style.
- Keep tests green.
- Prefer typed, validated, predictable behavior.

---

## Project Overview

Coffee Product Catalogue built with Next.js App Router + TypeScript.

Core feature domains:
- Product browsing, filtering, pagination, product detail.
- Basket and checkout (mock payment flow).
- Authenticated account area (orders, favourites).
- Coffee Matcher recommendations (rule-based ranking).
- Saved recommendation snapshots (local + account sync).
- API route coverage with Vitest.

---

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4 + custom CSS variables
- Redux Toolkit + React Redux
- NextAuth (credentials provider)
- Prisma + PostgreSQL
- Zod for validation
- Vitest + jsdom + v8 coverage

---

## Workspace Structure (important paths)

- App routes and UI: app/
  - Layout/providers/navigation: app/layout.tsx, app/providers.tsx, app/_components/AppNavigation.tsx
  - Feature routes: app/products, app/basket, app/checkout, app/account, app/recommendations
  - API routes: app/api/**/route.ts
- Core logic: src/lib/
  - Products, validation, auth, db, favourites, recommendations, snapshot sync
- State management: src/state/
  - store.ts, hooks.ts, selectors/, slices/, persistence/
- Shared types: src/types/
- Static product dataset: data/products.json
- Database schema/migrations: prisma/schema.prisma, prisma/migrations/
- Tests: tests/**

---

## Commands

- Dev server: npm run dev
- Build: npm run build
- Lint: npm run lint
- Tests: npm test
- Coverage: npm run test:coverage
- Format: npm run format
- Prisma generate: npx prisma generate
- Apply migrations (dev): npx prisma migrate dev

Notes:
- Coverage HTML output is generated into coverage/ and ignored by git.
- Prisma client is generated on postinstall.

---

## Architecture Rules

### 1) App Router boundaries
- Keep server concerns in server components/route handlers.
- Use `"use client"` only where hooks/browser APIs are needed.
- Prefer colocated route components in each feature folder.

### 2) Validation first
- Validate all external input (query/body/credentials) before use.
- Existing validation patterns:
  - Zod schemas in src/lib/*-validation.ts
  - Structured validation results (isValid/errors)

### 3) Type safety
- Avoid `any`.
- Reuse shared types from src/types/.
- Keep runtime validation aligned with TypeScript types.

### 4) Small, composable utilities
- Put domain logic in src/lib.
- Keep components focused on rendering + interaction.
- Keep reducers pure and deterministic.

### 5) Stable API behavior
- API routes should return explicit status codes and predictable JSON.
- Use shared helpers where adopted: src/lib/api-responses.ts (`apiError`, `apiSuccess`).
- If touching older routes, prefer converging toward `{ ok, ... }` envelopes.

---

## Styling & UI Conventions

Global styles are in app/globals.css.

Use shared utility classes:
- Layout/surface: `app-page`, `app-surface`
- Text: `app-muted`
- Inputs/buttons/chips: `app-input`, `app-button-primary`, `app-button-secondary`, `app-chip`

Guidelines:
- Preserve existing visual language (coffee palette via CSS vars).
- Reuse existing classes before introducing new globals.
- Keep accessibility in mind: meaningful `alt`, `aria-label`, button semantics.

Images:
- Use next/image.
- Fallback pattern commonly used: `product.imageUrl ?? `/${product.id}.webp``.

---

## State Management (Redux)

Store:
- src/state/store.ts with slices:
  - basket
  - checkout

Persistence:
- Basket persisted via src/state/persistence/basket-storage.ts
- Last order persisted via src/state/persistence/last-order-storage.ts
- Hydration wiring in app/providers.tsx

Selectors:
- Use selectors from src/state/selectors rather than ad-hoc derived state in components.

Reducer conventions:
- Sanitize hydrated payloads (`sanitizeBasketItems`, `sanitizeLastOrder`).
- Keep reducer actions simple and serializable.

---

## API Map (current)

Products:
- GET /api/products
- GET /api/products/[id]

Recommendations:
- POST /api/recommendations
- GET/POST/PUT /api/recommendation-snapshots

Checkout & Orders:
- POST /api/checkout
- GET /api/orders
- GET /api/orders/[id]

Auth & Account helpers:
- GET/POST /api/auth/[...nextauth]
- POST /api/auth/register
- GET/POST /api/favourites
- DELETE /api/favourites/[productId]

Behavior highlights:
- Checkout persists order only when user is authenticated; otherwise mock order ID is generated.
- Orders endpoints are auth-protected and user-scoped.
- Recommendation snapshots support:
  - local browser storage
  - server sync for signed-in users
  - deduplication by snapshot ID

---

## Recommendation Engine Notes

Coffee Matcher is a deterministic rule-based ranking system (not ML).

Logic location:
- src/lib/recommendations.ts
- src/lib/recommendation-validation.ts

Mechanics:
- Weighted scoring by flavour tags, brew method, roast/acidity/budget/intensity, decaf constraint.
- Exclusion path for incompatible decaf requirement (`-Infinity`).
- Top 5 sorted by score, rating, then price/name tie-breakers.

When modifying:
- Keep score reasoning understandable.
- Preserve deterministic sorting.
- Update/add tests for scoring changes.

---

## Database & Prisma

Schema:
- prisma/schema.prisma

Main models:
- User, Account, Session, VerificationToken
- Order, OrderItem
- Favourite
- RecommendationSnapshot

Important migration:
- prisma/migrations/20260405112000_add_recommendation_snapshots/migration.sql

Notes:
- DB connection must use DATABASE_URL.
- Recommendation snapshot server utility includes graceful table availability checks.
- In test environment, table availability checks are bypassed to simplify tests.

---

## Types

Primary shared types:
- Product: src/types/product.ts
  - canonical detailed description field: `detailedDescription`
  - data loader normalizes legacy `detailedDescreption` key from JSON
- Order types: src/types/order.ts
- Recommendation types: src/types/recommendation.ts
- Products query types: src/types/products-query.ts

Rule:
- If a type changes, update validators, API responses, and tests in the same change.

---

## Testing Guide

Framework:
- Vitest with jsdom
- Config: vitest.config.ts
- Includes: tests/**/*.test.ts
- Coverage includes src/**/* and app/api/**/*

Current approach:
- Unit tests for lib/state utilities.
- API route tests for all major endpoints.
- Mocking uses `vi.mock` (and `vi.hoisted` when needed for hoisted factories).

When adding/changing features:
- Add/adjust tests in the same PR.
- Cover both success and failure paths.
- For auth-protected routes, test unauthorized + authorized cases.

---

## Agent Best Practices for This Repo

1. Read relevant files before editing.
2. Make focused changes; avoid unrelated refactors.
3. Preserve existing naming, class patterns, and folder conventions.
4. Keep API contracts backward-compatible unless explicitly requested.
5. Run tests after changes (`npm test` at minimum).
6. If touching schema, include migration and regenerate Prisma client.
7. Prefer extending existing helpers over introducing parallel abstractions.
8. Never commit secrets or `.env*` values.

---

## Known Conventions / Gotchas

- API response envelope is partly standardized (`apiError`/`apiSuccess`) but some legacy routes still use direct `NextResponse.json` payloads.
- Product dataset is static JSON; do not assume products are DB-backed.
- Recommendation snapshots are dual-source (local + server); avoid breaking merge/sync behavior.
- Keep `coverage/` as generated artifact (ignored in git).

---

## Suggested Workflow for Agent Tasks

1. Identify feature area (products, checkout, auth, recommendations, account).
2. Find corresponding route/UI + lib + types + tests.
3. Implement smallest coherent change.
4. Update/extend tests.
5. Run `npm test`.
6. If schema changed: run migration + prisma generate.
7. Summarize files changed and behavioral impact.

---

## Definition of Done

A change is done when:
- TypeScript/linters show no relevant new errors.
- Tests pass locally.
- API/UX behavior is consistent with existing patterns.
- New logic is covered by tests where practical.
- Documentation/comments remain accurate.
