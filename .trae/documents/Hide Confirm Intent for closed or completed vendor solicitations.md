## Goal
- In vendor solicitation table, hide the "Confirm Intent" action when status is closed or completed.

## Approach
- Update the vendor columns actions cell in `src/pages/SolicitationManagementPage/index.tsx`.
- Use existing `normalizeStatus` from `src/lib/solicitationStatusUtils.ts` to check for "closed" or "completed".
- Extend `canShowConfirmButton` to include `!isClosedOrCompleted`.

## Changes
1. Import `normalizeStatus` in `index.tsx`.
2. In vendor `actions` cell, compute `const normalizedStatus = normalizeStatus(row.original.status)`.
3. Compute `const isClosedOrCompleted = normalizedStatus === "closed" || normalizedStatus === "completed"`.
4. Update `canShowConfirmButton` to:
   - `isPublic && !isDeadlinePast && !isClosedOrCompleted && (!hasVendor || isInvited)`.

## Verification
- For vendor rows with status closed/completed, the confirm intent button does not render.
- For active/published or evaluating statuses, existing logic applies and the button shows only if not past deadline and invited/public as before.
- No impact on procurement tables or other actions.