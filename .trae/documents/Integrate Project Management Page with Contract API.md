## Scope

Implement API integration for `src/pages/ProjectManagementPage/index.tsx` using documented endpoints in `docs/API_DOCUMENTATION_PHASE_2.md` and the existing HTTP abstraction (`getRequest`, `postRequest`, `patchRequest`). No dev-server changes.

## Endpoints

* List: `GET /contract/projects?name&date&status&limit&page`

* Stats: `GET /contract/projects/stats`

* Create: `POST /contract/projects`

* Complete: `PATCH /contract/projects/{projectId}/complete`

## Types

* Create input: `{ name: string; category: string; description?: string; startDate?: string; endDate?: string; budget: number; allowMultiple: boolean }`

* Project: `{ _id, name, category, description, startDate, endDate, budget, status, allowMultiple, createdAt, updatedAt }`

* Stats: `{ all, active, completed, cancelled }`

## Hooks (new)

Create `src/pages/ProjectManagementPage/services/useProjectApi.ts`:

* `useProjectsList(params)` → fetch list; builds `URLSearchParams`; returns `data` array exactly as API shape.

* `useProjectsStats()` → fetch stats.

* `useCreateProject()` → mutation posting API payload; maps form `allowMultipleContracts` → `allowMultiple`; invalidates `projects-list` and `projects-stats`.

* `useCompleteProject()` → mutation to mark complete; invalidates `projects-list`.

## UI Integration

* Update `index.tsx`:

  * Replace local `projects` state with `const { data: projectsData } = useProjectsList({ page: 1, limit: 10 });` and pass transformed rows to `ProjectsTable`:

    * Map API project → table row: `id=_id`, `name`, `budget` formatted (e.g., currency), `startDate/endDate` formatted ISO→date, `status` direct; leave `code/totalSpend/eac` undefined.

  * Wire `StatsCards` to accept props: `{ all, active, completed }` from `useProjectsStats()`; if unavailable, default `0`.

  * Keep EmptyState rendering based on `projects?.length === 0`.

  * Pass `onSuccess` from `CreateProjectDialog` to call `useCreateProject().mutate` and on success show `SuccessAlert` and refetch list.

## Component Adjustments

* `StatsCards.tsx` → accept `counts?: { all:number; active:number; completed:number; cancelled?:number }` via props; no layout changes.

* `CreateProjectDialog.tsx` → accept optional `onSubmit` prop; map form fields to API shape; do not reshape other fields; call mutation; close on success.

## Error Handling

* Use interceptor behavior (401 resets auth). Show minimal inline error message on failed create (e.g., `Validation failed`). No custom toast unless existing component is present.

## Verification

* With valid token, list and stats load; totals display correctly and table renders rows.

* Create mutation adds a project; list and stats refresh.

* Completing a project updates status in table after refetch.

## Conformance

* Uses only documented endpoints and fields.

* Uses shared `DataTable` and existing UI components.

* No layout modifications; all changes scoped to Project feature.

## Deliverables

* New hook file `useProjectApi.ts`.

* Modified `ProjectManagementPage/index.tsx`, `components/StatsCards.tsx`, `components/CreateProjectDialog.tsx` to wire hooks, props, and payload mapping.

