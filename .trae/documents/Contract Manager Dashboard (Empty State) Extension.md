## Goal

Implement the Contract Manager dashboard (Empty State) with 100% design accuracy, as an extension of the current role‑based dashboard without affecting existing roles or layouts.

## Current Architecture

* Route shell: [Dashboard layout](file:///c:/Users/USER/Documents/GitHub/swifter/src/layouts/Dashboard.tsx)

* Entry page: [DashboardPage](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/DashboardPage.tsx)

* Role-based renderer: [RoleBasedDashboard](file:///c:/Users/USER/Documents/GitHub/swifter/src/components/layouts/RoleBasedDashboard/index.tsx)

* Role hook/config: [useUserRole](file:///c:/Users/USER/Documents/GitHub/swifter/src/hooks/useUserRole.ts), [dashboardConfig](file:///c:/Users/USER/Documents/GitHub/swifter/src/config/dashboardConfig.ts)

* Widgets: [StatsCard](file:///c:/Users/USER/Documents/GitHub/swifter/src/components/layouts/RoleBasedDashboard/components/StatsCard.tsx), [ActivityCard](file:///c:/Users/USER/Documents/GitHub/swifter/src/components/layouts/RoleBasedDashboard/components/ActivityCard.tsx), [ChartCard](file:///c:/Users/USER/Documents/GitHub/swifter/src/components/layouts/RoleBasedDashboard/components/ChartCard.tsx)

## Implementation Outline

1. Add a dedicated `contractManagerConfig` in dashboardConfig with exact tile order/labels:

   * All Contracts, Active Contracts, Draft Contracts, Suspended, Expired, Terminated

   * Total Contract Value, Committed vs Actual Value, Savings Realized

   * Upcoming Renewals (with a 30‑day filter), High Risk Contracts, Holdbacks

   * Two activity panels: “My Actions” and “General Updates”
2. Map `contract_manager` role explicitly in `getDashboardConfig(role)` to return `contractManagerConfig` (do not alias to `procurementConfig`).
3. Extend `useUserRole` to include `isContractManager` convenience flag (no breaking changes to other roles).
4. Enhance `RoleBasedDashboard` with optional UI features driven by config:

   * Header tabs: `primaryTabs: ["Overview", "Analytics"]`, `secondaryTabs: ["Total Contracts", "YTD Contracts"]`; render only if present.

   * Export button: `showExport: true` to render a top‑right action.

   * Stats grid remains as is, but support an optional per‑tile `filterOptions` and `filterValue` (used by Upcoming Renewals).

   * Activity rows render via existing `ActivityComponent` with empty‑state placeholders when lists are empty.
5. Style accuracy:

   * Use existing shadcn `Card`, spacing, and grid utilities to match paddings, rounded corners, icon badges, and muted captions per design.

   * Map icon colors: green for positive (Active), red for negative (Expired/Terminated/Suspended), neutral for others.
6. Data handling (Empty State):

   * Provide placeholder zeros/text via config for now; no new API calls.

   * When backend endpoints exist, wire via `useDashboardData` and `DashboardDataTransformer` without changing schemas.

## File Changes (non‑breaking)

* Update: [dashboardConfig.ts](file:///c:/Users/USER/Documents/GitHub/swifter/src/config/dashboardConfig.ts)

  * Add `contractManagerConfig`, `primaryTabs`, `secondaryTabs`, `showExport`, and per‑tile `filterOptions` support.

* Update: [useUserRole.ts](file:///c:/Users/USER/Documents/GitHub/swifter/src/hooks/useUserRole.ts)

  * Add `isContractManager`; route `contract_manager` to new config.

* Update: [RoleBasedDashboard/index.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/components/layouts/RoleBasedDashboard/index.tsx)

  * Read optional tabs + export flag from config.

  * Render tab selectors; guard with null checks so other roles remain unchanged.

  * Handle per‑tile filters; keep existing stats grid behavior.

* Update: [StatsCard.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/components/layouts/RoleBasedDashboard/components/StatsCard.tsx)

  * Support optional compact `Select` for `filterOptions` on a tile.

* No changes: routing, layout shell, SEO wrappers, API layer.

## Verification

* Visual check: compare spacing, typography, tile order, icon badges, and footer links against design.

* Accessibility: tab focus order for Overview/Analytics and Total/YTD; buttons labeled; export actionable.

* Non‑regression: load each role (super admin, company admin, evaluator, vendor, procurement) to confirm identical UI as before.

## Deliverables

* Contract Manager dashboard (Empty State) screens accessible when `userRole === "contract_manager"`.

* Exact tile layout and dual activity panels with export button and tab selectors.

* Zero impact on existing dashboards; new features render only when provided by config.

