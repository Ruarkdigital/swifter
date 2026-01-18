## Goals
- Add accurate empty-state cards for the Contract Manager “Analytics” tab matching the provided design.
- Preserve existing dashboards for all other roles.
- Keep tabs ShadCN-based with className styling already in place.

## Tabs Behavior
- Top tab group: Overview and Analytics (existing ShadCN tabs remain, Analytics active renders analytics grid).
- Sub-tabs: Only used under Overview; Analytics has its own content grid and no sub-tab.

## Analytics Cards to Implement
1. Average Cycle Time per Stage
- Type: bar
- Layout: horizontal
- Filters: YTD, 12 months, 6 months, 3 months, 1 month
- Empty data []

2. Invoice Status
- Type: donut
- Legend bottom, iconType circle
- Filters: same as above
- Empty data []

3. Committed vs Actual Spend
- Type: bar (stacked, horizontal)
- Single datum with keys: committed, actual, remaining
- Colors: blue committed, green actual, amber remaining
- Filters: YTD, 12 months, 6 months, 3 months

4. Contract Value by Vendors
- Type: bar (vertical)
- Show axes
- Filters: YTD, 12 months, 6 months, 3 months
- Empty data []

5. Contract Value by Project
- Type: bar (horizontal)
- Show axes false on X, true on Y
- Colors: green bars
- Empty data []

6. Risk Distribution
- Type: donut
- Empty data []

7. Change Orders Impact
- Type: line
- Show grid, legend
- Empty data []

8. Contract Value by Category
- Type: bar (horizontal)
- Colors: blue bars
- Empty data []

9. Compliance Scorecards
- Type: bar (horizontal, stacked)
- Keys: compliant, nonCompliant, partial
- Empty data []

10. Clause Intelligence (Portfolio Level)
- Type: radar (new chart type)
- Axes: 5 spokes (placeholder values 0)

11. Contract Status
- Type: pie
- Legend bottom
- Empty data []

12. Vendor Performance Summary
- Component: Activity (title-only, items: [])

13. Renewals & Expiry Timeline
- Component: Activity (title-only, items: [])

14. AI Insights & Alerts
- Component: Activity (title-only, items: [])

## Technical Changes
- Extend DashboardConfig property union to include 'radar'.
- Enhance ChartComponent to support radar charts using Recharts (RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis).
- Add optional className support to ActivityComponent (apply `activity.className` to Card) for future gradient styling if needed.
- Define a contract manager analytics configuration (cmAnalyticsRows) locally in RoleBasedDashboard or as an exported helper from dashboardConfig.ts.
- Update RoleBasedDashboard:
  - When userRole === "contract_manager" and top tab === "analytics", render analytics grid using cmAnalyticsRows via ChartComponent/ActivityComponent.
  - Hide Overview stats/rows during Analytics.
  - Keep all other roles untouched.

## Data & API
- Empty-state only: use static placeholder arrays with zeros or [].
- No API calls; do not reshape backend data.

## Styling & Accuracy
- Use className on TabsTrigger to match pill and underline designs.
- Configure chart props (layout, showLegend, axis props, colors, barSize, innerRadius) to match the visual feel.

## Verification
- Run locally and navigate as a Contract Manager; switch to Analytics tab and verify:
  - All cards render in a multi-row responsive grid.
  - No impact on other roles.
  - No runtime errors.
