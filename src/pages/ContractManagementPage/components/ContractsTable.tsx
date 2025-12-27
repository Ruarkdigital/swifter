import React from "react";
import { DataTable } from "@/components/layouts/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export type ContractRow = {
  id: string;
  title: string;
  code: string;
  vendor: string;
  value?: string;
  owner: string;
  published?: string;
  endDate?: string;
  status: "Active" | "Draft" | "Expired" | "Terminated" | "Suspended";
};

const columns: ColumnDef<ContractRow>[] = [
  {
    accessorKey: "title",
    header: "Contracts",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <a
          href={`/dashboard/contract-management/${row.original.id}`}
          data-testid="project-name-link"
          className="font-medium text-slate-900 underline-offset-2 hover:underline"
        >
          {row.original.title}
        </a>
        <span className="text-xs text-slate-500">{row.original.code}</span>
      </div>
    ),
  },
  { accessorKey: "vendor", header: "Vendor" },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ getValue }) => {
      const v = getValue<string | undefined>();
      return <span className="font-semibold text-slate-900">{v ?? "-"}</span>;
    },
  },
  { accessorKey: "owner", header: "Owner" },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-xs text-slate-500">
        {row.original.published && (
          <div>Published: {row.original.published}</div>
        )}
        {row.original.endDate && <div>End Date: {row.original.endDate}</div>}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<ContractRow["status"]>();
      const tone =
        s === "Active"
          ? "bg-green-100 text-green-700"
          : s === "Draft"
          ? "bg-slate-100 text-slate-700"
          : s === "Expired"
          ? "bg-red-100 text-red-700"
          : s === "Terminated"
          ? "bg-red-100 text-red-700"
          : "bg-red-100 text-red-700"; // Suspended
      return (
        <span
          data-testid="contract-status-badge"
          className={`px-2 py-1 rounded-full text-xs font-medium ${tone}`}
        >
          {s}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" data-testid="project-actions-dropdown">⋮</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a
              href={`/dashboard/contract-management/${row.original.id}`}
              data-testid="view-contract-detail"
            >
              View Details
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const sampleRows: ContractRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: String(i + 1),
  title: "Construction Services …",
  code: "CON-2025-10",
  vendor: "BuildRight Contractors Inc.",
  value: i % 2 === 0 ? "$2.50M" : undefined,
  owner: "Olamide Oladehinde",
  published: "2025-05-25",
  endDate: "2025-05-25",
  status: (i % 5 === 0
    ? "Expired"
    : i % 4 === 0
    ? "Terminated"
    : i % 3 === 0
    ? "Suspended"
    : i % 2 === 0
    ? "Active"
    : "Draft") as ContractRow["status"],
}));

const ContractsTable: React.FC = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="space-y-4" data-testid="contracts-table">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Contracts</span>
          <Input
            placeholder="Search contract"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="search-input"
            className="h-10 w-[260px]"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10"
                data-testid="date-filter"
              >
                Date <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>Newest</DropdownMenuItem>
              <DropdownMenuItem disabled>Oldest</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10"
                data-testid="status-filter"
              >
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid="status-active">
                Active
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Draft</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10"
                data-testid="category-filter"
              >
                Category <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid="category-software">
                Software
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Construction</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable<ContractRow>
        data={sampleRows}
        columns={columns}
        options={{ disableSelection: true }}
      />
    </div>
  );
};

export default ContractsTable;
