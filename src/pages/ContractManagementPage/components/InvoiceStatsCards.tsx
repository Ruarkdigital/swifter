import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

type StatProps = {
  title: string;
  value: number | string;
  tone: "gray" | "green" | "yellow" | "red";
  testId: string;
};

const toneClasses: Record<StatProps["tone"], { wrap: string; icon: string }> = {
  gray: { wrap: "bg-slate-100", icon: "text-slate-700" },
  green: { wrap: "bg-green-100", icon: "text-green-600" },
  yellow: { wrap: "bg-yellow-100", icon: "text-yellow-600" },
  red: { wrap: "bg-red-100", icon: "text-red-600" },
};

const StatCard: React.FC<StatProps> = ({ title, value, tone, testId }) => {
  const c = toneClasses[tone];
  return (
    <Card
      data-testid={testId}
      className="border border-[#E5E7EB] rounded-xl shadow-none"
    >
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-xl font-semibold text-slate-900">{value}</p>
        </div>
        <div
          className={`rounded-full ${c.wrap} h-10 w-10 flex items-center justify-center`}
          aria-hidden
        >
          <FileText className={`h-5 w-5 ${c.icon}`} />
        </div>
      </CardContent>
    </Card>
  );
};

const InvoiceStatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="All Invoices"
        value={8}
        tone="gray"
        testId="invoice-stats-all"
      />
      <StatCard
        title="Approved Invoices"
        value={4}
        tone="green"
        testId="invoice-stats-approved"
      />
      <StatCard
        title="Pending Invoices"
        value={5}
        tone="yellow"
        testId="invoice-stats-pending"
      />
      <StatCard
        title="Rejected Invoices"
        value={5}
        tone="red"
        testId="invoice-stats-rejected"
      />
    </div>
  );
};

export default InvoiceStatsCards;
