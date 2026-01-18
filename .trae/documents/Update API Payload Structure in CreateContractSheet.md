I will update the `CreateContractSheet.tsx` file to correctly structure the API payload according to the `CreateContractInput` schema.

### **Plan:**

1.  **Update `buildPayload` function in `CreateContractSheet.tsx`**:
    *   **`contractFormationStage`**: Construct the nested object using `draftStartDate`, `draftEndDate`, `reviewStartDate`, etc.
    *   **`insurance`**: Construct the `insurance` object by:
        *   Mapping `contractSecurity` to a boolean.
        *   Combining the primary security fields (`securityType`, `securityAmount`, `securityDueDate`) and the `securities` array into the `contractSecurityType` array.
        *   Mapping `insurancePolicies` to `policy`.
        *   Mapping `insuranceExpiryDate` to `expiryDate`.
    *   **`approvaers`**: Rename `approvals` to `approvaers` (matching the API docs) and restructure it to map approval groups directly, ensuring `user` is an array of strings.

2.  **Verify Field Mappings**:
    *   Ensure all date fields are formatted as `YYYY-MM-DD`.
    *   Ensure numeric fields are parsed correctly.
