## Scope
- Fetch project details and linked contracts using documented endpoints.
- Replace static content and sample rows with real data.
- Add completion action via PATCH endpoint.
- Implement UX states: loading, empty, and error handling.

## API Endpoints
- GET `projects/{projectId}` → project detail
- GET `projects/{projectId}/contracts` → linked contracts
- PATCH `projects/{projectId}/complete` → mark project complete
- Use `getRequest`, `patchRequest` from `src/lib/axiosInstance.ts` and React Query.

## New Hooks
- Create `src/pages/ProjectManagementPage/hooks/useProjectApi.ts`:
  - `useProjectDetail(projectId)` → returns `{ data, isLoading, isError }`
  - `useProjectContracts(projectId)` → returns `{ data, isLoading, isError }`
  - `useCompleteProject(projectId)` → `useMutation` with success/error toasts and `invalidateQueries` for project and contracts.
  - Use `useUserQueryKey` for stable keys.

## ChangeDetailsSheet Props
- Extend to `type Props = { trigger: React.ReactNode; projectId: string }`.
- Keep backward compatibility: if `projectId` is missing, render placeholders and no API calls.

## Overview Tab Binding
- Title `Project Details` remains static.
- Replace hard-coded "Additional structural reinforcement" with `project.name`.
- Map fields per schema:
  - `Project Name` → `project.name`
  - `Project Category` → `project.category`
  - `Submission Date` → `project.createdAt` (formatted)
  - `Created by` → `project.creator` (ID only unless a user name API exists; show as plain text)
  - `Budget` → `project.budget` (formatted)
  - `EAC` → omit (not in schema)
  - `Status` → badge from `project.status` (active/completed/cancelled)
  - Description → `project.description`
- Attached Documents section: hide (not documented in schema).
- Loading: show `Skeleton` blocks for each label while `isLoading`.
- Error: show inline message with retry button (`refetch`).

## Linked Contract Tab Binding
- Replace `linkedSampleRows` with data from `useProjectContracts(projectId)`.
- Columns adapted to available fields:
  - `Contracts` → `title` (no code subtext)
  - `Vendor` → `vendor` (string returned)
  - `Value` → `totalAmount` with currency if available, otherwise `-`
  - `Owner` → `creator` or `-`
  - `Date` → `startDate` / `endDate` formatted
  - `Status` → badge for `draft | pending_approval | active | completed | cancelled`
  - `Actions` → link to `/dashboard/contract-management/{_id}`
- Connect `LinkedContractsHeader` search to client-side filter on `title`.
- Loading: use `DataTable` `options.isLoading` to show skeleton rows.
- Empty: show `EmptyState` component.
- Error: inline message and retry.

## Actions
- Wire `Mark As Complete` button to `useCompleteProject` mutation.
  - Disable if `project.status === 'completed'`.
  - On success: toast “Project marked as complete”, update badge, invalidate relevant queries.
  - On error: toast with message.

## Formatting & Utilities
- Date formatting via `formatDateTZ` if available; otherwise use `new Date().toLocaleDateString()` with timezone-safe helper already present.
- Currency formatting via existing utils or simple `Intl.NumberFormat` if no helper exists.

## Tests & Verification
- Manual verify in UI:
  - Overview tab shows fetched values; status badge updates after completion.
  - Linked Contract tab loads skeleton → rows → handles empty/error.
  - Header search filters client-side.
- No server start; uses existing dev server base URL via config.

## Deliverables
- New hook file `useProjectApi.ts`.
- Updated `ChangeDetailsSheet.tsx` to consume hooks and remove sample data.
- Non-breaking: if `projectId` is not provided, component renders placeholders without API calls.

## Notes
- Strictly follow project rules: only documented fields, use API abstraction, no fabricated data, keep layout consistent.