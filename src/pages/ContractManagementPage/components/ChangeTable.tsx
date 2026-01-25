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
import ChangeDetailsSheet from "./ChangeDetailsSheet";

export type ChangeRow = {
  id: string;
  title: string;
  type: "Request" | "Order" | "Directive" | "Proposal";
  value: string;
  submitted: string;
  status: "Approved" | "Pending" | "Rejected";
};

const columns: ColumnDef<ChangeRow>[] = [
  { accessorKey: "id", header: "Change ID" },
  { accessorKey: "title", header: "Change Title" },
  { accessorKey: "type", header: "Type" },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ getValue }) => (
      <span className="font-semibold">{getValue<string>()}</span>
    ),
  },
  { accessorKey: "submitted", header: "Submitted" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<ChangeRow["status"]>();
      const tone =
        s === "Approved"
          ? "bg-green-100 text-green-700"
          : s === "Pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tone}`}>
          {s}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            ⋮
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <ChangeDetailsSheet
              trigger={
                <a href="#" data-testid="view-change-detail p-4">
                  View Details
                </a>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const sampleRows: ChangeRow[] = [
  {
    id: "CD-2025-10",
    title: "Additional structural reinforcement",
    type: "Request",
    value: "$2.50M",
    submitted: "2025-03-25",
    status: "Approved",
  },
  {
    id: "CD-2025-10",
    title: "Additional structural reinforcement",
    type: "Order",
    value: "$2.50M",
    submitted: "2025-03-25",
    status: "Pending",
  },
  {
    id: "CD-2025-10",
    title: "Additional structural reinforcement",
    type: "Directive",
    value: "$2.50M",
    submitted: "2025-03-25",
    status: "Approved",
  },
  {
    id: "CD-2025-10",
    title: "Additional structural reinforcement",
    type: "Proposal",
    value: "$2.50M",
    submitted: "2025-03-25",
    status: "Rejected",
  },
  {
    id: "CD-2025-10",
    title: "Additional structural reinforcement",
    type: "Request",
    value: "$2.50M",
    submitted: "2025-03-25",
    status: "Approved",
  },
  {
    id: "CD-2025-10",
    title: "Additional structural reinforcement",
    type: "Request",
    value: "$2.50M",
    submitted: "2025-03-25",
    status: "Approved",
  },
  {
    id: "CD-2025-10",
    title: "Additional structural reinforcement",
    type: "Request",
    value: "$2.50M",
    submitted: "2025-03-25",
    status: "Approved",
  },
];

const ChangeTable: React.FC = () => {
  const [search, setSearch] = React.useState("");

  return (
    <div className="space-y-4" data-testid="changes-table ">
      <DataTable<ChangeRow>
        header={() => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                Changes
              </span>
              <Input
                placeholder="Search changes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-[260px]"
                data-testid="search-changes-input"
              />
            </div>
          </div>
        )}
        data={sampleRows}
        classNames={{
          container:
            "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
          expandedCell: "px-5",
        }}
        columns={columns}
        options={{ disableSelection: true }}
      />
    </div>
  );
};

export default ChangeTable;
