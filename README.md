# Coffee Product Catalogue

Portfolio project built with Next.js App Router and TypeScript.

This application demonstrates a complete e-commerce-style flow for coffee products: catalogue browsing, filtering, basket, checkout, account authentication, and saved orders.

## Portfolio focus

This project is intentionally built to showcase practical full-stack skills:

- App Router architecture (server/client components and route handlers)
- Typed API and validation-driven input handling
- Redux state management with persistence
- Authentication and account area with protected data access
- SEO fundamentals (page metadata + sitemap)
- Unit tests for critical business logic and API routes

## Features

- Product catalogue with:
	- search, tag filter, min/max price filter, sort
	- load-more pagination
	- product detail pages
- AI questionnaire recommendations:
	- preference quiz for flavours, brew method, roast, acidity, budget, and intensity
	- top 5 coffee matches with reasons
- Basket management:
	- add/remove/update quantity
	- persisted basket state (local storage)
- Checkout flow:
	- customer form validation
	- mock payment submission
- Authentication and account:
	- sign up + sign in (credentials)
	- account page with past orders
	- protected order detail pages
- SEO:
	- page-level metadata
	- generated sitemap at /sitemap.xml
- Privacy:
	- privacy notice page for essential cookie/data usage

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Redux Toolkit + React Redux
- NextAuth (credentials)
- Prisma + PostgreSQL (Neon)
- Zod
- Vitest

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database (Neon recommended for free tier)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create/update `.env`:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-random-secret"
NEXTAUTH_SECRET="your-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Notes:

- `AUTH_SECRET` and `NEXTAUTH_SECRET` can be the same value.
- Generate a strong secret with: `openssl rand -base64 32`

### 3) Run Prisma migration

```bash
npx prisma migrate dev
npx prisma generate
```

### 4) Start development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run production build locally
- `npm run lint` – lint project
- `npm test` – run test suite
- `npm run test:coverage` – run tests with coverage
- `npm run format` – format files with Prettier
- `npm run format:check` – check formatting

## Testing

The project includes unit tests for:

- API routes (products, product detail, checkout, auth registration)
- Redux slices/selectors/persistence logic

Run all tests:

```bash
npm test
```

## Deployment

This app is deployed-ready for Vercel.

Required environment variables in Vercel:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

After setting env vars, redeploy.

## Notes

- Checkout is intentionally a mock payment flow (portfolio scope).
- Auth uses credentials and hashed password storage.
- Account/order pages are protected and scoped to the signed-in user.
