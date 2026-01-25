import React from "react";
import { DataTable } from "@/components/layouts/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export type InvoiceRow = {
  id: string;
  type: string;
  billed: string;
  remaining: string;
  status: "Approved" | "Pending" | "Rejected";
};

const columns: ColumnDef<InvoiceRow>[] = [
  { accessorKey: "id", header: "Invoice ID" },
  { accessorKey: "type", header: "Type" },
  {
    id: "amountBilled",
    header: "Amount/Billed",
    cell: ({ row }) => (
      <div className="text-xs text-slate-600">
        <p>
          <span className="text-slate-500">Billed:&nbsp;</span>
          <span className="text-slate-900 font-medium">
            {row.original.billed}
          </span>
        </p>
        <p>
          <span className="text-slate-500">Remaining:&nbsp;</span>
          <span className="text-slate-900 font-medium">
            {row.original.remaining}
          </span>
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
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${tone}`}>
          {s}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: () => (
      <div className="text-right">
        <a
          href="#"
          data-testid="view-invoice-detail"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          View
        </a>
      </div>
    ),
  },
];

const sampleRows: InvoiceRow[] = [
  {
    id: "INV-2025-10",
    type: "Progress Draw",
    billed: "$2.5M",
    remaining: "$400,000",
    status: "Approved",
  },
  {
    id: "INV-2025-10",
    type: "Monthly Payment",
    billed: "$2.1M",
    remaining: "$400,000",
    status: "Approved",
  },
  {
    id: "INV-2025-10",
    type: "Milestone Payment",
    billed: "$2.1M",
    remaining: "$400,000",
    status: "Approved",
  },
  {
    id: "INV-2025-10",
    type: "Holdback Release",
    billed: "$2.1M",
    remaining: "$400,000",
    status: "Pending",
  },
];

const InvoiceTable: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const filteredRows = React.useMemo(() => {
    if (!search) return sampleRows;
    const query = search.toLowerCase();
    return sampleRows.filter((row) =>
      [row.id, row.type].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [search]);
  return (
    <div className="space-y-4" data-testid="invoice-table">
      <DataTable<InvoiceRow>
        data={filteredRows}
        columns={columns}
        header={() => (
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-5 py-4">
            <span className="text-sm font-medium text-slate-900">
              Invoices
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search changes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-[260px] pl-9"
              />
            </div>
          </div>
        )}
        options={{
          disableSelection: true,
          disablePagination: true,
          manualPagination: false,
          totalCounts: filteredRows.length,
          setPagination: () => {},
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
        classNames={{
          container: "border border-[#E5E7EB] rounded-xl bg-white",
          tHeader: "bg-[#F9FAFB]",
          tHeadRow: "border-b border-[#E5E7EB]",
          tBody: "bg-white",
          tRow: "border-b border-[#E5E7EB]",
          tHead: "px-6 py-3 text-xs font-semibold text-slate-500",
          tCell: "px-6 py-4 text-sm text-slate-700",
        }}
      />
    </div>
  );
};

export default InvoiceTable;
