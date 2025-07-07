import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, putRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";
import { useUser } from "@/store/authSlice";
import { PageLoader } from "@/components/ui/PageLoader";


type NotificationItem = {
  newSolicitations: ("email" | "push" | "sms")[];
  proposalUpdates: ("email" | "push" | "sms")[];
  evaluationAssignments: ("email" | "push" | "sms")[];
  upcomingDeadlines: ("email" | "push" | "sms")[];
  questionsUpdate: ("email" | "push" | "sms")[];
}

// Types for notification settings based on API documentation
export interface NotificationSettings extends NotificationItem {
  _id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type NotificationKey =
  | "newSolicitations"
  | "proposalUpdates"
  | "evaluationAssignments"
  | "upcomingDeadlines"
  | "questionsUpdate";

type NotificationCardProps = {
  title: string;
  settingKey: NotificationKey;
  settings: Omit<NotificationSettings, "_id" | "companyId" | "createdAt" | "updatedAt" | "__v"> | null;
  onSettingChange: (
    type: "email" | "push" | "sms",
    key: NotificationKey,
    value: boolean
  ) => void;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  settingKey,
  settings,
  onSettingChange,
}) => {
  return (
    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={settings?.[settingKey]?.includes("push") || false}
              onCheckedChange={(checked) =>
                onSettingChange("push", settingKey, checked)
              }
              className="data-[state=checked]:bg-[#2A4467] dark:data-[state=checked]:bg-[#2A4467]"
            />
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Push
            </Label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={settings?.[settingKey]?.includes("email") || false}
              onCheckedChange={(checked) =>
                onSettingChange("email", settingKey, checked)
              }
              className="data-[state=checked]:bg-[#2A4467] dark:data-[state=checked]:bg-[#2A4467]"
            />
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </Label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={settings?.[settingKey]?.includes("sms") || false}
              onCheckedChange={(checked) =>
                onSettingChange("sms", settingKey, checked)
              }
              className="data-[state=checked]:bg-[#2A4467] dark:data-[state=checked]:bg-[#2A4467]"
            />
            <Label className="text-sm text-gray-500 dark:text-gray-400">
              SMS
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  const user = useUser();
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } =
    useToastHandler();
  const [localSettings, setLocalSettings] =
    useState<Omit<NotificationSettings, "_id" | "companyId" | "createdAt" | "updatedAt" | "__v"> | null>(null);

  // Fetch notification settings
  const {
    data: notificationData,
    isLoading,
    error,
  } = useQuery<ApiResponse<NotificationSettings>, ApiResponseError>({
    queryKey: ["notification-settings"],
    queryFn: async () =>
      await getRequest({ url: `/notifications/settings/${user?.companyId}` }),
    staleTime: 5 * 60 * 1000,
  });

  // Update notification settings mutation
  const updateSettingsMutation = useMutation<
    ApiResponse<NotificationSettings>,
    ApiResponseError,
    NotificationItem
  >({
    mutationFn: async (updatedSettings) =>
      await putRequest({
        url: `/notifications/settings/${user?.companyId}`,
        payload: updatedSettings,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      showSuccessToast("Success", "Notification settings updated successfully");
    },
    onError: (error) => {
      showErrorToast(
        "Error",
        error.response?.data?.message ||
          "Failed to update notification settings"
      );
      // Revert local changes on error
      if (notificationData?.data?.data) {
        setLocalSettings(notificationData.data.data);
      }
    },
  });

  // Initialize local settings when data is loaded
  useEffect(() => {
    if (notificationData?.data?.data) {
      setLocalSettings(notificationData.data.data);
    }
  }, [notificationData]);

  // Handle setting changes
  const handleSettingChange = (
    type: "email" | "push" | "sms",
    key: NotificationKey,
    value: boolean
  ) => {
    if (!localSettings) return;

    const updatedSettings: NotificationItem = {
      newSolicitations: [],
      proposalUpdates: [],
      evaluationAssignments: [],
      upcomingDeadlines: [],
      questionsUpdate: [],
    };
    const currentArray = updatedSettings[key] as ("email" | "push" | "sms")[] || [] as ("email" | "push" | "sms")[];

    if (value) {
      // Add the notification type if it's not already in the array
      if (!currentArray.includes(type)) {
        updatedSettings[key] = [...currentArray, type] as ("email" | "push" | "sms")[];
      }
    } else {
      // Remove the notification type from the array
      updatedSettings[key] = currentArray.filter((item) => item !== type);
    }

    setLocalSettings(updatedSettings);

    // Debounce API calls to avoid too many requests
    const timeoutId = setTimeout(() => {
      // Only send the notification data, not the metadata fields
      const notificationData: NotificationItem = {
        newSolicitations: updatedSettings.newSolicitations,
        proposalUpdates: updatedSettings.proposalUpdates,
        evaluationAssignments: updatedSettings.evaluationAssignments,
        upcomingDeadlines: updatedSettings.upcomingDeadlines,
        questionsUpdate: updatedSettings.questionsUpdate,
      };
      updateSettingsMutation.mutate(notificationData);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  if (isLoading) {
    return (
      <PageLoader 
        showHeader={false}
        message="Loading notification settings..."
        className="p-6"
      />
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Notification settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Set platform-wide notifications and triggers
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500 dark:text-red-400">
            Error loading notification settings:{" "}
            {error.response?.data?.message || error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Notification settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set platform-wide notifications and triggers
        </p>
      </div>

      <div className="space-y-8">
        <NotificationCard
          title="New solicitations"
          settingKey="newSolicitations"
          settings={localSettings}
          onSettingChange={handleSettingChange}
        />
        <NotificationCard
          title="Proposal updates"
          settingKey="proposalUpdates"
          settings={localSettings}
          onSettingChange={handleSettingChange}
        />
        <NotificationCard
          title="Evaluation assignments"
          settingKey="evaluationAssignments"
          settings={localSettings}
          onSettingChange={handleSettingChange}
        />
        <NotificationCard
          title="Upcoming deadlines"
          settingKey="upcomingDeadlines"
          settings={localSettings}
          onSettingChange={handleSettingChange}
        />
        <NotificationCard
          title="Questions Update"
          settingKey="questionsUpdate"
          settings={localSettings}
          onSettingChange={handleSettingChange}
        />
      </div>

      {updateSettingsMutation.isPending && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Updating settings...
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
