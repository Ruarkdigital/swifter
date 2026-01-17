## Goal
Render Sidebar menu items dynamically based on the authenticated user’s allowed modules (`user.module: Modules`), including Contract Management, Solicitation Management, Vendor Management, and Evaluation Management. If `modules` is undefined, hide all gated menus.

## References
- Types: `src/types.ts:17-32` (Modules), `src/types.ts:35-56` (User with `module`)
- Sidebar: `src/layouts/Sidebar.tsx`
- Role hook: `src/hooks/useUserRole.ts:9-67`
- Auth store: `src/store/authSlice.ts:67-86`

## Implementation Steps
1. Import modules into Sidebar
- `import { useUser } from "@/store/authSlice";`
- `import { UserRole, Modules } from "@/types";`
- In `SideBar`, read: `const user = useUser(); const modules = user?.module;`.

2. Extend `getNavigationForRole`
- Signature: `getNavigationForRole(role: UserRole, currentPath: string, modules?: Modules)`.
- Pass modules: `getNavigationForRole(userRole, location.pathname, modules)`.

3. Gate items by module flags (including Evaluation)
- Procurement:
  - `Solicitation Management` → show only if `modules?.solicitationManagement === true`
  - `Vendor Management` → show only if `modules?.vendorManagement === true`
  - `Evaluation Management` → show only if `modules?.evaluationsManagement === true`
  - `Profile` → always
- Contract manager:
  - `Projects` → show only if `modules?.contractManagement === true`
  - `Contract Management` (and `Contracts`/`MSA` children) → show only if `modules?.contractManagement === true`
  - `Vendor Management` → show only if `modules?.vendorManagement === true`
  - `Profile` → always
- Company admin:
  - `Solicitation Management` → `modules?.solicitationManagement === true`
  - `Vendor Management` → `modules?.vendorManagement === true`
  - `Evaluation` → `modules?.evaluationsManagement === true`
  - `User Management`/`Profile` → not gated
- Vendor:
  - `Invitations` → not gated
  - `Solicitation Management` → `modules?.solicitationManagement === true`
  - `Profile` → always
- Evaluator:
  - `My Evaluation` → `modules?.evaluationsManagement === true`
  - `Profile` → always
- Super admin: keep system menus unchanged (not module-gated).

4. Hide when modules is undefined
- Treat `modules === undefined` the same as all flags `false`.
- Build items as `modules?.flag === true && { ... }` and filter with `filter(Boolean)`.

5. Preserve behaviors
- Keep `active` checks, children under `Contract Management`, and all styling.

## Testing & Verification
- Simulate users with:
  - `modules` undefined → all gated menus hidden across roles.
  - Specific flags true/false → only allowed menus appear.
- Verify no TypeScript errors and no rendering of `undefined` entries; active states work; children visible only when parent visible.

## Deliverables
- Updated `src/layouts/Sidebar.tsx` gating menus using `user.module` with strict `undefined`=hidden policy.

## Acceptance Criteria
- Menus appear only when the corresponding `user.module` flag is true.
- Evaluation menus respect `modules.evaluationsManagement`.
- If `modules` is missing, all module-gated menus are hidden.
- Visuals, order, and active indicators remain unchanged; no runtime errors.