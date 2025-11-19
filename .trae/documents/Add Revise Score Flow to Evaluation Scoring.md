## Goal

* Add a “Revise Score” action to the evaluator scoring workflow that appears only after the initial submission, reopens the scoring UI with pre-populated values, allows edits, and resubmits via the provided revisit endpoint.

## Where to Integrate

* File: `src/pages/EvaluationManagementPage/SubmittedDocumentPage.tsx`

* Area: Per-criterion actions within the accordion content (existing buttons for Save/Update/Submit). This page already contains scoring form logic, submit mutations, and state flags indicating submission.

## UI Changes

* Show a `Revise Score` button when:

  * `isEvaluationSubmitted === true` (from API submissionStatus)

  * Criterion has an existing score (`criteriaItem.scoring?._id`)

* On click:

  * Call the revisit endpoint

  * Unlock editing for the selected criterion (set local `editingCriteriaId`)

  * Pre-populate fields using existing scoring (reusing current edit prefill logic)

* Visual cues:

  * Badge or label “Revised” next to score after resubmission

  * Keep original submission timestamp; append revision timestamp in the UI

## Data & API

* Add mutation `useRevisitCriteriaScore`:

  * POST `/evaluator/${evaluationId}/criteria-score/${criteriaId}/vendor/${vendorId}/revisit`

  * Use `postRequest` from `/lib/axiosInstance`

  * On success: show success toast, enable edit mode, invalidate/refetch criteria query

  * On error: show error toast and keep UI disabled

* Preserve validation and form rules by reusing existing form components and validators

## State & Validation

* Maintain the existing validation rules during editing

* Keep `submissionStatus` logic; allow edit only after successful revisit call for a specific criterion

* Preserve original submission timestamp; add revised timestamp display in the per-criterion summary block

## Testing

* Add scenarios to verify:

  * “Revise Score” renders only after initial submission

  * Revisit call payload and success path

  * Edge cases: empty scores, max values, invalid edits handled by validator

  * UI state transitions: submitted → revising → resubmitted; badges and timestamps update accordingly

## Files to Update

* `src/pages/EvaluationManagementPage/SubmittedDocumentPage.tsx` (mutation + UI)

* Optional minor updates to helper hooks if needed (no new APIs beyond provided endpoint)

## Non-Goals

* Do not alter layout beyond adding the single action button and revised status badge

* Do not reshape backend responses; render timestamps and flags as returned

