## Scope
Implement targeted accessibility fixes to meet WCAG 2.1 AA across navigation, forms, imagery, color contrast, landmarks, and focus management. Changes are limited to existing components and pages.

## Navigation & Keyboard Operability
- Replace clickable `span` elements used for navigation with semantic `Link` or `button` (Breadcrumbs).
- Add keyboard operability (role, tabIndex and Enter/Space handlers) only where semantics cannot be changed.
- Files:
  - `src/pages/SolicitationManagementPage/SolicitationDetailPage.tsx` (breadcrumb spans → `Link`/`button`).

## Color Contrast
- Audit and adjust low-contrast classes to conform to AA (≥4.5:1):
  - Replace `text-white/80`, `text-gray-400`, `text-gray-500` on light backgrounds with higher contrast variants.
  - Files:
    - `src/layouts/Sidebar.tsx` (menu text and footer color tokens)
    - Headings and muted text in cards where necessary (spot fixes only).

## Images & Avatars
- Ensure all images have appropriate `alt`:
  - Decorative: `alt=""` or `aria-hidden` where applicable.
  - Informative: meaningful `alt`.
- Files:
  - Components that render `AvatarImage` and inline `<img>` (keep login logo as-is with alt; add alt to others).

## Forms: Error Identification & Feedback
- Ensure invalid inputs set `aria-invalid="true"` and associate error text via `aria-describedby`.
- Use `role="alert"` for inline validation messages where needed.
- Files:
  - `src/components/layouts/FormInputs/TextInput.tsx` and form containers that render errors (Forge/Forger usage).

## Landmarks & Bypass Blocks
- Add a global skip link: `Skip to main content` at the top of the layout.
- Ensure `main`, `nav`, and `header` landmarks are present in primary layouts.
- Files:
  - `src/layouts/Sidebar.tsx` (nav landmark)
  - Top-level app shell/layout (add skip link and `main`).

## Focus Management
- Ensure visible focus for buttons/links in light/dark modes (verify `focus-visible` rings).
- Avoid removing outlines; standardize focus styles on interactive components.
- Files:
  - `src/components/ui/button.tsx`, `Link` usages in pages.

## Live Regions (Feedback)
- Ensure toast/success/error messages are announced:
  - Wrap toast root with `aria-live="polite"` or use existing library ARIA hooks.
- Files:
  - Toast handler container integration.

## Testing & Verification
- Automated: integrate `axe-core` checks into Playwright flows for key pages (Login, Solicitation Detail, Evaluation Detail, Submitted Document).
- Manual: keyboard-only navigation, screen-reader label/role checks, contrast verification.

## Change Strategy
- Minimal, scoped edits following existing patterns.
- No layout redesign; only semantic fixes and ARIA/color adjustments.
- Provide concise diffs per file with just-necessary changes.

## Deliverables
- Updated components/pages with semantic/ARIA fixes.
- Skip link and landmarks.
- Contrast-safe tokens in Sidebar and key areas.
- Axe report for target routes.
