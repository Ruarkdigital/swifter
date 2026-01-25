import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ComplianceSecurityTab from "../components/ComplianceSecurityTab";

const ComplianceTabContent: React.FC = () => {
  return (
    <TabsContent value="compliance" className="space-y-6">
      <ComplianceSecurityTab />
    </TabsContent>
  );
};

export default ComplianceTabContent;
