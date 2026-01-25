import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import ChangeStatsCards from "../components/ChangeStatsCards";
import ChangeTable from "../components/ChangeTable";
import CreateChangeDialog from "../components/CreateChangeDialog";

const ChangeTabContent: React.FC = () => {
  return (
    <TabsContent value="change" className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1F2937]">Change Management</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#111827] hover:bg-[#F9FAFB]"
          >
            <Share2 className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <CreateChangeDialog
            trigger={
              <Button className="h-10 rounded-xl bg-[#F3F4F6] px-4 text-sm font-medium text-[#111827] hover:bg-[#E5E7EB]">
                Create Change
              </Button>
            }
          />
        </div>
      </div>

      <ChangeStatsCards />

      <Tabs defaultValue="all" className="w-full bg-transparent">
        <TabsList className="inline-flex w-fit items-center gap-1 rounded-full bg-[#EEF1F4] p-1 mb-3">
          <TabsTrigger
            value="all"
            className="rounded-full px-5 py-4 text-sm font-medium text-[#6B6B6B] data-[state=active]:bg-[#2A4467] data-[state=active]:text-white"
          >
            All Changes
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="rounded-full px-5 py-4 text-sm font-medium text-[#6B6B6B] data-[state=active]:bg-[#2A4467] data-[state=active]:text-white"
          >
            Change Requests
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="rounded-full px-5 py-4 text-sm font-medium text-[#6B6B6B] data-[state=active]:bg-[#2A4467] data-[state=active]:text-white"
          >
            Change Orders
          </TabsTrigger>
          <TabsTrigger
            value="directive"
            className="rounded-full px-5 py-4 text-sm font-medium text-[#6B6B6B] data-[state=active]:bg-[#2A4467] data-[state=active]:text-white"
          >
            Change Directive
          </TabsTrigger>
          <TabsTrigger
            value="proposal"
            className="rounded-full px-5 py-4 text-sm font-medium text-[#6B6B6B] data-[state=active]:bg-[#2A4467] data-[state=active]:text-white"
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
  );
};

export default ChangeTabContent;
