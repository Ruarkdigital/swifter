# SwiftPro Project Handover

This document provides a concise, actionable overview of the SwiftPro eProcurement portal for new maintainers. It covers architecture, setup, conventions, feature map, data flow, testing, and operational guidance.

## 1. Overview

- Frontend SPA built with React + TypeScript on Vite.
- State: Zustand for client state, TanStack React Query for server state.
- HTTP: Axios singleton with typed helper wrappers.
- Styling: Tailwind CSS v4 with ShadCN-style UI primitives and Radix UI.
- Routing: React Router v6 with public and protected route guards.
- SEO: `SEOWrapper` and `useSEO` for static and dynamic metadata.
- E2E Testing: Playwright with feature-local test suites.

## 2. Quick Start

- Requirements: Node.js 18+, npm.
- Install: `npm install`
- Dev server: `npm run dev` → `http://localhost:5173`
- Build: `npm run build`
- Lint: `npm run lint`
- Tests: `npm test` (see feature scripts in `package.json`)

### Environment Variables

- `VITE_API_BASE_URL` sets backend base URL used by Axios (`src/config/index.ts:2`).
- `E2E_BASE_URL` optionally sets Playwright base URL (`playwright.config.ts:9`).

## 3. Architecture & Entry Points

- App bootstrapping: `index.html`, `src/main.tsx:6`, `src/App.tsx:36`.
- Router setup: `src/routes/index.tsx:43` via `createBrowserRouter`.
- Providers: Query Client, Sentry ErrorBoundary, Theme, Toaster in `src/App.tsx:221`.
- Path alias: `@` → `./src` configured in `vite.config.ts:10`.

## 4. Routing & Guards

- Route definitions: `src/routes/index.tsx`.
- Public layout: `AuthLayout` → `PublicRoute` redirects authenticated users to dashboard (`src/routes/PublicRoute.tsx:9`).
- Protected layout: `Dashboard` → `ProtectedRoute` wraps `AuthorityGuard` (`src/routes/PrivateRoute.tsx:8`, `src/components/layouts/AuthorityGuard/index.tsx:24`).
- Key routes include solicitation/vendor/evaluation/admin/companies/user management and static policy pages.

## 5. State Management

- Auth store: `src/store/authSlice.ts` with persisted `{ user, token, refresh, authorities }` and actions.
  - Reset state: `setReset` (`src/store/authSlice.ts:40`).
  - Selector hooks: `useUser`, `useToken`, etc. (`src/store/authSlice.ts:67`).
- Role helpers: `src/hooks/useUserRole.ts` derives role flags and dashboard config.
- Simple auth check: `src/hooks/useAuthentication/index.tsx:3`.
- Server state: React Query client configured in `src/App.tsx:28`.

## 6. HTTP & API Layer

- Axios singleton with interceptors: `src/lib/axiosInstance.ts`.
  - Base URL: `config.baseUrl` (`src/lib/axiosInstance.ts:7`, `src/config/index.ts:2`).
  - Auth header injection: (`src/lib/axiosInstance.ts:16-23`).
  - Unauthorized handling: clears auth (`src/lib/axiosInstance.ts:33-41` using `storeFunctions.setReset`).
- Helper wrappers (preferred usage):
  - `getRequest` (`src/lib/axiosInstance.ts:48-57`), `postRequest` (`src/lib/axiosInstance.ts:65-72`), `patchRequest` (`src/lib/axiosInstance.ts:74-81`), `putRequest` (`src/lib/axiosInstance.ts:83-90`), `deleteRequest` (`src/lib/axiosInstance.ts:92-99`).

## 7. Styling & UI

- Tailwind v4 with Vite plugin (`vite.config.ts:7`). Global styles in `src/index.css`.
- UI primitives under `src/components/ui/*` (buttons, inputs, dialogs, table, toast, etc.).
- Layout components under `src/components/layouts/*` (data table, error fallback, dashboard widgets, AI chat, etc.).
- Theme context: `src/contexts/ThemeContext.tsx` used in `src/App.tsx:221`.

## 8. SEO

- Static SEO: `SEOWrapper` (`src/components/SEO/SEOWrapper.tsx`) supports meta tags, OG, Twitter, canonical, and structured data.
- Dynamic SEO: `useSEO` (`src/hooks/useSEO.ts`) updates meta per route; preconfigured titles and descriptions (`src/hooks/useSEO.ts:36`).
- Title format and robots guidance in `docs/SEO_IMPLEMENTATION.md`.

