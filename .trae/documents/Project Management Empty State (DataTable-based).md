## Scope
- Render DataTable when `projects.length > 0`; otherwise render the built-in empty placeholder with "No projects found".
- Keep UI-only; no backend calls. Prepare state so future integration can supply real data.

## Files
- Add `src/pages/ProjectManagementPage/components/ProjectsTable.tsx` to encapsulate the table with columns and header controls.
- Update `src/pages/ProjectManagementPage/index.tsx` to hold `projects` state and pass it to `ProjectsTable`.

## Implementation
- Page state:
  - `const [projects, setProjects] = useState<Project[]>([])` (initially empty)
  - Pass `projects` to `ProjectsTable`.
- In `ProjectsTable`:
  - Use `/components/layouts/DataTable`.
  - Provide column headers only; `data` prop receives `projects`.
  - Set `emptyPlaceholder` to a centered message with `data-testid="empty-state"` and text `No projects found`.
  - Table wrapper has `data-testid="projects-table"` so tests can detect table in both states.
- Header controls (UI-only):
  - Search input with `data-testid="search-input"`.
  - Status dropdown with `data-testid="status-filter"` and option `status-active`.
  - Category dropdown with `data-testid="category-filter"` and option `category-software`.

## Behavior
- When `projects` is empty: DataTable renders headers and `emptyPlaceholder` only.
- When `projects` has rows: DataTable renders rows and hides the empty placeholder automatically.

## Compliance
- Uses shared `DataTable` per project rules.
- No layout changes; header, stats, and actions remain.
- No backend calls or fabricated schemas.

## Verification
- Navigating to `/dashboard/project-management` shows empty placeholder by default.
- Providing any non-empty `projects` array (future integration) renders the full table with the defined columns and actions.