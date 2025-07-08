import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download, Loader2 } from "lucide-react";
import { getRequest, putRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { useToastHandler } from "@/hooks/useToaster";
// import { useUser } from "@/store/authSlice";
import { format } from "date-fns";
import { PageLoader } from "@/components/ui/PageLoader";

// Types based on API documentation
type SolicitationType = {
  _id: string;
  name: string;
};

type Category = {
  _id: string;
  name: string;
};

type SolicitationEvent = {
  _id: string;
  name: string;
  date: string;
  description?: string;
};

type SolicitationFile = {
  _id: string;
  name: string;
  title: string;
  url: string;
  size: number;
  type: string;
};

type SolicitationVendor = {
  email: string;
  status: "invited" | "confirmed" | "declined";
  id: {
    _id: string;
    name: string;
  };
  responseStatus: string;
};

type SolicitationDetails = {
  _id: string;
  name: string;
  typeId: SolicitationType;
  type?: SolicitationType;
  categoryIds: Category[];
  categories: Category[];
  submissionDeadline: string;
  estimatedCost?: number;
  description: string;
  visibility: "public" | "private";
  status: "invited" | "confirmed" | "declined";
  questionDeadline?: string;
  bidIntentDeadline?: string;
  timezone: string;
  solId: string;
  events: SolicitationEvent[];
  files: SolicitationFile[];
  vendors: SolicitationVendor[];
  contact: string;
  vendorConfirmed: number;
  vendorDeclined: number;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  createdBy: { name: string; _id: string; email: string };
  projectOwner?: {
    name: string;
    email: string;
    phone?: string;
  };
};

interface SolicitationDetailsSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  solicitation?: {
    id: string;
    solicitationName: string;
    status: string;
  };
}