## 9. Features & Pages Map

- Dashboard: `src/pages/DashboardPage.tsx`.
- Solicitation: listing, details, proposal submission/edit/details (`src/pages/SolicitationManagementPage/*`).
- Vendors: listing and details (`src/pages/VendorManagementPage/*`).
- Evaluations: management and detail flows (`src/pages/EvaluationManagementPage/*`).
- Invitations, Companies, Admin Management, Subscriptions, System Log, Portal Settings, Communication, Profile.
- Static pages: Privacy Policy, Terms & Conditions, Disclaimer, Contact Us.

See route paths in `src/routes/index.tsx` for exact URLs.

## 10. AI Chat Integration

- `AIChatWidget` enabled for eligible users (`src/App.tsx:228`).
- Message handlers for standard and streaming responses: `src/App.tsx:42` and `src/App.tsx:133`.
- Endpoint: `https://dev.swiftpro.tech/chat` with token and SSE support.

## 11. Testing

- Playwright config: `playwright.config.ts` (dev server auto-start, device matrix, HTML reporter).
- Scripts: `npm test`, `npm run test:headed`, `npm run test:ui`, feature-specific suites (e.g., `npm run test:companies`).
- Test guidance and structure: `docs/TESTING.md` and feature-local `__tests__` directories under `src/pages/**`.

## 12. Build & Tooling

- Vite + React plugin (`vite.config.ts`), Tailwind plugin.
- TypeScript strict config in `tsconfig.app.json`.
- ESLint via `npm run lint`.

## 13. Conventions

- Path alias `@/` for imports.
- Page-specific components under `src/pages/<Feature>/components`.
- Shared UI under `src/components/ui` and shared layouts under `src/components/layouts`.
- HTTP calls should use wrapper functions in `src/lib/axiosInstance.ts` rather than direct Axios use.
- Tests colocated with features under `__tests__`.

## 14. Data Flow Summary

- Router renders layouts and pages (`src/routes/index.tsx`).
- Protected routes check auth via `AuthorityGuard` (`src/components/layouts/AuthorityGuard/index.tsx:24-31`).
- Components use React Query hooks for data requests and caching.
- HTTP helpers call backend with auth header; `401` resets auth.
- Role logic informs UI capabilities via `useUserRole`.

## 15. Troubleshooting

- Unauth resets: Verify `token` and `VITE_API_BASE_URL` if frequent `401` occurs.
- CORS/network: Check backend CORS and base URL; `withCredentials` is `false` by default.
- Env changes: Restart dev server after updating `.env`.
- Playwright failures: Ensure dev server is reachable at `http://localhost:5173` or set `E2E_BASE_URL`.

## 16. Handover Checklist

- Verify `.env` contains `VITE_API_BASE_URL`.
- Run `npm run dev`, confirm routes load and guard correctly.
- Execute `npm run lint` and `npm test` locally.
- Review `src/lib/axiosInstance.ts` for base URL and interceptors.
- Confirm role-based behavior with `useUserRole`.
- Align SEO with `SEOWrapper` or `useSEO` per page.

## 17. Notable Code References

- Config base URL: `src/config/index.ts:2`.
- Axios auth header and 401 handling: `src/lib/axiosInstance.ts:16-41`.
- Route map: `src/routes/index.tsx:43-330`.
- Protected route wrapper: `src/routes/PrivateRoute.tsx:8-9`.
- Auth guard: `src/components/layouts/AuthorityGuard/index.tsx:24-32`.
- Query client defaults: `src/App.tsx:28-34`.
- AI chat handlers: `src/App.tsx:42-131`, `src/App.tsx:133-218`.

## 18. Roadmap & Improvements

- Refresh token flow in Axios interceptors.
- Centralized error handling and Sentry DSN configuration.
- Consolidate API types under `src/types.ts` and unify validators.
- Expand authorization beyond basic auth to fine-grained `authorities`.
- Decompose very large feature pages for maintainability and performance.
- Increase and stabilize Playwright coverage across all features.

## 19. Related Documentation

- `README.md` (overview and onboarding pointers)
- `docs/DEVELOPER_ONBOARDING.md` (deep architecture and workflows)
- `docs/SEO_IMPLEMENTATION.md` (SEO standards and usage)
- `docs/AI_CHAT_INTEGRATION.md` (chat integration details)
- `docs/TESTING.md` (testing strategy and scripts)

---

For questions or improvements, follow existing patterns and open a PR with proposals and accompanying tests.