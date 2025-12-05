## Issue
- Opening CompleteProposalDialog pre-appends a blank pricing row.
- New rows created inside dialog lack `requiredDocumentId`, weakening association to the selected document.

## Fix
1. Remove the pre-append in SubmitProposalPage when clicking “Complete Proposal”; only set `selectedDocumentId` and open the dialog.
2. Update CompleteProposalDialog’s `addItem` to include `requiredDocumentId: id` so any newly added rows are properly linked to the selected document.
3. Keep existing subtotal/total syncing logic; it will update values for existing rows without creating new ones.

## Verification
- Open/close dialog repeatedly: no new row is added automatically.
- Add rows inside dialog: rows are linked via `requiredDocumentId` and update subtotals/total correctly.
- Existing rows remain editable and persist across dialog toggles.