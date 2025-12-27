import React from "react";
import { SEOWrapper } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Share2 } from "lucide-react";
import EmployeeCardPopover from "./components/EmployeeCardPopover";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import ChangeStatsCards from "./components/ChangeStatsCards";
import ChangeTable from "./components/ChangeTable";
import ClaimsStatsCards from "./components/ClaimsStatsCards";
import ClaimsTable from "./components/ClaimsTable";
import ApproversTable from "./components/ApproversTable";
import InvoiceStatsCards from "./components/InvoiceStatsCards";
import InvoiceTable from "./components/InvoiceTable";
import DeliverablesStatsCards from "./components/DeliverablesStatsCards";
import DeliverablesTable from "./components/DeliverablesTable";
import LemStatsCards from "./components/LemStatsCards";
import LemTable from "./components/LemTable";
import RfiStatsCards from "./components/RfiStatsCards";
import RfiTable from "./components/RfiTable";
import DocumentsStatsCard from "./components/DocumentsStatsCard";
import DocumentsList from "./components/DocumentsList";

const ContractDetailPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <SEOWrapper
        title="Contract Details - SwiftPro eProcurement Portal"
        description="View contract overview, team, and key information."
        canonical="/dashboard/contract-management/:id"
        robots="noindex, nofollow"
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/contract-management">
              Contracts
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Contract Details</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Construction Services Agreement</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">
            Construction Services Agreement
          </h1>
          <p className="text-sm text-slate-500">CON-2025-10</p>
          <Button variant="secondary" className="mt-4">
            Approval Settings
          </Button>
        </div>
        <Badge className="bg-green-100 text-green-700">Active</Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full bg-transparent space-y-4">
        <TabsList className="h-auto rounded-none border-b border-gray-300 dark:border-gray-600 dark:bg-transparent p-0 w-full justify-start bg-transparent">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="change"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Change Management
          </TabsTrigger>
          <TabsTrigger
            value="claims"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Claims
          </TabsTrigger>
          <TabsTrigger
            value="invoice"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Invoice
          </TabsTrigger>
          <TabsTrigger
            value="rfi"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            RFI
          </TabsTrigger>
          <TabsTrigger
            value="lem"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            LEM
          </TabsTrigger>
          <TabsTrigger
            value="approvers"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Approvers
          </TabsTrigger>
          <TabsTrigger
            value="deliverables"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Deliverables
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold text-gray-600">
              Contract Details
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Export Report
              </Button>
              <Button>Edit Contract</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <span className="text-slate-500">Contract Name</span>
                <span className="text-slate-900 font-medium">
                  Construction Services Agreement
                </span>
                <span className="text-slate-500">Project Name</span>
                <span className="text-slate-900">
                  IT Infrastructure Upgrade Project
                </span>
                <span className="text-slate-500">Effective Date</span>
                <span className="text-slate-900">Date</span>
                <span className="text-slate-500">Published Date</span>
                <span className="text-slate-900">dATE</span>
              </div>
              <div className="space-y-2">
                <span className="text-slate-500">Status</span>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <span className="text-slate-500">Contract ID</span>
                <span className="text-slate-900">CON-2025-10</span>
                <span className="text-slate-500">Project Relationship</span>
                <span className="text-slate-900">Stand-Alone Project</span>
                <span className="text-slate-500">End Date</span>
                <span className="text-slate-900">dATE</span>
                <span className="text-slate-500">Contract Manager</span>
                <a href="#" className="text-blue-600 underline">
                  Mike@acme.com
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-slate-500">Description</span>
            <p className="text-slate-700 max-w-3xl">
              “Lorem ipsum dolor sit amet consectetur. Volutpat quis egestas
              nunc egestas ut sed accumsan commodo vitae. Ullamcorper feugiat
              pulvinar consectetur vel natoque amet enim ac sed. Laoreet
              fringilla sollicitudin pharetra sit proin dictum. Sit sed lorem
              mauris.”
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-base font-semibold text-gray-600">
              Contract Team
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-slate-500">Contract Manager</span>
                <EmployeeCardPopover
                  triggerLabel="Wisdom Kaye"
                  name="Wisdom Kaye"
                />
                <span className="text-slate-500">Internal Stakeholder</span>
                <div className="flex flex-col gap-1">
                  <EmployeeCardPopover
                    triggerLabel="Kanayo Kanayo"
                    name="Kanayo Kanayo"
                  />
                  <EmployeeCardPopover
                    triggerLabel="Will Smith"
                    name="Will Smith"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-slate-500">Vendor/Contractor</span>
                <EmployeeCardPopover
                  triggerLabel="Kaye Wisdom"
                  name="Kaye Wisdom"
                />
                <span className="text-slate-500">
                  Vendor/Contractor Key Personnel
                </span>
                <div className="flex flex-col gap-1">
                  <EmployeeCardPopover
                    triggerLabel="Olamide Oladehinde"
                    name="Olamide Oladehinde"
                  />
                  <EmployeeCardPopover
                    triggerLabel="Oluwaseun Oladehinde"
                    name="Oluwaseun Oladehinde"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="change" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-600">Change</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Export Report
              </Button>
              <Button>Create Change</Button>
            </div>
          </div>

          <ChangeStatsCards />

          <Tabs defaultValue="all" className="w-full bg-transparent">
            <TabsList className="h-auto rounded-none border-b border-[#E9E9EB] dark:border-slate-600 dark:bg-transparent p-0 w-full justify-start bg-transparent">
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
              >
                All Changes
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
              >
                Change Requests
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
              >
                Change Orders
              </TabsTrigger>
              <TabsTrigger
                value="directive"
                className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
              >
                Change Directive
              </TabsTrigger>
              <TabsTrigger
                value="proposal"
                className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
              >
                Change Proposal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ChangeTable />
            </TabsContent>
            <TabsContent value="requests">
              <ChangeTable />
            </TabsContent>
            <TabsContent value="orders">
              <ChangeTable />
            </TabsContent>
            <TabsContent value="directive">
              <ChangeTable />
            </TabsContent>
            <TabsContent value="proposal">
              <ChangeTable />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="claims" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-600">Claims</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>

          <ClaimsStatsCards />

          <ClaimsTable />
        </TabsContent>

        <TabsContent value="approvers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-600">Approvers</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>

          <ApproversTable />
        </TabsContent>

        <TabsContent value="invoice" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-600">Invoice</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>

          <InvoiceStatsCards />

          <InvoiceTable />
        </TabsContent>

        <TabsContent value="deliverables" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-600">
              Deliverable
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>

          <DeliverablesStatsCards />

          <DeliverablesTable />
        </TabsContent>

        <TabsContent value="lem" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-600">
              Labor, Equipment & Material Reports
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>

          <LemStatsCards />

          <LemTable />
        </TabsContent>

        <TabsContent value="rfi" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-600">RFI</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Export Report</Button>
              <Button>Issue RFI</Button>
            </div>
          </div>

          <RfiStatsCards />

          <Tabs defaultValue="all" className="w-full bg-transparent">
            <TabsList className="h-auto rounded-none border-b border-[#E9E9EB] dark:border-slate-600 dark:bg-transparent p-0 w-full justify-start bg-transparent">
              <TabsTrigger value="all" className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3">All RFI</TabsTrigger>
              <TabsTrigger value="issued" className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3">Issued</TabsTrigger>
              <TabsTrigger value="received" className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3">Received</TabsTrigger>
            </TabsList>
            <TabsContent value="all"><RfiTable /></TabsContent>
            <TabsContent value="issued"><RfiTable /></TabsContent>
            <TabsContent value="received"><RfiTable /></TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-600">Documents</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Export Report</Button>
              <Button>Edit Contract</Button>
            </div>
          </div>

          <DocumentsStatsCard />

          <DocumentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractDetailPage;
