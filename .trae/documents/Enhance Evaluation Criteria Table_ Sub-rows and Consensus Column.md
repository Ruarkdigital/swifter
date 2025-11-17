## Goal

* Move each criterion’s description into a sub-row (expandable detail), removing the top-level Description column.

* Add a new Consensus column that shows Yes or No based on the API's true or false when progress is 100%; otherwise hide value.

## Changes

* Update `EvaluationDetailPage` criteria table columns:

  * Remove the `Description` column.

  * Add an expander column using the table’s built-in expander utility to toggle sub-rows.

  * Add a new `Consensus` column rendered from `row.original.consenus`(visible only at 100% of `row.original.progress`).

* Enable sub-row rendering on the criteria table:

  * Pass expansion options to the `DataTable` (`enableExpanding`, `getRowCanExpand`, `renderSubComponent`).

  * `renderSubComponent` shows the description and any supporting meta.

## Implementation Notes

* Add `consensus ` to the API schema changes.

* Keep styling consistent with existing DataTable usage.

* Use muted placeholder when value is hidden.

## Files

* `src/pages/EvaluationManagementPage/EvaluationDetailPage.tsx`

