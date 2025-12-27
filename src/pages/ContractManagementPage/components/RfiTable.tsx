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

export type RfiRow = {
  id: string;
  title: string;
  type: "Issued" | "Received";
  status: "Closed" | "Open";
};

const columns: ColumnDef<RfiRow>[] = [
  { accessorKey: "id", header: "RFI ID" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "type", header: "Type" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<RfiRow["status"]>();
      const tone = s === "Open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
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
            <a href="#" data-testid="view-rfi-detail">View Details</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const sampleRows: RfiRow[] = [
  { id: "RFI-2025-10", title: "Progress Draw", type: "Issued", status: "Closed" },
  { id: "RFI-2025-10", title: "Monthly Payment", type: "Received", status: "Open" },
];

const RfiTable: React.FC = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="space-y-4" data-testid="rfi-table">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Invoices</span>
        <Input placeholder="Search changes" value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-[260px]" />
      </div>

      <DataTable<RfiRow> data={sampleRows} columns={columns} options={{ disableSelection: true }} />
    </div>
  );
};

export default RfiTable;

