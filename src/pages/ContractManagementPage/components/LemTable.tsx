import React from "react";
import { DataTable } from "@/components/layouts/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export type LemRow = {
  id: string;
  title: string;
  submissionDate?: string;
  dueDate?: string;
  kpi?: string;
  status: "Submitted" | "Late" | "Pending";
};

const columns: ColumnDef<LemRow>[] = [
  { accessorKey: "id", header: "LEM ID" },
  { accessorKey: "title", header: "LEM Title" },
  { accessorKey: "submissionDate", header: "Submission Date" },
  {
    id: "kpi",
    header: "KPI",
    cell: ({ row }) => (
      <div className="text-xs text-slate-600">
        {row.original.dueDate && (
          <p>
            <span className="text-slate-500">Due Date:&nbsp;</span>
            <span className="text-slate-900">{row.original.dueDate}</span>
          </p>
        )}
        {row.original.submissionDate && (
          <p>
            <span className="text-slate-500">Submission Date:&nbsp;</span>
            <span className="text-slate-900">{row.original.submissionDate}</span>
          </p>
        )}
        {row.original.kpi && <p className="text-slate-900">{row.original.kpi}</p>}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<LemRow["status"]>();
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

const sampleRows: LemRow[] = [
  { id: "LEM-2025-10", title: "Additional structural reinforcement", submissionDate: "2025-03-25", dueDate: "2025-03-25", status: "Submitted" },
  { id: "DEL-2025-10", title: "Additional structural reinforcement", dueDate: "2025-03-25", submissionDate: "2025-03-25", kpi: "4 days late", status: "Submitted" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", dueDate: "2025-03-25", kpi: "7 days late", status: "Late" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", dueDate: "2025-03-25", kpi: "Due in 4 days", status: "Pending" },
];

const LemTable: React.FC = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="space-y-4" data-testid="lem-table">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">LEM</span>
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-[260px]" />
      </div>

      <DataTable<LemRow> data={sampleRows} columns={columns} options={{ disableSelection: true }} />
    </div>
  );
};

export default LemTable;

