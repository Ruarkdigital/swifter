## Scope
- Create a ShadCN sheet for Change Details under Contract Management page components with Overview and Comments tabs and action footer.
- Wrap the sheet trigger around the "View Details" menu item at `src/pages/ContractManagementPage/components/ChangeTable.tsx#L64-66`.

## Files
- Add `src/pages/ContractManagementPage/components/ChangeDetailsSheet.tsx` (read-only UI, no backend).
- Update `src/pages/ContractManagementPage/components/ChangeTable.tsx` to import and use the sheet, wrapping the anchor in the dropdown as the sheet trigger.

## UI Details
- Header: title “Change Details”, Export button icon.
- Overview grid:
  - Left: Change Title, Change Type, Submission Date, Submitted by (link)
  - Right: Vendor/Contractor (link), Value (bold), Status (badge: Pending)
- Description paragraph.
- Attached Documents: 4 cards (icons, name, type + size, small action icons placeholders).
- Footer: Reject Change (outline) and Send for Approval (primary).

## Verification
- From Change Management tab, open actions dropdown → select “View Details”; sheet opens and displays the UI accurately.
- No layout changes and no backend calls.