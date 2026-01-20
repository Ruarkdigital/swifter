I will update `c:\Users\USER\Documents\GitHub\swifter\src\pages\ContractManagementPage\components\CreateContractSheet.tsx` to align with the new API schema.

### 1. Update Validation Schema
I will update the `yup` schema to include:
*   `rating`: Required number (defaulting to 5).
*   `status`: Optional string (for "draft" or "publish").

### 2. Update `buildPayload` Function
I will restructure the payload generation to match `CreateContractInput`:
*   **Status Handling**: Accept a `status` argument ("draft" or "publish").
*   **Field Renaming**:
    *   `paymentTerm` → `contractPaymentTerm`
    *   `termType` → `contractTermType`
*   **Structure Changes**:
    *   **`contractFormationStage`**: Group start/end dates for `draft`, `review`, `approval`, and `execution` stages.
    *   **`insurance`**: Create a nested object containing `contractSecurity` (boolean), `expiryDate`, `contractSecurityType` (array), and `policy` (array).
    *   **`approvaers`**: Rename `approvals` to `approvaers` (matching the API docs) and format items with `user` (as array of IDs), `groupName`, `levelName`, and `amount`.
*   **Value Mapping**:
    *   `paymentStructure`: Map internal values (`monthly`, `milestone`, `lump_sum`) to API enums (`Monthly`, `Milestone`, `Progress Draw`).
    *   `contractSecurity`: Convert "yes"/"no" string to boolean.

### 3. Update Submission Logic
I will modify the `submit` function and the button handlers to pass the correct `status` ("draft" or "publish") when the user clicks the respective buttons.
