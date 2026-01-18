I will implement the "Analytics" tab in the Contract Details page to match the provided UI design.

### 1. Create `AnalyticsTab.tsx`
I will create a new component `src/pages/ContractManagementPage/components/AnalyticsTab.tsx`.
This component will include:
*   **Header**: "Analytics" title and "Export Report" button.
*   **Hero Section**: A blue card displaying the contract summary ("Building Construction Phase 2", values, dates).
*   **KPI Cards**: 5 cards (Risk Score, Compliance, Complexity, Budget, SLA) using `recharts` for the circular indicators.
*   **Middle Section (3 Columns)**:
    *   **Financial Overview**: A data list showing contract values and changes.
    *   **Alerts**: A list of urgent items with orange/red highlighting.
    *   **Clause & Legal Analysis**: Cards with colored side borders indicating risk levels.
*   **Charts Section**:
    *   **Deliverable Status**: A Donut chart using `recharts`.
    *   **Activities**: A Line chart showing activity trends.
    *   **Vendor KPI**: Summary stats and linear progress bars using the existing `Progress` component.
*   **Attachments**: Simple cards for Amendments and Insurance.

### 2. Update `ContractDetailPage.tsx`
I will:
*   Import the new `AnalyticsTab` component.
*   Add the "Analytics" `TabsTrigger`.
*   Add the "Analytics" `TabsContent` to render the new component.

### 3. Implementation Details
*   **Styling**: Tailwind CSS for layout, colors, and typography matching the screenshot.
*   **Charts**: `recharts` for interactive charts.
*   **Icons**: `lucide-react` for icons.
*   **Mock Data**: Static data to replicate the screenshot exactly.
