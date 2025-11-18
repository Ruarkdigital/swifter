## Goal

* Create a side Sheet to display scores for a specific evaluation criterion.

* Fetch data from `/procurement/evaluations/{evaluationId}/criteria/{criteriaId}/score-card` using existing API utilities.

## UI/UX

* Add a button in the Criteria table Actions column: `View Scores`.

* On click, open a right-side Sheet showing a table of scorer entries:

  * Columns: `Vendor`, `Evaluator`, `Weight`, `Comment` `Score`  `Pass/Fail`

* Lazy-load data when the Sheet opens; show loading/error states using existing toaster.

## Data & API

* Use `getRequest` from `/lib/axiosInstance`.

* Query keyed by `evaluationId` + `criteriaId`; enabled when Sheet is open.

* Do not reshape or send extra fields; render response as-is.

## Files

* Add `src/pages/EvaluationManagementPage/components/CriteriaScorecardSheet.tsx`:

  * Props: `evaluationId: string`, `criteriaId: string`.

  * Uses `Sheet`, `SheetTrigger`, `SheetContent`; `useQuery` for fetch; `DataTable` for list.

* Update `src/pages/EvaluationManagementPage/EvaluationDetailPage.tsx`:

  * In the Criteria table Actions cell (`lines ~654–660`), add the new `CriteriaScorecardSheet` with `evaluationId` from route and `criteriaId` from `row.original._id`.

## Constraints

* Follow SwiftPro project rules: use provided API methods, add page-specific component, reuse `DataTable`.

* No layout changes beyond the new Sheet trigger in Actions.

## Verification

* Open Evaluation Criteria tab; click `View Scores` to load and render entries.

* Validate error handling and loading behavior; ensure no extra API calls when Sheet is closed.

