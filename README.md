# E-Comus Storefront

A fully-featured e-commerce single-page application built with React + TypeScript, consuming the [E-comus REST API](https://e-commas-apis-production-e0f8.up.railway.app/api-docs/).

## Features

- 🔐 **Authentication** — Register, login, logout with JWT persistence
- 🛍️ **Product Browsing** — Responsive product grid with search, filters, and sorting
- 📂 **Categories** — Browse products by category
- 🛒 **Shopping Cart** — Add, update, remove items with live count badge and slide-over drawer
- 💳 **Checkout** — Place orders using server-side cart
- 📦 **Order History** — View past orders with status tracking
- 📱 **Fully Responsive** — Mobile-first design with Tailwind CSS

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| State Management | **Zustand** (see justification below) |
| API Client | Axios |
| Styling | Tailwind CSS v4 |
| Toasts | react-hot-toast |
| Testing | Vitest + React Testing Library + fast-check |

### State Management: Why Zustand?

Zustand was chosen over Redux Toolkit and Context API because:

- **Zero boilerplate** — no actions/reducers/slices; state and actions in one `create()` call
- **Built-in `persist` middleware** — token storage in `localStorage` out of the box
- **Selector-based subscriptions** — components only re-render when their specific slice changes, avoiding the over-rendering issue with React Context
- **TypeScript-first** — excellent inference without manual typing overhead
- **Small bundle** — ~1KB gzipped

Redux Toolkit's extra structure pays off in very large teams with complex state graphs — neither applies here. Context API was ruled out due to performance concerns with the high-frequency cart count updates.

## Project Structure

```
src/
├── api/          # Centralized Axios client + service functions
├── components/
│   ├── auth/     # LoginForm, RegisterForm
│   ├── cart/     # CartItem, CartDrawer
│   ├── common/   # ErrorState, EmptyState, Pagination, SkeletonLoader, ErrorBoundary
│   ├── layout/   # Header, Footer, Layout
│   └── product/  # ProductCard, ProductGrid, ProductFilters, VariantSelector
├── hooks/        # useDebounce, usePagination, useProducts, useCart, useAuth
├── pages/        # Route-level page components
├── router/       # AppRouter, ProtectedRoute
├── store/        # Zustand stores (auth, cart, product, ui)
├── tests/        # Unit, component, and property-based tests
├── types/        # TypeScript interfaces
└── utils/        # formatters, validators, filterProducts
```

## Prerequisites

- Node.js v18+ 
- npm v9+

## Setup

```bash
# 1. Clone and install
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL

# 3. Run development server
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Base URL for the E-comus API |

Example:
```
VITE_API_BASE_URL=https://e-commas-apis-production-e0f8.up.railway.app
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## API Reference

Base URL: `https://e-commas-apis-production-e0f8.up.railway.app`  
Swagger Docs: `https://e-commas-apis-production-e0f8.up.railway.app/api-docs/`

## Key Decisions & Assumptions

1. **Cart persistence** — The API provides server-side cart endpoints (`/api/auth/cart`), so the cart is persisted on the server. Only the JWT token is stored client-side in `localStorage`.

2. **Token storage** — JWT stored via Zustand `persist` in `localStorage`. For a production app with httpOnly cookie support, that would be preferred, but this API uses Bearer tokens.

3. **Checkout** — Simplified to "Place Order" (POST `/api/auth/orders`) without a payment step, as the API does not expose payment endpoints.

4. **Sorting** — Sort is applied client-side after fetching, as the products API may not support all sort parameters.

5. **Images** — Product images come from Cloudinary CDN URLs returned by the API. A fallback SVG placeholder is shown on image load errors.

## Known Limitations

- No payment gateway integration
- No user profile editing (name/email/password change)
- No real-time stock updates
- Wishlist not implemented (API support unclear at time of development)
