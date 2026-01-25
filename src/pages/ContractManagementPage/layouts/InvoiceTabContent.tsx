import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import InvoiceStatsCards from "../components/InvoiceStatsCards";
import InvoiceTable from "../components/InvoiceTable";

const InvoiceTabContent: React.FC = () => {
  return (
    <TabsContent value="invoice" className="space-y-6">
      <div className="flex items-center">
        <h3 className="text-base font-semibold text-slate-900">Invoice</h3>
      </div>

      <InvoiceStatsCards />

      <InvoiceTable />
    </TabsContent>
  );
};

export default InvoiceTabContent;
