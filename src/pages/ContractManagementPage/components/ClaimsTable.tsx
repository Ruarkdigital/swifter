import React from "react";
import { DataTable } from "@/components/layouts/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export type ClaimRow = {
  id: string;
  title: string;
  type: "Delay" | "Damages" | "Disruption";
  impact: string;
  submitted: string;
  status: "Approved" | "Under Review" | "Rejected";
};

const columns: ColumnDef<ClaimRow>[] = [
  { accessorKey: "id", header: "Claim ID" },
  { accessorKey: "title", header: "Claim Title" },
  { accessorKey: "type", header: "Type" },
  {
    accessorKey: "impact",
    header: "Impact",
    cell: ({ getValue }) => <span className="font-semibold">{getValue<string>()}</span>,
  },
  { accessorKey: "submitted", header: "Submitted" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<ClaimRow["status"]>();
      const tone = s === "Approved" ? "bg-green-100 text-green-700" : s === "Under Review" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${tone}`}>{s}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">⋮</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href="#" data-testid="view-claim-detail">View Details</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const sampleRows: ClaimRow[] = [
  { id: "CD-2025-10", title: "Additional structural reinforcement", type: "Delay", impact: "14 days", submitted: "2025-03-25", status: "Approved" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", type: "Damages", impact: "$2.50M", submitted: "2025-03-25", status: "Under Review" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", type: "Disruption", impact: "$2.50M + 14 days", submitted: "2025-03-25", status: "Approved" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", type: "Damages", impact: "$2.50M", submitted: "2025-03-25", status: "Rejected" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", type: "Damages", impact: "$2.50M", submitted: "2025-03-25", status: "Approved" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", type: "Damages", impact: "$2.50M", submitted: "2025-03-25", status: "Approved" },
  { id: "CD-2025-10", title: "Additional structural reinforcement", type: "Damages", impact: "$2.50M", submitted: "2025-03-25", status: "Approved" },
];

const ClaimsTable: React.FC = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="space-y-4" data-testid="claims-table">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Claims</span>
        <Input placeholder="Search changes" value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-[260px]" />
      </div>

      <DataTable<ClaimRow> data={sampleRows} columns={columns} options={{ disableSelection: true }} />
    </div>
  );
};

export default ClaimsTable;

