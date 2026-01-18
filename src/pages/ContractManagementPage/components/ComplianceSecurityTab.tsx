import React from "react";
import { DataTable } from "@/components/layouts/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type PolicyRow = {
  id: string;
  policyId: string;
  policyName: string;
  limit: string;
  status: "Submitted" | "Pending Submission";
};

export type SecurityRow = {
  id: string;
  securityId: string;
  securityType: string;
  amount: string;
  dueDate: string;
  dueIn: string;
  status: "Submitted" | "Pending Submission";
};

const columns: ColumnDef<PolicyRow>[] = [
  { accessorKey: "policyId", header: "Policy ID" },
  { 
    accessorKey: "policyName", 
    header: "Policy Name",
    cell: ({ getValue }) => <span className="text-slate-700">{getValue<string>()}</span>,
  },
  { 
    accessorKey: "limit", 
    header: "Limit",
    cell: ({ getValue }) => <span className="font-semibold">{getValue<string>()}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<PolicyRow["status"]>();
      const tone = s === "Submitted" 
        ? "bg-green-100 text-green-700" 
        : "bg-yellow-100 text-yellow-700";
      return <Badge variant="secondary" className={`font-medium ${tone}`}>{s}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: () => (
      <Button variant="link" className="text-green-600 font-semibold p-0 h-auto">
        View
      </Button>
    ),
  },
];

const securityColumns: ColumnDef<SecurityRow>[] = [
  { accessorKey: "securityId", header: "Security ID" },
  { 
    accessorKey: "securityType", 
    header: "Security Type",
    cell: ({ getValue }) => <span className="text-slate-700">{getValue<string>()}</span>,
  },
  { 
    accessorKey: "amount", 
    header: "Amount",
    cell: ({ getValue }) => <span className="font-semibold">{getValue<string>()}</span>,
  },
  {
    accessorKey: "dueDate",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex flex-col text-sm">
        <div>
          <span className="text-slate-500 mr-1">Due Date:</span>
          <span className="font-medium text-slate-900">{row.original.dueDate}</span>
        </div>
        <div>
          <span className="text-slate-500 mr-1">Due in:</span>
          <span className="text-slate-900">{row.original.dueIn}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<SecurityRow["status"]>();
      const tone = s === "Submitted" 
        ? "bg-green-100 text-green-700" 
        : "bg-yellow-100 text-yellow-700";
      return <Badge variant="secondary" className={`font-medium ${tone}`}>{s}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: () => (
      <Button variant="link" className="text-green-600 font-semibold p-0 h-auto">
        View
      </Button>
    ),
  },
];

const sampleRows: PolicyRow[] = [
  { id: "1", policyId: "PL-2025-10", policyName: "Additional structural reinforcement", limit: "$2.5M", status: "Submitted" },
  { id: "2", policyId: "PL-2025-10", policyName: "Additional structural reinforcement", limit: "$2.5M", status: "Pending Submission" },
  { id: "3", policyId: "PL-2025-10", policyName: "Additional structural reinforcement", limit: "$2.5M", status: "Submitted" },
  { id: "4", policyId: "PL-2025-10", policyName: "Additional structural reinforcement", limit: "$2.5M", status: "Submitted" },
];

const securitySampleRows: SecurityRow[] = [
  { id: "1", securityId: "SC-2025-10", securityType: "Additional structural reinforcement", amount: "$2.5M", dueDate: "2025-03-25", dueIn: "-", status: "Submitted" },
  { id: "2", securityId: "SC-2025-10", securityType: "Additional structural reinforcement", amount: "$2.5M", dueDate: "2025-03-25", dueIn: "5 days", status: "Pending Submission" },
  { id: "3", securityId: "SC-2025-10", securityType: "Additional structural reinforcement", amount: "$2.5M", dueDate: "2025-03-25", dueIn: "-", status: "Submitted" },
  { id: "4", securityId: "SC-2025-10", securityType: "Additional structural reinforcement", amount: "$2.5M", dueDate: "2025-03-25", dueIn: "5 days", status: "Pending Submission" },
];

const ComplianceSecurityTab: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [activeView, setActiveView] = React.useState<"insurance" | "security">("insurance");

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Compliance & Security Details</h3>
        <Button variant="outline" className="text-slate-600 border-slate-300">
          <Share2 className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Insurance Coverage</p>
            <p className="text-base font-semibold text-slate-900">5 Coverages</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Contract Security</p>
            <p className="text-base font-semibold text-slate-900">Yes</p>
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Insurance Expiry Date</p>
            <p className="text-base font-semibold text-slate-900">April 30, 2025</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Security Type</p>
            <p className="text-base font-semibold text-slate-900">5</p>
          </div>
        </div>
      </div>

      {/* Toggle and Table Section */}
      <div className="space-y-6">
        {/* Custom Toggle */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-full inline-flex">
            <button
              onClick={() => setActiveView("insurance")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeView === "insurance"
                  ? "bg-[#1E293B] text-white"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              Insurance Coverage
            </button>
            <button
              onClick={() => setActiveView("security")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeView === "security"
                  ? "bg-[#1E293B] text-white"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              Contract Security
            </button>
          </div>
        </div>

        {/* Search and Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="font-medium text-slate-700 w-20">
              {activeView === "insurance" ? "Policy" : "Security"}
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 bg-white" 
              />
            </div>
          </div>

          <div className="border rounded-md bg-white">
            {activeView === "insurance" ? (
              <DataTable<PolicyRow> 
                data={sampleRows} 
                columns={columns} 
                options={{ disableSelection: true, disablePagination: true }} 
              />
            ) : (
              <DataTable<SecurityRow> 
                data={securitySampleRows} 
                columns={securityColumns} 
                options={{ disableSelection: true, disablePagination: true }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceSecurityTab;
