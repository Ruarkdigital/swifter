I will update the contract creation form to match the API documentation.

### **Step 1: Update `Step2ContractTeam.tsx`**
*   Rename the field `vendorKeyPersonnel` to `personnel`.
*   Rename the field `internalStakeholders` to `internalTeam`.
*   Update the `visibility` option value from `invites_only` to `private` to match the API enum.

### **Step 2: Update `CreateContractSheet.tsx`**
*   **Schema & Default Values**: Rename `vendorKeyPersonnel` to `personnel`, `internalStakeholders` to `internalTeam`, and their corresponding `Meta` fields (`personnelMeta`, `internalTeamMeta`).
*   **Payload Construction**: Update the `buildPayload` function to use the new field names when constructing the API request body.
*   **Visibility Logic**: Simplify the visibility mapping since the form will now directly output `private`.
