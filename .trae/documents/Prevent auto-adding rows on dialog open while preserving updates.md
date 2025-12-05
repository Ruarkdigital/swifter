## Issue Summary
- Each time `CompleteProposalDialog` opens, a blank item row is added.
- This is caused by the field-array being unregistered on unmount; on re-mount the forge `useFieldArray` initializes the array and ends up with a new row when the array is missing.
- We must stop this auto-add while keeping existing details updating and the manual unregister on item/sub-item removal.

## Approach
- Persist the field-array across dialog open/close by disabling array-level unregistering; keep manual unregistering only for remove actions.
- Ensure initial array is an empty array when truly missing, not a pre-populated item.
- Keep subtotal/total derived updates intact.

## Steps
1. Change `shouldUnregister` default to `false` in `CompleteProposalDialogProps` and pass `shouldUnregister: false` to `useFieldArray` so the array is not cleared on dialog unmount.
2. Add a guard on open: if `getValue().priceAction` is `undefined`, set it to `[]` with `{ shouldDirty: false, shouldValidate: false }` to avoid any implicit item creation.
3. Keep existing `useEffect` subtotal/total synchronization; it only recomputes for existing items and does not append new ones.
4. Retain manual unregister in `removeItem` and `removeSubItem` to ensure removed fields are cleared and do not rehydrate.

## Verification
- Open/close the dialog multiple times without interacting; confirm no new item rows appear.
- Add items/sub-items and update numeric fields; verify subtotals/total update and persist across dialog toggles.
- Remove items/sub-items; ensure they do not reappear and array indices remain consistent.