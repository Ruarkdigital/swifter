## Scope
- Implement Contract Management Empty State page with large icon stats cards and centered CTA.
- Add route `/dashboard/contract-management`; use ShadCN components and follow project rules.

## Files
- `src/pages/ContractManagementPage/index.tsx`
- `src/pages/ContractManagementPage/components/StatsCards.tsx`
- `src/pages/ContractManagementPage/components/EmptyState.tsx`
- Update `src/routes/index.tsx` to register the route.

## UI Details
- Header actions: `Export` (outline) and `+ Create Contracts` (primary).
- Stats grid (large icons inside muted/tinted circles):
  - All Contracts (0, grey)
  - Active Contracts (0, green)
  - Draft Contracts (0, grey)
  - Suspended (0, red)
  - Expired (0, red)
  - Terminated (0, red)
  - Pending Approval (0, grey/yellow badge style)
- Empty state:
  - `FolderOff` icon
  - Title `No Contracts Yet`
  - Supporting description text as in design
  - CTA button `+ Create Contract`

## Test IDs
- `contracts-stats-all`, `contracts-stats-active`, `contracts-stats-draft`, `contracts-stats-suspended`, `contracts-stats-expired`, `contracts-stats-terminated`, `contracts-stats-pending`
- `create-contracts-button`, `empty-state`, `create-contract-cta`

## Compliance
- Use existing `Card`, `Button`, and `lucide-react` icons.
- No API integration; static counts only.
- Keep layout unchanged and SEO configured.

## Verification
- Visit `/dashboard/contract-management`: stats cards show large icons and zero counts; empty state visible with CTA.
