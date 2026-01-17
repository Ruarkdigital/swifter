## Scope
- Render the populated Contract Management page with large-icon stats, filters, tabs, and a non-empty table using the shared DataTable.
- Keep logic UI-only (static data) until documented APIs are available.

## Files
- Add `src/pages/ContractManagementPage/components/ContractsTable.tsx` (DataTable with filters, status badges, pagination, actions)
- Add `src/pages/ContractManagementPage/components/TabsBar.tsx` (segmented controls: All Contracts / My Contracts)
- Update `src/pages/ContractManagementPage/index.tsx` to render tabs + table beneath existing stats and actions

## Stats Cards (Large Icons)
- Reuse `StatsCards.tsx` but keep the large, nested circle icon style already implemented.
- Accept optional `counts` props so page can pass values (e.g., All: 52, Active: 11, Draft: 52, Suspended: 52, Expired: 52, Terminated: 52, Pending: 52).

## Table (DataTable)
- Columns: `Contracts`, `Vendor`, `Value`, `Owner`, `Date`, `Status`, `Actions`
- `Contracts` cell: title + code (small muted text); link-style for future navigation
- `Vendor`: company name
- `Value`: bold currency formatting when present, dash otherwise
- `Owner`: person name
- `Date`: published and end date stacked, small text
- `Status`: badge tones (Active: green, Draft: gray, Expired: red, Terminated: red, Suspended: red)
- `Actions`: menu trigger wrapped with the `ChangeDetailsSheet` implemented previously

## Filters & Tabs
- Tabs bar above table: `All Contracts` (active), `My Contracts`
- Header controls:
  - Search input `data-testid="search-input"`
  - Filter dropdowns:
    - Date (`data-testid="date-filter"`)
    - Status (`data-testid="status-filter"` with item `status-active`)
    - Category (`data-testid="category-filter"` with item `category-software`)

## Pagination (UI-only)
- Footer with `Previous`, `Next`, and page indicator (e.g., "Page 1 of 10") using DataTable options

## Test Hooks
- Table wrapper: `projects-table` (reuse naming consistency) or `contracts-table` (preferred)
- Row action: `project-actions-dropdown` (already used by sheet trigger)
- Status badge: `contract-status-badge`

## Implementation Notes
- Use `@/components/layouts/DataTable` and ShadCN UI primitives (`button`, `dropdown-menu`, `badge`, `input`)
- Keep counts and rows as static constants within the page until APIs are documented
- Do not alter layout; preserve header actions and spacing

## Verification
- Visiting `/dashboard/contract-management` shows large-icon stats with non-zero counts, tabs, filters, and a populated table matching the design
- Clicking the actions icon opens the `Change Details` sheet