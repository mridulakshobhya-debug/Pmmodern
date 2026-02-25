# PMModern E-Commerce Platform

Production-oriented monorepo inspired by sandhai.ae with a modern premium UI and complete e-commerce flow.

## Stack

- `Next.js` (App Router, TypeScript)
- `Tailwind CSS`
- `Three.js` (hero particles)
- `GSAP` (intro, scroll reveal, stagger, page transitions)
- `Zustand` (cart/wishlist/auth/theme stores)
- `Node.js + Express` REST API
- `JWT` authentication middleware

## Monorepo Structure

```txt
apps/
  web/     # Next.js storefront
  api/     # Express REST backend
packages/
  shared-types/
```

## Implemented Core Features

- Global header with logo, categories mega menu, search with suggestions, wishlist, live cart count, account dropdown
- Required categories and grocery subcategories
- Product listing page with breadcrumb, filters, sorting, save search, product grid cards
- Product detail page with gallery zoom, pricing, quantity selector, add to cart, buy now, wishlist, description/reviews, related products, seller info
- Slide-out cart drawer with subtotal and live quantity updates
- Wishlist page
- Account pages (login, register, profile, order history)
- Floating `ShopMind AI` assistant using `POST /api/ai/chat` with structured product suggestions
- Three.js premium hero with 1700 floating rice-grain particles + GSAP animations
- Dark mode toggle and responsive glassmorphism design
- SEO scaffolding (`metadata`, `sitemap`, `robots`)
- Skeleton loaders for product routes

## API Routes

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/search?q=`
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:id`
- `DELETE /api/cart/:id`
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/me`
- `GET /api/orders/:userId`
- `POST /api/ai/chat`

## Setup

1. Install dependencies:
   - `npm install`
2. Create env files:
   - copy `apps/api/.env.example` to `apps/api/.env`
   - copy `apps/web/.env.example` to `apps/web/.env.local`
3. Run both apps:
   - `npm run dev`

Or on Windows, double-click:
- `Run PMModern.bat`

Frontend: `http://localhost:3000`  
Backend: `http://localhost:4000`

## Sandhai Image Sync

To mirror Sandhai images into this project (used by product cards, hero, category tiles, and footer badges):

```powershell
./scripts/sync-sandhai-images.ps1 -MaxPages 90 -MaxImages 320
```

Generated assets:
- `apps/web/public/sandhai/*`
- `apps/web/public/sandhai/manifest.json`

## Notes

- Current backend uses in-memory repositories for rapid scaffolding.
- Database draft schema is in `apps/api/src/db/migrations/001_init.sql`.
- Replace repository layer with persistent DB adapters (Prisma/Drizzle/Knex) for production deployment.
- A pure double-click `.html` launch is not possible for this architecture because Next.js + Express + JWT + AI routes require running servers.

## Desktop EXE (No End-User Setup)

To build a standalone Windows app (`.exe`) that end users can run without installing Node:

1. Double-click `Build Desktop EXE.bat`
2. Wait for build to complete
3. Open `desktop/release/PMModern-win32-x64`
4. Run `PMModern.exe`

Quick launcher:
- Double-click `Start PMModern Desktop.bat`
- It auto-closes stale PMModern processes, frees ports `3000/4000`, and launches the latest built EXE.

Technical details:
- Electron wrapper is in `desktop/`
- Runtime prep script builds:
  - Next.js standalone server
  - bundled API server
- Packaged app starts both internal servers and opens the app window automatically
