import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Share2, FileText, Shield, AlertTriangle, FileCheck, DollarSign } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";

// Mock Data
const kpiData = [
  { label: "Risk Score", value: 65, status: "Medium Risk", color: "#F59E0B", type: "score" },
  { label: "Compliance Status", value: 92, status: "Good", color: "#10B981", type: "percentage" },
  { label: "Complexity Rating", value: 10, status: "High", color: "#EF4444", type: "score" },
  { label: "Budget Status", value: 121, status: "Over Budget", color: "#EF4444", type: "percentage" },
  { label: "SLA Performance", value: 88, status: "On Track", color: "#10B981", type: "percentage" },
];

const financialData = [
  { label: "Original Contract Value", value: "$12.8M", highlight: false },
  { label: "Change Orders (8)", value: "+$2.7M", highlight: true, color: "text-red-500" },
  { label: "Pending Change Orders", value: "$0.18M", highlight: true, color: "text-yellow-500" },
  { label: "Saving Realized", value: "$0.18M(5%)", highlight: true, color: "text-slate-700" },
  { label: "% Increase from Original", value: "+21.1%", highlight: true, color: "text-red-500" },
  { label: "Holdback Amount", value: "$0.75M", highlight: true, color: "text-purple-600" },
];

const alertsData = [
  { text: "Renew by 2025-06-30 - Contract expires in 175 days", urgent: true },
  { text: "Pending CO requires approval - CO-005 ($180k) awaiting your sign-off", urgent: true },
  { text: "Pending Invoice review - Invoice #INV-2024-089 for $850k due Jan 15", urgent: true },
  { text: "Pending NCR review - 2 Non-Conformance Reports require closure", urgent: true },
  { text: "Pending deliverable review - Safety Inspection Certificate is overdue", urgent: true },
  { text: "Pending report review - Monthly Progress Report due in 8 days", urgent: true },
];

const legalData = [
  { title: "Liquidated Damages", status: "HIGH RISK", color: "red", desc: "Standard: Standard penalty clause", actual: "Actual: Capped at 10% of contract value" },
  { title: "Payment Terms", status: "LOW RISK", color: "green", desc: "Standard: Net 30 days", actual: "Actual: Net 45 days with early payment discount" },
  { title: "Termination for Convenience", status: "MEDIUM RISK", color: "yellow", desc: "Standard: 30 days notice", actual: "Actual: 60 days notice required" },
];

const deliverableData = [
  { name: "Approved", value: 10, color: "#1E293B" },
  { name: "Rejected", value: 2, color: "#EF4444" },
  { name: "Pending", value: 3, color: "#F59E0B" },
];

const activityData = [
  { day: "Mon", change: 10, claims: 5, invoice: 8, rfi: 15, ncr: 2, deliverables: 20 },
  { day: "Tues", change: 12, claims: 8, invoice: 10, rfi: 18, ncr: 3, deliverables: 22 },
  { day: "Wed", change: 15, claims: 10, invoice: 12, rfi: 20, ncr: 4, deliverables: 25 },
  { day: "Thu", change: 18, claims: 12, invoice: 15, rfi: 22, ncr: 5, deliverables: 28 },
  { day: "Fri", change: 20, claims: 15, invoice: 18, rfi: 25, ncr: 6, deliverables: 30 },
  { day: "Sat", change: 15, claims: 10, invoice: 12, rfi: 20, ncr: 4, deliverables: 25 },
  { day: "Sun", change: 10, claims: 5, invoice: 8, rfi: 15, ncr: 2, deliverables: 20 },
];

