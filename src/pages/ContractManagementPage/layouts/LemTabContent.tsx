import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import LemStatsCards from "../components/LemStatsCards";
import LemTable from "../components/LemTable";

const LemTabContent: React.FC = () => {
  return (
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
  );
};

export default LemTabContent;
