## Scope
Implement the first analytics row (Frame 2147228616) for Contract Manager in empty state with exact Header + Body designs:
- Average Cycle Time per Stage
- Invoice Status
- Committed vs Actual Spend
This applies only when userRole === "contract_manager" and top tab === "analytics". All other roles remain unchanged.

## Components & Placement
- Create three dedicated components under `src/components/layouts/RoleBasedDashboard/analytics/`:
  - `CycleTimeCard.tsx`
  - `InvoiceStatusCard.tsx`
  - `SpendCard.tsx`
- Each component renders pixel-perfect Header (title + YTD tabs) and Body as per design, no assumptions beyond the provided text.
- Use ShadCN Tabs for header tabs and Tailwind for fine-grained spacing/typography.

## Card Details
### 1) Average Cycle Time per Stage (CycleTimeCard)
- Header: Title "Average Cycle Time per Stage" + tabs [YTD, 12 months, 6 months, 3 months]. YTD active pill; others grey text.
- Body:
  - Four labeled rows: Draft (5 days), Review (8 days), Approval (12 days), Execution (6 days).
  - Each row shows label left, value right, and a progress bar underneath (rounded-full, grey track with blue fill; lengths approximated to days value).
  - Alert banner at bottom: yellow background, brown text: "Bottleneck Alert: Approval stage averaging 12 days (Legal review delays)".
- Props: `values: {draft:number, review:number, approval:number, execution:number}`, default [5,8,12,6].

### 2) Invoice Status (InvoiceStatusCard)
- Header: Title "Invoice Status" + tabs [YTD, 12 months, 6 months, 3 months].
- Body:
  - Donut chart (innerRadius ~80, outer full), segments colored Green(Approved), Amber(Pending), Red(Rejected).
  - Legend row centered with colored dot + label + count values: Approved 98, Pending 34, Rejected 12.
- Props: `{approved:number, pending:number, rejected:number}`, default [98,34,12].

### 3) Committed vs Actual Spend (SpendCard)
- Header: Title + tabs [YTD, 12 months, 6 months, 3 months].
- Body split into 2 columns:
  - Left: two progress bars with labels and right-aligned values:
    - Committed Spend: $12.8M (blue bar)
    - Actual Spend: $10.8M (green bar)
  - Middle/Right metric block:
    - Remaining Budget: $2.2M (value green)
    - Helper text: "72% of committed budget utilized"
    - Budget Performance callout: light blue box with title "Budget Performance" and subtitle "On track with projected spend rate"
- Props: `{committed:number, actual:number, remaining:number, utilizationPct:number}` with defaults.

## Styling Accuracy
- Card container: rounded-2xl (16px), 1px outline (#E5E7EB), white background, standard padding (align to figma SCSS spacing: 23px/24px etc).
- Typography: match weights and sizes (title 16/600, metric value 20/700 green/blue per spec).
- Spacing: grid and row gaps as in design; use Tailwind classes to match figma extracted module values.

## Integration
- Update `RoleBasedDashboard/index.tsx` analytics rendering:
  - In cmTopTab === "analytics", first row renders the three new components in `lg:grid-cols-3`.
  - Keep existing later analytics rows intact or disabled until subsequent steps.
- No changes to other roles or overview tab behavior.

## Data
- Empty-state uses hardcoded placeholder values as specified by the design; no API calls.
- Expose props for future data wiring when schemas are provided.

## Verification
- Switch to Contract Manager → Analytics; verify layout, spacing, fonts, colors, and copy match the design screenshots.
- Ensure responsive grid behavior and no runtime errors. 