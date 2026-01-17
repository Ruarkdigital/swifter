## Scope
- Build the Project Management "Empty State" page for new Contract Manager users.
- Add Contract Manager role navigation in the Sidebar.
- Keep to existing architecture (Dashboard layout, ShadCN UI, Tailwind) and project rules.
- Do not integrate backend; static counts only for the design. Robots set to `noindex, nofollow`.

## Files & Routes
- Add page: `src/pages/ProjectManagementPage/index.tsx`
- Add components:
  - `src/pages/ProjectManagementPage/components/StatsCards.tsx`
  - `src/pages/ProjectManagementPage/components/EmptyState.tsx`
- Register route in `src/routes/index.tsx` under Dashboard children:
  - `path: "/dashboard/project-management"` → Protected route rendering `ProjectManagementPage`

## Sidebar (Contract Manager)
- Extend `UserRole` union in `src/types.ts` with `"contract_manager"`.
- Update `roleSpecificNavigation` in `src/layouts/Sidebar.tsx` to include Contract Manager menu items:
  - `Dashboard` (already global)
  - `Projects` → `"/dashboard/project-management"`
  - `Contract Management` → `"/dashboard/contract-management"`
  - `Vendor Management` → `"/dashboard/vendor"`
  - `Profile` → `"/dashboard/profile"`
- Optional: add role option in user creation and display mapping if present (`CreateUserDialog`, `getRoleDisplayName`).

## Page UI Details
- Use existing layout: `src/layouts/Dashboard.tsx` provides Sidebar, Header (title already maps to `Project Management`), Footer.
- Top actions (right side beneath header):
  - `Export` → `Button` (`variant="outline"`, icon `Share2` from `lucide-react`)
  - `+ Create Project` → `Button` (`variant="default"`, `size="lg"` with `Plus` icon)
- Section heading: `Projects` (`<h2>` styled as per design).
- Stats cards row (3 cards) using ShadCN `Card`:
  - All Projects: count `52`, icon in muted circle
  - Active projects: count `11`, icon circle tinted green
  - CompletedProjects: count `4`, icon circle tinted yellow
- Empty state block centered:
  - Icon `FolderOff` (muted)
  - Text `No Projects Yet`
  - CTA button `+ Create Projects`
- Add `data-testid` hooks for empty state and main actions:
  - `empty-state`, `create-projects-button`, `export-button`, `stats-all-projects`, `stats-active-projects`, `stats-completed-projects`

## Styling & Components
- Tailwind utility classes consistent with codebase; no new SCSS.
- Use ShadCN components: `Button`, `Card`, `Avatar` (Header already uses), `DropdownMenu` (Header already uses), `ScrollArea` within layout.
- Icons via `lucide-react` (`Share2`, `Plus`, `Folder`, `FolderOpen`, `FolderCheck`, `FolderOff`).
- Color tokens align with existing theme (`text-slate-700`, `bg-slate-50`, `bg-green-50`, `bg-yellow-50`, borders `border-slate-200`).

## SEO
- Include `<SEOWrapper />` at page top:
  - `title="Project Management - SwiftPro eProcurement Portal"`
  - `description="Manage projects efficiently. Create, track active work, and review completed tasks."` (≤160 chars)
  - `canonical="/dashboard/project-management"`
  - `robots="noindex, nofollow"`
  - Basic OG fields (`ogTitle`, `ogDescription`, `ogUrl`) using location.

## Accessibility
- Buttons, cards, and links have descriptive `aria-label`s.
- Colors meet contrast; icon-only buttons include labels.

## Verification
- Navigate to `"/dashboard/project-management"` renders:
  - Header title `Project Management`
  - Actions and stats cards match spacing and typography in the design
  - Centered empty state with CTA
- Sidebar shows Contract Manager menu; `Projects` highlighted when on the route.

## Assumptions
- Contract Manager users are assigned `userRole = "contract_manager"` by auth/state. If role assignment UI needs updates, will add role option mapping using current patterns.
- The broader table/filters/dialogs for Project Management are out-of-scope for this "Empty State" delivery and will be added in future tasks.
