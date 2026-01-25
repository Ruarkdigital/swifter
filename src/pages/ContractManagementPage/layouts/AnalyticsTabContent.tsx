import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import AnalyticsTab from "../components/AnalyticsTab";

const AnalyticsTabContent: React.FC = () => {
  return (
    <TabsContent value="analytics" className="space-y-6">
      <AnalyticsTab />
    </TabsContent>
  );
};

export default AnalyticsTabContent;
