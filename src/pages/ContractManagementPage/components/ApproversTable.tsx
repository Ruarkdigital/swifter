import React from "react";
import { DataTable } from "@/components/layouts/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type ApproverRow = {
  name: string;
  email: string;
  role: string;
  approvals: string;
  status: "Completed" | "Pending";
};

const columns: ColumnDef<ApproverRow>[] = [
  {
    accessorKey: "name",
    header: "Approver Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-slate-900">{row.original.name}</span>
        <a href="#" className="text-blue-600 underline">{row.original.email}</a>
      </div>
    ),
  },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "approvals", header: "Approvals" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<ApproverRow["status"]>();
      const tone = s === "Completed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700";
      return <Badge className={tone}>{s}</Badge>;
    },
  },
  {
    id: "view",
    header: "Status",
    cell: () => <a href="#" className="text-blue-600 underline">View</a>,
  },
];

const sampleRows: ApproverRow[] = [
  { name: "Elise Johnson", email: "Mike@acme.com", role: "Engineer", approvals: "2/2", status: "Completed" },
  { name: "Elise Johnson", email: "Mike@acme.com", role: "Legal", approvals: "0/2", status: "Pending" },
  { name: "Elise Johnson", email: "Mike@acme.com", role: "Project Manager", approvals: "1/2", status: "Completed" },
  { name: "Elise Johnson", email: "Mike@acme.com", role: "Finance", approvals: "0/2", status: "Pending" },
];

const ApproversTable: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-slate-700">Approvers</div>
      <DataTable<ApproverRow> data={sampleRows} columns={columns} options={{ disableSelection: true }} />
    </div>
  );
};

export default ApproversTable;

