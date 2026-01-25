import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import ApproversTable from "../components/ApproversTable";

const ApproversTabContent: React.FC = () => {
  return (
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
  );
};

export default ApproversTabContent;
