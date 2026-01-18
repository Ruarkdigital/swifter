I will implement the "Compliance & Security" tab in the Contract Details page to match the provided UI design.

### 1. Create New Component: `ComplianceSecurityTab.tsx`
I will create a new component `src/pages/ContractManagementPage/components/ComplianceSecurityTab.tsx` that encapsulates the entire tab content. This keeps the main page clean.

**Features:**
*   **Header Section:** "Compliance & Security Details" title with an "Export Report" button.
*   **Summary Grid:** Displays the 4 key metrics (Insurance Coverage, Expiry Date, Contract Security, Security Type) as shown in the design.
*   **Toggle Switch:** A custom toggle to switch between "Insurance Coverage" and "Contract Security" views.
*   **Data Table:**
    *   Uses the project's standard `DataTable` component.
    *   Columns: Policy ID, Policy Name, Limit, Status, Action.
    *   Includes a Search bar above the table.
    *   Mock data matching the screenshot (e.g., "PL-2025-10", "Additional structural reinforcement").
    *   Status badges for "Submitted" (Green) and "Pending Submission" (Yellow).

### 2. Update `ContractDetailPage.tsx`
I will modify `src/pages/ContractManagementPage/ContractDetailPage.tsx` to:
*   Import the new `ComplianceSecurityTab` component.
*   Add a new `<TabsTrigger>` for "Compliance & Security" in the main navigation list.
*   Add the corresponding `<TabsContent>` to render the new component.

### 3. Implementation Details
*   **Styling:** I will use Tailwind CSS to match the spacing, typography, and colors from the screenshot (e.g., specific blue for the active toggle, text colors for labels vs values).
*   **Icons:** Using `lucide-react` for icons like `Share2` (Export) and `Search`.
*   **Project Rules:** strictly following the requirement to use `DataTable` and existing UI components (`Button`, `Badge`, `Input`).