const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Analytics</h3>
        <Button variant="outline" className="text-slate-600 border-slate-300">
          <Share2 className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Hero Card */}
      <div className="bg-[#1E40AF] rounded-xl p-6 text-white shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Building Construction Phase 2</h2>
              <Badge className="bg-[#4ADE80] text-green-900 hover:bg-[#4ADE80] border-0">Active</Badge>
            </div>
            <p className="text-blue-100 text-sm">CON-2024-156 • BuildCorp Ltd</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <p className="text-blue-200 text-xs mb-1">Contract Value</p>
            <p className="text-2xl font-bold">$15.5M</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-1">Original Value</p>
            <p className="text-lg font-semibold">$12.8M</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-1">Start Date</p>
            <p className="text-sm font-medium">2024-01-15</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-1">End Date</p>
            <p className="text-sm font-medium">2025-06-30</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-1">Contract Owner</p>
            <p className="text-sm font-medium">Sarah Johnson</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col items-center">
            <p className="text-xs text-slate-500 font-medium mb-4 self-start">{kpi.label}</p>
            <div className="relative h-24 w-24 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: kpi.value }, { value: kpi.type === 'percentage' ? 100 - kpi.value : 100 - kpi.value }]} // Simplified max for score
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={40}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill={kpi.color} />
                    <Cell fill="#E2E8F0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn("text-xl font-bold", `text-[${kpi.color}]`)} style={{ color: kpi.color }}>
                  {kpi.value}{kpi.type === 'percentage' ? '%' : ''}
                </span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "border-0 mt-2",
                kpi.status.includes("High") || kpi.status.includes("Over") ? "bg-red-50 text-red-700" :
                kpi.status.includes("Medium") ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
              )}
            >
              {kpi.status}
            </Badge>
          </div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Overview */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Financial Overview</h3>
          </div>
          <div className="space-y-4">
            {financialData.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-slate-600">{item.label}</span>
                <span className={cn("font-semibold", item.color || "text-slate-900")}>{item.value}</span>
              </div>
            ))}
            <div className="pt-4 border-t mt-4 flex justify-between items-center bg-blue-50 p-3 rounded-lg">
              <span className="font-semibold text-slate-800">Current Contract Value</span>
              <span className="font-bold text-blue-700 text-lg">$15.5M</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white p-6 rounded-xl border shadow-sm border-l-4 border-l-orange-400">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-slate-800">Alerts & Recommended Actions</h3>
          </div>
          <ul className="space-y-4">
            {alertsData.map((alert, index) => (
              <li key={index} className="flex gap-2 text-sm text-slate-600">
                <span className="text-orange-500 mt-1.5">•</span>
                <span dangerouslySetInnerHTML={{ 
                  __html: alert.text
                    .replace(/Renew by \d{4}-\d{2}-\d{2}/, '<span class="font-bold text-slate-800">$&</span>')
                    .replace(/Pending .*? review/, '<span class="font-bold text-slate-800">$&</span>')
                    .replace(/requires approval/, '<span class="font-bold text-slate-800">requires approval</span>')
                }} />
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Analysis */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Clause & Legal Analysis</h3>
          </div>
          <div className="space-y-4">
            {legalData.map((item, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-4 rounded-lg bg-slate-50 border-l-4",
                  item.color === "red" ? "border-l-red-500" :
                  item.color === "green" ? "border-l-green-500" : "border-l-yellow-500"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                  <Badge 
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 border-0 rounded-sm",
                      item.color === "red" ? "bg-red-100 text-red-700" :
                      item.color === "green" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
                    )}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-700"><span className="font-semibold">Standard:</span> {item.desc.replace("Standard: ", "")}</p>
                  <p className="text-xs text-slate-700"><span className="font-semibold">Actual:</span> {item.actual.replace("Actual: ", "")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliverable Status */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6">Deliverable Status</h3>
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliverableData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {deliverableData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">15</span>
              <span className="text-xs text-slate-500">Deliverables</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {deliverableData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-600">{item.name} <span className="font-semibold text-slate-900">{item.value}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Activities</h3>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium">90 days</span>
              <span className="px-2 py-1 text-slate-400">60 days</span>
              <span className="px-2 py-1 text-slate-400">30 days</span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="change" stroke="#3B82F6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="claims" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="invoice" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rfi" stroke="#6366F1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ncr" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {["Change", "Claims", "Invoice", "RFI", "NCR", "Deliverables"].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", 
                  item === "Change" ? "bg-blue-500" : 
                  item === "Claims" ? "bg-green-500" :
                  item === "Invoice" ? "bg-yellow-500" :
                  item === "RFI" ? "bg-indigo-500" :
                  item === "NCR" ? "bg-red-500" : "bg-slate-800"
                )} />
                <span className="text-[10px] text-slate-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverable Summary & Vendor KPI */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Deliverable Summary</h3>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium">90 days</span>
                <span className="px-2 py-1 text-slate-400">60 days</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-900">45</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-xs text-green-600">On Time</p>
                <p className="text-xl font-bold text-green-700">32</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <p className="text-xs text-orange-600">Rejected</p>
                <p className="text-xl font-bold text-orange-700">5</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <p className="text-xs text-red-600">Late/Missed</p>
                <p className="text-xl font-bold text-red-700">8</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Vendor KPI</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Avg. Response Time</span>
                  <span className="text-slate-500">4 days</span>
                </div>
                <Progress value={60} className="h-1.5" variant="success" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Quality Score</span>
                  <span className="text-slate-500">90%</span>
                </div>
                <Progress value={90} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">On-Time Delivery</span>
                  <span className="text-slate-500">90%</span>
                </div>
                <Progress value={90} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Customer Satisfaction</span>
                  <span className="text-slate-500">100%</span>
                </div>
                <Progress value={100} className="h-1.5" variant="success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-slate-800">Documents & Attachments</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <p className="font-semibold text-slate-900">Amendments (3)</p>
            <p className="text-xs text-slate-500">View all</p>
          </div>
          <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <p className="font-semibold text-slate-900">Insurance</p>
            <p className="text-xs text-slate-500">4 Polices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
