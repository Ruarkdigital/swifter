## Goal
- Change weight-based scoring from 1–5 to 1–10 and add a tooltip legend explaining the mapping (1 = 10% … 10 = 100%).

## Files to Update
- `src/pages/EvaluationManagementPage/SubmittedDocumentPage.tsx`
- `src/components/ui/tooltip.tsx` (already present; just import and use)

## Implementation
- Radio choices: Replace `[1,2,3,4,5]` with `[1..10]` for the weight scoring `RadioGroup`.
- Prepopulate existing scores: Convert stored percent to radio value by dividing by `10` instead of `20`.
- Tooltip legend: Add a `TooltipProvider` + `Tooltip` near the weight `RadioGroup`, with content:
  - Scoring Legend
  - 1 = 10% of the weight … 10 = 100% of the weight
- Labels: Keep Low/High markers; optionally add small “Legend” icon/button as tooltip trigger.
- Payload: Preserve existing request shape (send numeric radio value for weight), consistent with current implementation.

## Verification
- Open an evaluation criteria in SubmittedDocument; verify radios show 1–10.
- Confirm existing stored weight (e.g., 80) pre-populates as 8.
- Hover/click the legend trigger shows the tooltip content.

## Non-goals
- Do not change backend scale or payload contract beyond the current numeric radio value behavior.
- No layout redesign; add only a small tooltip/trigger next to the radio group.