## Goal
- Update the scoring revision flow to consume and display fields exactly as defined in `Untitled-1#L1-69` (status/message/data), without reshaping.

## Scope
- Target the evaluator scoring page (`SubmittedDocumentPage.tsx`) where the “Revise Score” flow posts to `/evaluator/{evaluationId}/criteria-score/{criteriaId}/vendor/{vendorId}/revisit`.
- Parse the response to show backend-provided timestamps and messages.

## Changes
- Types: Define a `RevisitCriteriaScoreResponse` matching Untitled-1 (status: number, message: string, data: object). The `data` may include `submittedAt` and `revisedAt` (or similarly named fields), plus any scoring fields returned.
- Mutation: Update `useRevisitCriteriaScore` to return `RevisitCriteriaScoreResponse`. In `onSuccess`, use `response.data.message` for the toast and read `response.data.data.revisedAt` and `submittedAt` if present.
- UI: In Current Score block:
  - Show “Submitted at” from response when available.
  - Show “Revised at” from response when available.
  - Fall back gracefully when fields are missing.
- Behavior: Keep validation and form logic unchanged. Do not reshape payloads or response; only read documented fields.
- Error handling: Surface `response.message` or error messages consistently.

## Files
- `src/pages/EvaluationManagementPage/SubmittedDocumentPage.tsx` (types + mutation + UI display)

## Verification
- Revise a score; confirm toasts show server `message`.
- Confirm timestamps render when backend provides them.
- Ensure no layout changes beyond text lines in the Current Score section.
