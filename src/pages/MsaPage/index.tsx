import React from "react";
import { SEOWrapper } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import StatsCards from "./components/StatsCards";
import EmptyState from "./components/EmptyState";
import MsaTable from "./components/MsaTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MsaPage: React.FC = () => {
  const hasData = true;
  return (
    <div className="space-y-8">
      <SEOWrapper
        title="Master Service Agreements (MSA) - SwiftPro eProcurement Portal"
        description="Manage Master Service Agreements with clear status tracking and quick actions."
        canonical="/dashboard/msa"
        robots="noindex, nofollow"
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">MSA</h2>
        <div className="flex items-center gap-4">
          <Button className="rounded-xl" data-testid="create-msa-button">
            <Plus className="mr-2 h-4 w-4" /> Create MSA
          </Button>
        </div>
      </div>

      <StatsCards
        counts={{
          all: 52,
          active: 11,
          draft: 52,
          suspended: 52,
          expired: 52,
          terminated: 52,
          pending: 52,
          linked: 52,
        }}
      />

      {hasData ? (
        <Tabs defaultValue="all" className="w-full bg-transparent space-y-4">
          <TabsList className="h-auto rounded-none border-b border-gray-300 dark:border-gray-600 dark:bg-transparent p-0 w-full justify-start bg-transparent">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              All MSA
            </TabsTrigger>
            <TabsTrigger
              value="mine"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              My MSA
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <MsaTable />
          </TabsContent>
          <TabsContent value="mine">
            <MsaTable />
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default MsaPage;

