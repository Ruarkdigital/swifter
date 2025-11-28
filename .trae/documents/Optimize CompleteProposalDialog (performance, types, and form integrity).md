## Goals
- Reduce unnecessary re-renders and redundant form writes
- Strengthen typing and remove `any`
- Make subtotal/total calculations derived, consistent, and resilient
- Simplify add/remove logic to rely on field-array semantics rather than manual unregisters

## Key Findings
- Frequent `setValue` calls in `usePersist` can thrash renders
- `totalAmount` duplicates form state (`total`) and risks drift
- Heavy manual `control.unregister` usage is brittle and likely redundant with `useFieldArray`
- Many `any` types with repeated string paths make the code error-prone
- Handlers are recreated each render and not memoized

## Changes
- Strong typing: introduce `PriceSubItem`, `PriceActionItem`, and type `FormValues.priceAction`
- Derived totals: compute `item.subtotal` and overall `total` from `watch('priceAction')` via `useMemo`
- Minimized writes: only update `subtotal` and `total` when their numeric inputs change, and batch updates with `{ shouldDirty: false, shouldValidate: false }`
- Simplified removal: rely on `useFieldArray.remove` for items; use `update(itemIndex, nextItem)` for sub-items instead of `setValue('priceAction', [...])`; remove most manual `unregister` calls
- Stable handlers: wrap `addItem`, `removeItem`, `addSubItem`, `removeSubItem`, and `handleComplete` with `useCallback`
- Memoized helpers: `calculateItemSubtotal`, `calculateTotal`, and currency formatting via `useMemo`
- Initialization: on open, initialize `subtotal` and `total` once if existing data is present (guarded by open state)

## Implementation Steps
1. Add TypeScript interfaces for `PriceSubItem` and `PriceActionItem`; update props and helpers to use them
2. Replace `totalAmount` local state with `const priceAction = watch('priceAction')`; compute `const totalAmount = useMemo(() => calculateTotal(priceAction), [priceAction])`
3. Refactor `usePersist` handler to batch-recompute affected `subtotal`s and `total`, using `setValue` with `{ shouldDirty: false, shouldValidate: false }`
4. Update `removeItem` to only call `remove(index)` and recalc totals; drop manual `unregister` calls
5. Rewrite `removeSubItem` to `update(itemIndex, { ...item, subItems: subItems.filter((_, i) => i !== subItemIndex) })`, then recompute that item’s subtotal and overall total; drop manual `unregister` calls
6. Memoize event handlers and calculation helpers with `useCallback`/`useMemo`
7. Use the watched `totalAmount` for display; keep writing `setValue('total', totalAmount, { shouldDirty: false })` to persist
8. Add a guarded `useEffect` on dialog open to prefill `subtotal`s and `total` when existing data is present

## Verification
- Create items/sub-items; change quantities/prices; confirm subtotals and total update instantly
- Remove items/sub-items; confirm totals recompute and no residual registered fields remain
- Stress test with 50+ rows to observe smoother renders
- Confirm no prop-types or TypeScript errors and existing UI remains unchanged

## Notes
- All UI layout remains intact; only logic and typing change
- Leverages existing `Forger`/`ForgeControl` patterns and ShadCN components
- No backend changes and no new components introduced