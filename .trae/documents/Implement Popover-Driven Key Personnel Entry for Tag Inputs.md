## Scope
- Add a popover form on both personnel tag inputs that captures Name, Email, Role, Phone and appends a tag on submit.
- Persist Role and Phone alongside Name/Email so they are available for submission and later editing.

## Target Files
- Enhance TextTagInput in [TextInput.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/components/layouts/FormInputs/TextInput.tsx#L189-L250) to show the popover and drive tag creation.
- Extend payload construction in [CreateContractSheet.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/ContractManagementPage/components/CreateContractSheet.tsx#L347-L355) to include role and phone when available.
- Keep [Step2ContractTeam.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/ContractManagementPage/components/Step2ContractTeam.tsx#L39-L51) unchanged structurally; it will benefit from the new component behavior.

## Data Model
- Emblor Tag supports only { id, text }.
- Store the richer personnel details in a parallel field in Forge form state keyed to each tag list:
  - vendorKeyPersonnelMeta: Array<{ id: string; name: string; email: string; role?: string; phone?: string }>
  - internalStakeholdersMeta: Array<{ id: string; name: string; email: string; role?: string; phone?: string }>
- Tag chips display Name; Tag.id stores Email for uniqueness.

## Behavior
- Clicking/focusing TagInput opens the popover anchored to that input.
- Validation requires Name and Email; Role and Phone optional.
- On submit:
  - Append Tag { id: email, text: name } via onChange([...value, newTag]).
  - Append a matching meta object to the corresponding meta array using Forge control.setValue.
  - Prevent duplicates by checking existing Tag ids/text.
  - Close and clear the popover.

## Submission
- Update buildPayload to prefer meta arrays when present:
  - personnel = vendorKeyPersonnelMeta.map(({ name, email, role, phone }) => ({ name, email, ...(role ? { role } : {}), ...(phone ? { phone } : {} ) }))
  - Fallback to current mapping from Tag[] when no meta is present to avoid data loss.
- Continue removing undefined top-level fields; inner objects include only provided properties.

## Implementation Details
- Use shadcn Popover components (already used in date picker) to implement the form.
- Local state in TextTagInput: open, name, email, role, phone, error.
- Provide a small prop enableDetailsPopover?: boolean = true to toggle behavior.
- Use keyboard shortcuts: Enter to add, Escape to close; maintain focus on TagInput after add.

## Testing
- Manual test in Create Contract → Step 2:
  - Open popover, add multiple entries; verify chips appear with names.
  - Confirm Forge state contains both Tag[] and meta arrays.
  - Submit a contract and inspect payload: personnel items include role/phone when provided.
  - Verify duplicates are blocked gracefully.

## Notes
- No backend calls added; payload shape for personnel is augmented conditionally with role/phone based on the provided instruction.
- No layout changes outside the popover anchored to the inputs.

## Ready to Proceed?
- If approved, I will implement the popover UI, meta storage, and payload merge logic, then verify across both vendor and internal personnel inputs.