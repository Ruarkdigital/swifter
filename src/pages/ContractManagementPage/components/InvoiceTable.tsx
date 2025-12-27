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

export type InvoiceRow = {
  id: string;
  category: string;
  amount: string;
  billed: string;
  remaining: string;
  status: "Approved" | "Pending" | "Rejected";
};

const columns: ColumnDef<InvoiceRow>[] = [
  { accessorKey: "id", header: "Invoice ID" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="font-semibold">{getValue<string>()}</span>
    ),
  },
  {
    id: "bill",
    header: "Bill",
    cell: ({ row }) => (
      <div className="text-xs text-slate-600">
        <p>
          <span className="text-slate-500">Billed:&nbsp;</span>
          <span className="text-slate-900">{row.original.billed}</span>
        </p>
        <p>
          <span className="text-slate-500">Remaining:&nbsp;</span>
          <span className="text-slate-900">{row.original.remaining}</span>
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<InvoiceRow["status"]>();
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
            <a href="#" data-testid="view-invoice-detail">
              View Details
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const sampleRows: InvoiceRow[] = [
  {
    id: "INV-2025-10",
    category: "Progress Draw",
    amount: "$2.50M",
    billed: "$2.1M",
    remaining: "$400,000",
    status: "Approved",
  },
  {
    id: "INV-2025-10",
    category: "Monthly Payment",
    amount: "$2.50M",
    billed: "$2.1M",
    remaining: "$400,000",
    status: "Approved",
  },
  {
    id: "INV-2025-10",
    category: "Milestone Payment",
    amount: "$2.50M",
    billed: "$2.1M",
    remaining: "$400,000",
    status: "Approved",
  },
  {
    id: "INV-2025-10",
    category: "Milestone Payment",
    amount: "$2.50M",
    billed: "$2.1M",
    remaining: "$400,000",
    status: "Pending",
  },
];

const InvoiceTable: React.FC = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="space-y-4" data-testid="invoice-table">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Invoices</span>
        <Input
          placeholder="Search changes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-[260px]"
        />
      </div>

      <DataTable<InvoiceRow>
        data={sampleRows}
        columns={columns}
        options={{ disableSelection: true }}
      />
    </div>
  );
};

export default InvoiceTable;
