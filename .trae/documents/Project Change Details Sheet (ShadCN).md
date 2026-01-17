## Scope
- Add a ShadCN Sheet that shows "Change Details" for a selected project.
- Wrap the Sheet trigger around the actions button at `src/pages/ProjectManagementPage/components/ProjectsTable.tsx#L67-69` so clicking the actions icon opens the sheet.
- UI-only per project rules: static placeholders, no backend calls, no layout changes.

## Files
- Add `src/pages/ProjectManagementPage/components/ChangeDetailsSheet.tsx` (Sheet with Overview + Comments tabs).
- Update `src/pages/ProjectManagementPage/components/ProjectsTable.tsx` to import the sheet and wrap the actions button in `Sheet`/`SheetTrigger`.

## Sheet UI
- Header: back icon (optional), title `Change Details`, right-side `Export` button.
- Tabs: `Overview` (active), `Comments`.
- Overview grid (left/right columns):
  - Change Title, Change Type, Submission Date, Submitted by (link-like style), Vendor/Contractor (link-like style), Value (bold), Status (badge: Pending)
  - Description paragraph (muted text)
  - Attached Documents: four doc cards (Word/PDF icons, filename, type+size, small action icons placeholders)
- Footer actions: `Reject Change` (outline), `Approve Change` (primary).
- Visuals: rounded 2xl content, spacing and typography consistent with design; width ~`max-w-2xl` or `max-w-3xl`.

## Test Hooks
- Add `data-testid="change-details-sheet"` on content, plus `approve-change-button` and `reject-change-button` for future tests.

## Compliance
- Use `@/components/ui/sheet`, `@/components/ui/button`, `@/components/ui/tabs` (if present; else simple segmented controls).
- Keep the existing DataTable and page structure unchanged.
- No fabricated API logic; static text only.

## Verification
- Clicking the actions icon in any row opens the sheet.
- Overview tab shows all labeled fields and documents grid.
- Footer buttons are visible and styled appropriately.