I will implement the "Contract Security" view within the `ComplianceSecurityTab` component.

### 1. Update `ComplianceSecurityTab.tsx`

I will modify `src/pages/ContractManagementPage/components/ComplianceSecurityTab.tsx` to include:

*   **New Type Definition**: `SecurityRow` matching the fields in the screenshot (id, securityId, securityType, amount, dueDate, dueIn, status).
*   **New Column Definition**: `securityColumns`
    *   **Security ID**: Text
    *   **Security Type**: Text
    *   **Amount**: Text (e.g., "$2.5M")
    *   **Date**: A custom cell renderer that displays two lines:
        *   "Due Date: YYYY-MM-DD" (bold/darker label)
        *   "Due in: X days" (lighter text)
    *   **Status**: Badge with conditional styling (Green for "Submitted", Yellow for "Pending Submission").
    *   **Action**: "View" link button.
*   **Mock Data**: `securitySampleRows` populated with the data from the screenshot.
*   **Conditional Logic**:
    *   When `activeView === "security"`, render the `DataTable` with `securityColumns` and `securitySampleRows`.
    *   Update the search label to "Security" when the security tab is active.
    *   Keep the existing "Insurance Coverage" view as is when `activeView === "insurance"`.

### 2. Implementation Details
*   **Date Column Styling**: Use a flex column or block display to stack the "Due Date" and "Due in" lines.
*   **Status Badge**: Reuse the existing badge logic but adapt for the specific status values if they differ (though they look similar).
*   **Type Safety**: Ensure `DataTable` can handle the union type or cast properly when switching data/columns.

This approach keeps all compliance-related logic in one component while supporting the toggle functionality requested.
