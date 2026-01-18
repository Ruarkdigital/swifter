## Scope
- Make effectiveDate and endDate required.
- Enforce endDate >= effectiveDate.
- Keep effectiveDate allowed in past/present/future.

## Technical Changes
- Update the yup schema in CreateContractSheet to add required rules and a cross-field comparison.
- No changes to Step4Timeline UI components; Forger will surface validation messages.

## Implementation Details
- File: src/pages/ContractManagementPage/components/CreateContractSheet.tsx
- Replace the current optional date rules with:

```ts
effectiveDate: yup
  .date()
  .typeError("Invalid date")
  .required("Effective date is required"),

endDate: yup
  .date()
  .typeError("Invalid date")
  .required("End date is required")
  .test(
    "end-after-start",
    "End date must be on or after the effective date",
    function (value) {
      const { effectiveDate } = this.parent;
      if (!value || !effectiveDate) return true; // handled by required
      return value >= effectiveDate;
    }
  ),
```

## UX Behavior
- If either date is missing, inline error appears.
- If endDate < effectiveDate, inline error: “End date must be on or after the effective date”.
- Existing helper text for effectiveDate remains unchanged.

## Verification Plan
- Manually test in the contract creation flow:
  - Leave either date empty → required errors.
  - Set endDate before effectiveDate → comparison error.
  - Set equal dates → allowed (passes).
  - Use past effectiveDate → allowed.
- Confirm TextDatePicker provides Date objects and yup.date() validates them.

## Notes
- Defaults remain `undefined`; users must pick dates.
- No API changes; dates will continue to be formatted at submission time as elsewhere in the app.
