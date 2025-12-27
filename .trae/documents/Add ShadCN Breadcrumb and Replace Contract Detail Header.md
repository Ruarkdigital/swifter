## Scope
- Create a ShadCN-style Breadcrumb component under `/src/components/ui/breadcrumb.tsx` (Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage).
- Replace the manual header div at `src/pages/ContractManagementPage/ContractDetailPage.tsx:19-25` with the new Breadcrumb.

## Implementation
- Breadcrumb component: forwardRef wrappers, semantic markup (`nav` + `ol`), accessible links, separators with `aria-hidden`.
- Styling: muted grey text for inactive items, strong text for current page, spacing consistent with the page; default gap and responsive behavior.
- ContractDetailPage usage:
  - `Contracts` → link to `/dashboard/contract-management`
  - `Contract Details` → non-link item
  - Current page → `Construction Services Agreement` as `BreadcrumbPage`.

## Verification
- Page renders with the breadcrumb visually matching the existing style.
- Links navigate correctly without altering layout.
- No backend logic added; strictly UI.
