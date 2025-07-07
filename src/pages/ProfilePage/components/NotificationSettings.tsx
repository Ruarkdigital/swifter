import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NotificationCard = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              defaultChecked
              className="data-[state=checked]:bg-[#2A4467] dark:data-[state=checked]:bg-[#2A4467]"
            />
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Push</Label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              defaultChecked
              className="data-[state=checked]:bg-[#2A4467] dark:data-[state=checked]:bg-[#2A4467]"
            />
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch className="data-[state=checked]:bg-[#2A4467] dark:data-[state=checked]:bg-[#2A4467]" />
            <Label className="text-sm text-gray-500 dark:text-gray-400">SMS</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Notification settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          We may still send you important notifications about your account
          outside of your notification settings.
        </p>
      </div>

      <div className="space-y-8">
        {/* New solicitations */}
        {/* <div className="flex justify-between border-t border-gray-200 pt-4">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            New solicitations
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  defaultChecked
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label className="text-sm font-medium text-gray-700">
                  Push
                </Label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  defaultChecked
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label className="text-sm font-medium text-gray-700">
                  Email
                </Label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch className="data-[state=checked]:bg-blue-600" />
                <Label className="text-sm text-gray-500">SMS</Label>
              </div>
            </div>
          </div>
        </div> */}
        <NotificationCard title="New solicitations" />

        {/* Proposal updates */}
       
        <NotificationCard title="Proposal updates" />
       

        {/* Evaluation assignments */}
        <NotificationCard title="Evaluation assignments" />

        {/* Upcoming deadlines */}
        <NotificationCard title="Upcoming deadlines" />

        {/* Questions Update */}
        <NotificationCard title="Questions Update" />
      </div>
    </div>
  );
};

export default NotificationSettings;
