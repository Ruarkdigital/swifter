import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import RfiStatsCards from "../components/RfiStatsCards";
import RfiTable from "../components/RfiTable";

const RfiTabContent: React.FC = () => {
  return (
    <TabsContent value="rfi" className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-600">RFI</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button>Issue RFI</Button>
        </div>
      </div>

      <RfiStatsCards />

      <Tabs defaultValue="all" className="w-full bg-transparent">
        <TabsList className="h-auto rounded-none border-b border-[#E9E9EB] dark:border-slate-600 dark:bg-transparent p-0 w-full justify-start bg-transparent">
          <TabsTrigger
            value="all"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            All RFI
          </TabsTrigger>
          <TabsTrigger
            value="issued"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Issued
          </TabsTrigger>
          <TabsTrigger
            value="received"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Received
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <RfiTable />
        </TabsContent>
        <TabsContent value="issued">
          <RfiTable />
        </TabsContent>
        <TabsContent value="received">
          <RfiTable />
        </TabsContent>
      </Tabs>
    </TabsContent>
  );
};

export default RfiTabContent;