const SolicitationDetailsSheet: React.FC<SolicitationDetailsSheetProps> = ({
  open,
  onOpenChange,
  solicitation,
}) => {
  const queryClient = useQueryClient();
  const toastHandlers = useToastHandler();
  // const user = useUser();

  // Fetch solicitation details from API
  const {
    data: solicitationData,
    isLoading,
    error,
  } = useQuery<
    ApiResponse<{
      details: SolicitationDetails;
      requiredFiles: SolicitationFile[];
    }>,
    ApiResponseError
  >({
    queryKey: ["solicitation-details", solicitation?.id],
    queryFn: async () =>
      await getRequest({ url: `/vendor/solicitations/${solicitation?.id}` }),
    enabled: !!solicitation?.id && open,
  });

  // Mutation for confirming solicitation invitation
  const confirmMutation = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    undefined
  >({
    mutationFn: () =>
      putRequest({ url: `/vendor/solicitations/${solicitation?.id}/confirm` }),
    onSuccess: (result) => {
      toastHandlers.success(
        "Invitation Confirmed",
        result.data.message || "Successfully confirmed interest in solicitation"
      );
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: ["solicitation-details", solicitation?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["vendor-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-solicitations"] });
      // Close the sheet
      onOpenChange?.(false);
    },
    onError: (error) => {
      toastHandlers.error(
        "Confirmation Failed",
        error.message || "Failed to confirm interest in solicitation"
      );
    },
  });

  // Mutation for declining solicitation invitation
  const declineMutation = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    undefined
  >({
    mutationFn: () =>
      putRequest({ url: `/vendor/solicitations/${solicitation?.id}/decline` }),
    onSuccess: (result) => {
      toastHandlers.success(
        "Invitation Declined",
        result.data.message || "Successfully declined solicitation invitation"
      );
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: ["solicitation-details", solicitation?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["vendor-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-solicitations"] });
      // Close the sheet
      onOpenChange?.(false);
    },
    onError: (error) => {
      toastHandlers.error(
        "Decline Failed",
        error.message || "Failed to decline solicitation invitation"
      );
    },
  });

  // Handler functions
  const handleConfirm = () => {
    confirmMutation.mutate(undefined);
  };

  const handleDecline = () => {
    declineMutation.mutate(undefined);
  };

  const details = solicitationData?.data?.data.details;
  const files = solicitationData?.data?.data.requiredFiles || [];

  // Find current vendor's status
  // const currentVendor = details?.vendors?.find(
  //   (vendor) => vendor.email === user?.email
  // );
  // const currentVendorStatus = currentVendor?.status;

  // Determine if buttons should be hidden
  const shouldHideButtons =
    details?.status === "confirmed" ||
    details?.status === "declined";

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "MMMM dd, yyyy, pppp");
  };

  const formatTime = (dateString: string): string => {
    return format(new Date(dateString), "hh:mm a");
  };

  // Map status to badge variant
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return {
          text: "Active",
          className:
            "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300",
        };
      case "draft":
        return {
          text: "Draft",
          className:
            "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
        };
      case "closed":
        return {
          text: "Closed",
          className:
            "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300",
        };
      case "awarded":
        return {
          text: "Awarded",
          className:
            "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300",
        };
      case "evaluating":
        return {
          text: "Evaluating",
          className:
            "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300",
        };
      default:
        return {
          text: "Not Selected",
          className:
            "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
        };
    }
  };

  const statusBadge = getStatusBadge(
    details?.status || solicitation?.status || ""
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <h6 className="text-green-600 dark:text-green-400 underline underline-offset-8 cursor-pointer">
          View Details
        </h6>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 overflow-auto"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Solicitation Details
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <PageLoader
              showHeader={false}
              message="Loading solicitation details..."
              className="py-8"
            />
          ) : error ? (
            <div className="px-6 py-8 text-center">
              <p className="text-red-600 dark:text-red-400">
                Failed to load solicitation details
              </p>
            </div>
          ) : (
            <>
              {/* Project Header */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {details?.name ||
                      solicitation?.solicitationName ||
                      "Solicitation Details"}
                  </h1>
                  <Badge
                    className={`${statusBadge.className} hover:${statusBadge.className}`}
                  >
                    {statusBadge.text}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{details?.solId}</span>
                  <span>•</span>
                  <span>{details?.typeId?.name || details?.type?.name}</span>
                </div>
              </div>

              {/* Navigation Tabs - Origin UI Style */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="h-auto rounded-none border-b border-gray-300 dark:border-gray-600 !bg-transparent outline-0 p-0 px-6 w-full justify-start">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
                  >
                    Documents
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  {/* Solicitation Details Section */}
                  <div className="px-6 py-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                      Solicitation Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Category
                          </h3>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {details?.categoryIds
                              ?.map((cat) => cat.name)
                              .join(", ") ||
                              details?.categories
                                ?.map((cat) => cat.name)
                                .join(", ") ||
                              "Not specified"}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Created by
                          </h3>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {details?.createdBy?.name || "Not specified"}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Description
                          </h3>
                          <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                            {details?.description || "No description provided"}
                          </p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Project Owner
                          </h3>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {details?.projectOwner?.name ||
                              details?.createdBy?.name ||
                              "Not specified"}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Reference Number
                          </h3>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {details?.solId || "Not specified"}
                          </p>
                        </div>

                        {details?.estimatedCost && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Estimated Cost
                            </h3>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              ${details.estimatedCost.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Bid Details Section */}
                  <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                      Timeline & Bid Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Submission Deadline
                          </h3>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {details?.submissionDeadline
                              ? formatDate(details.submissionDeadline)
                              : "Not specified"}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Timezone
                          </h3>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {details?.timezone || "Not specified"}
                          </p>
                        </div>

                        {details?.bidIntentDeadline && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Bid Intent Deadline Date
                            </h3>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {formatDate(details.bidIntentDeadline)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {details?.questionDeadline && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Question Acceptance Deadline
                            </h3>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {formatDate(details.questionDeadline)}
                            </p>
                          </div>
                        )}

                        {details?.bidIntentDeadline && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Bid Intent Deadline Time
                            </h3>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {formatTime(details.bidIntentDeadline)}
                            </p>
                          </div>
                        )}

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Visibility
                          </h3>
                          <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                            {details?.visibility || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  {/* Documents Section */}
                  <div className="px-6 py-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                      All Documents
                    </h2>

                    {files && files.length > 0 ? (
                      <div className="space-y-4">
                        {files.map((doc) => (
                          <div
                            key={doc._id}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">
                                  {doc.type.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {doc.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {doc.type.toUpperCase()} •{" "}
                                  {doc.size}
                                </p>
                              </div>
                            </div>
                            {doc.url && (
                              <div className="flex items-center space-x-2">
                                <button
                                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => window.open(doc.url, "_blank")}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 text-blue-400 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = doc.url;
                                    link.download = doc.name;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          No documents available
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Footer */}
              {shouldHideButtons && (
                <div className="px-6 py-4 mb-5">
                  <div className="flex space-x-3">
                    <ConfirmAlert
                      type="error"
                      title="Decline Invitation"
                      text="Are you sure you want to decline this solicitation invitation? This action cannot be undone."
                      primaryButtonText="Yes, Decline"
                      secondaryButtonText="Cancel"
                      onPrimaryAction={handleDecline}
                      trigger={
                        <Button
                          variant="outline"
                          className="px-6 w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          disabled={
                            declineMutation.isPending ||
                            confirmMutation.isPending
                          }
                        >
                          {declineMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Declining...
                            </>
                          ) : (
                            "Decline"
                          )}
                        </Button>
                      }
                    />
                    <ConfirmAlert
                      type="success"
                      title="Confirm Interest"
                      text="Are you sure you want to confirm your interest in this solicitation? You will be able to submit a proposal."
                      primaryButtonText="Yes, Confirm"
                      secondaryButtonText="Cancel"
                      onPrimaryAction={handleConfirm}
                      trigger={
                        <Button
                          className="px-6 w-full"
                          disabled={
                            declineMutation.isPending ||
                            confirmMutation.isPending
                          }
                        >
                          {confirmMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            "Confirm Interest"
                          )}
                        </Button>
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SolicitationDetailsSheet;
