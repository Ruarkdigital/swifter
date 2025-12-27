import React from "react";
import { DataTable } from "@/components/layouts/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export type DeliverableRow = {
  id: string;
  title: string;
  dueDate: string;
  submissionDate?: string;
  kpi: string;
  status: "Submitted" | "Late" | "Pending";
};

const columns: ColumnDef<DeliverableRow>[] = [
  { accessorKey: "id", header: "Deliverable ID" },
  { accessorKey: "title", header: "Deliverable Title" },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-xs text-slate-600">
        <p>
          <span className="text-slate-500">Due Date:&nbsp;</span>
          <span className="text-slate-900">{row.original.dueDate}</span>
        </p>
        <p>
          <span className="text-slate-500">Submission Date:&nbsp;</span>
          <span className="text-slate-900">{row.original.submissionDate ?? "-"}</span>
        </p>
      </div>
    ),
  },
  { accessorKey: "kpi", header: "KPI" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<DeliverableRow["status"]>();
      const tone = s === "Submitted" ? "bg-green-100 text-green-700" : s === "Late" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";
      return <Badge className={tone}>{s}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => <a href="#" className="text-blue-600 underline">View</a>,
  },
];

const sampleRows: DeliverableRow[] = [
  { id: "DEL-2025-10", title: "Additional structural reinforcement", dueDate: "2025-03-25", submissionDate: "2025-05-25", kpi: "4 days early", status: "Submitted" },
  { id: "DEL-2025-10", title: "Additional structural reinforcement", dueDate: "2025-03-25", submissionDate: "2025-05-25", kpi: "4 days late", status: "Submitted" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", dueDate: "2025-03-25", kpi: "7 days late", status: "Late" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", dueDate: "2025-03-25", kpi: "Due in 4 days", status: "Pending" },
];

const DeliverablesTable: React.FC = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="space-y-4" data-testid="deliverables-table">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Deliverables</span>
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-[260px]" />
      </div>

      <DataTable<DeliverableRow> data={sampleRows} columns={columns} options={{ disableSelection: true }} />
    </div>
  );
};

export default DeliverablesTable;

