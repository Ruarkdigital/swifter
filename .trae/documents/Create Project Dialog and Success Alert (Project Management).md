## Scope
- Implement Create Project dialog triggered from the existing button in `ProjectManagementPage`.
- Manage form state with Forge (`useForge`, `Forge`, `Forger`) and `yupResolver`.
- Implement success alert using ShadCN `Alert` displayed inside a Dialog overlay (no custom X icon).

## Files
- Add `src/pages/ProjectManagementPage/components/CreateProjectDialog.tsx` (Forge form within ShadCN Dialog)
- Add `src/pages/ProjectManagementPage/components/SuccessAlert.tsx` (Dialog containing ShadCN Alert)
- Add `src/components/ui/alert.tsx` (ShadCN Alert primitive, if not present)
- Update `src/pages/ProjectManagementPage/index.tsx` to wire dialog state and handlers

## Create Dialog UI
- Fields:
  - Project Name (TextInput)
  - Project Category (TextSelect with items: MSA, Stand-Alone)
  - Budget (TextCurrencyInput)
  - Description (TextArea)
  - Project Control: Allow Multiple Contracts (Switch + “Enabled” label)
- Buttons:
  - `Cancel` → closes dialog
  - `Continue` → validates via Forge, then closes and opens success alert
- Test IDs: `create-project-dialog`, `project-name-input`, `project-category-select`, `budget-input`, `description-input`, `allow-multiple-contracts-switch`, `cancel-create-project`, `continue-create-project`

## Success Alert UI
- Dialog overlay centered; content is an `Alert` with success style (green icon + message `Project Created Successfully`).
- Actions: `Close` and `View Details` buttons below; both dismiss for now (UI-only per rules).
- Test IDs: `project-created-success-dialog`, `success-close-button`, `success-view-details-button`

## Validation
- `yup` schema:
  - `name: required`
  - `category: required`
  - `budget: number().min(0).optional()`
  - `description: optional`
  - `allowMultipleContracts: boolean`
- Initialize `useForge({ resolver: yupResolver(schema), defaultValues })`

## Wiring
- In page component, add `isCreateOpen` and `isSuccessOpen` state.
- Hook button at `index.tsx#L29-35` to `setIsCreateOpen(true)`.
- Pass callbacks to dialog components.

## Constraints
- No backend calls; pure UI.
- Keep layout unchanged; match spacing/typography/colors.
- Use existing FormInputs wrappers for consistent styles.
