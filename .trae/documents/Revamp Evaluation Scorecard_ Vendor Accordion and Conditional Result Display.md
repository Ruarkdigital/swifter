## Objective
- Update `CriteriaScorecardSheet.tsx` to:
  - Remove the Status column from the grid.
  - Replace the DataTable with an Accordion grouped by Vendor.
  - Within each vendor accordion, render criteria with a unified Result field:
    - If `evaluationCriteria.criteria.status === "pass_fail"` → show Pass/Fail.
    - If status is `"weight"` → show numeric score.
  - Keep evaluator info and comment per entry, shown inside each criterion card.

## Files
- Update: `src/pages/EvaluationManagementPage/components/CriteriaScorecardSheet.tsx`

## Data & Logic
- Current row item shape (from API):
  - `evaluationCriteria.criteria.status`: string (`"pass_fail" | "weight"`)
  - `scoring.weight`: number (the evaluator's scored value for weighted criteria)
  - `evaluationCriteria.criteria.weight`: number (the criterion configured weight)
  - `scoring.pass_fail`: string ("Pass" | "Fail")
  - `vendor.name`, `evaluator.name`, `comment`
- Group rows by vendor key:
  - Key: `vendor._id` (fallback to `vendor.name`)
  - Value: `{ vendorName, items: ScoreCardItem[] }`
- For each criterion item:
  - `isPassFail = evaluationCriteria?.criteria?.status === 'pass_fail'`
  - Result rendering:
    - Pass/Fail: derive label from `scoring.pass_fail`; show styled badge (green for Pass, red for Fail)
    - Weighted: show numeric score from `scoring.weight` (fallback to `-`)
  - Optionally show configured weight under helper text: `evaluationCriteria.criteria.weight`
  - Show evaluator name and comment inside the card

## UI Changes
- Remove DataTable, expand button, and table columns.
- Import Accordion components from `@/components/ui/accordion`.
- Layout:
  - Sheet header remains unchanged.
  - Body: Accordion (`type="single" collapsible`) where each `AccordionItem` is a vendor.
  - `AccordionTrigger`: vendor name.
  - `AccordionContent`: map each criterion as a bordered card:
    - Title (criterion/evaluationCriteria id or a readable title if available)
    - Grid with:
      - Label: Result → conditional content (badge for pass/fail, numeric for weighted)
      - Helper: Weight (configured) if available
      - Evaluator name
      - Comments

## Implementation Steps
1. Replace `DataTable` block with Accordion structure.
2. Build groups via `Map` keyed by `vendor._id || vendor.name || idx`.
3. Render criterion cards using conditional rendering for Result.
4. Remove `columns` array and any references to Status.
5. Keep existing query, sorting of rows by evaluator for a stable presentation within vendor groups.

## Edge Cases
- Missing `vendor.name`: fallback to "Vendor".
- Missing `scoring.weight` or `scoring.pass_fail`: render `-`.
- If no rows: show "No scores available" placeholder.

## Validation
- Check a mix of `pass_fail` and `weight` items:
  - Pass/Fail shows correct labels with colors.
  - Weighted shows numeric scores; weight helper displays configured weight.
- Ensure accordion interaction works and the sheet remains responsive.
- Confirm comments render within each criterion.

## Rollback Plan
- If needed, restore the original DataTable, columns, and expand behavior from current file version.