import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";
import EmployeeCardPopover from "../components/EmployeeCardPopover";

const OverviewTab: React.FC = () => {
  return (
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
          “Lorem ipsum dolor sit amet consectetur. Volutpat quis egestas nunc
          egestas ut sed accumsan commodo vitae. Ullamcorper feugiat pulvinar
          consectetur vel natoque amet enim ac sed. Laoreet fringilla
          sollicitudin pharetra sit proin dictum. Sit sed lorem mauris.”
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-base font-semibold text-gray-600">
          Contract Team
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <span className="text-slate-500">Contract Manager</span>
            <EmployeeCardPopover triggerLabel="Wisdom Kaye" name="Wisdom Kaye" />
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
            <EmployeeCardPopover triggerLabel="Kaye Wisdom" name="Kaye Wisdom" />
            <span className="text-slate-500">Vendor/Contractor Key Personnel</span>
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
  );
};

export default OverviewTab;
