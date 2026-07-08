# BestBuy4uBd - Developer & AI Guide

This guide serves as a compact, token-efficient reference for developers and AI code assistants (like Gemini, Cursor, or Copilot). It focuses waves-exclusively on the `BestBuy4uBd` frontend codebase, explaining its architecture, components, routing, styling, and state management patterns to enable fast edits without full codebase scans.

---

## ⚡ Quick Start Commands
Run these commands in the `BestBuy4uBd` directory:
- Run Development Server: `npm run dev`
- Build Production Code: `npm run build`
- Run Linter: `npm run lint`

---

## 🛠️ Technology Stack
- **Core Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS 4 (`src/index.css`) + HeroUI (`@heroui/react`)
- **State Management:** Redux Toolkit + Redux Persist (`src/store/`)
- **Routing:** React Router DOM 7 (`src/routes/`)
- **Forms & Validation:** React Hook Form + Zod
- **UI Components:** Radix UI primitives & Lucide Icons / React Icons

---

## 🧭 Source Code Structure (`src/`)
```
src/
├── assets/          # Static images, logos, fonts
├── common/          # Complex shared components (e.g., SharedLayout, TrackingManager)
├── components/      # Global reusable components
│   ├── ui/          # Radix/Shadcn UI primitives (button, avatar, sonner, etc.)
│   └── common/      # Shared layout/routing elements
├── config/          # Domain configurations (BuildConfig.ts)
├── context/         # React Context files
├── hooks/           # Custom React hooks (useRedux, useTracking, usePriceCalculation)
├── Layout/          # Layout wraps (DashboardLayout, PublicLayout)
├── lib/             # Helper libs (axios instance, helper utilities)
├── pages/           # Views categorized by access roles
│   ├── Admin/       # Admin-specific modules (Dashboard, Order, Product, Category)
│   ├── User/        # User-specific dashboard (Dashboard, Settings, Order)
│   ├── Public/      # Unprotected pages (Home, Shop, Cart, Checkout, Contact)
│   └── Auth/        # Auth views (Login.tsx, Signup.tsx)
├── routes/          # Navigation config arrays (AdminRoutes, PublicRoutes, etc.)
├── store/           # Redux Slices & RTK Query APIs
│   ├── Api/         # RTK Query APIs (AuthApi, ProductApi, OrderApi, baseApi)
│   └── Slices/      # Redux Slices (AuthSlice, CartSlice, wishlistSlice, UISlice)
├── types/           # TypeScript interfaces (Product, User, Api response types)
├── ui/              # Specific user interface elements
└── utils/           # Utility helpers (useGetHost, router generators, formatters)
```

---

## 🧠 Core Architecture Patterns

### 1. Centralized & Generator-Based Routing
- Page routing is defined dynamically in config arrays:
  - `src/routes/PublicRoutes.tsx` - Public storefront routes.
  - `src/routes/AdminRoutes.tsx` - Grouped admin-panel routes (includes groups like Overview, Order Management).
  - `src/routes/UserRoutes.tsx` - Customer dashboard routes.
- The `routesGenerator` (in `src/utils/Generator/RoutesGenerator.ts`) flattens these arrays into standard React Router objects.
- **Rules for adding pages:** 
  1. Add the path, index flag, and element to the corresponding config array.
  2. If the page should be hidden from the sidebar menu (like dynamic detail pages), do not provide a `label` or `name` property.

### 2. Domain & Tenant Resolution
- The application resolves the active brand theme and metadata based on `window.location.hostname`.
- Hook `src/utils/useGetHost.tsx` maps hostnames to brand configurations defined in `src/config/BuildConfig.ts` (e.g. `bestbuy4ubd.com` vs `topdealsbd.com`).
- It automatically updates `document.title` and the favicon.
- **Rule:** Use `useGetHost()` in headers/footers/views to display tenant-specific info (logo paths, phone numbers, and support email).

### 3. Redux Store & RTK Query
- **Global State:** Slices reside in `src/store/Slices/`. Access state and dispatch actions via typed hooks `@/hooks/useRedux` (`useAppDispatch` and `useAppSelector`).
- **Data Layer:** Never create new base query configs. Always inject endpoints into the global `baseApi` (imported from `@/store/Api/BaseApi/BaseApi`):
  ```typescript
  import baseApi from "./BaseApi/BaseApi";
  export const customApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getMyData: builder.query<Response, Payload>({
        query: () => "/endpoint",
      }),
    }),
  });
  ```
- **Token Handling & Re-auth:** `BaseApi.ts` automatically reads bearer tokens from `auth` state and implements automatic token refresh on `401 Unauthorized` responses using `user/refreshToken`.

### 4. Tailwind 4 Design Tokens & Spacing
- Color palettes, typography sizes, and border-radius parameters are defined as HSL CSS variables in `src/index.css`.
- Tailwind CSS v4 maps them using `@theme`.
- **Rule:** Use the semantic classes mapping to these variables:
  - Colors: `bg-background`, `text-primary`, `bg-brand-500`, `bg-bg-base`, `bg-bg-surface`.
  - Radius: `rounded-component` (defaults to `rounded-xl`).
  - Scrollbars: `no-scrollbar`.
- Theme presets (`.theme-emerald`, `.theme-rose`, `.theme-violet`, etc.) adjust the main `--brand-*` CSS colors dynamically.

### 5. Module Structure
When creating a feature page (e.g. `SteadfastManager` under Admin):
1. Place the main page entry file in `src/pages/Admin/Steadfast/SteadfastManager.tsx`.
2. Keep page-specific sub-components in a local `Components/` sub-folder (e.g., `src/pages/Admin/Steadfast/Components/`).
