import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Eye, Download } from "lucide-react";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { putRequest, getRequest } from "@/lib/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponse, ApiResponseError } from "@/types";
import { useState } from "react";
import { format } from "date-fns";

// Define the evaluator data type
type EvaluatorData = {
  id: string;
  evaluatorName: string;
  email: string;
  assignedDate: string;
  submittedDate: string;
  status: "Completed" | "Pending";
  totalScore: string;
  commentSummary: string;
};

// Define types for evaluator score API response
type EvaluatorScoreData = {
  email: string;
  name: string;
  dateAssigned: string | null;
  dateSubmitted: string;
  status: string;
  score: number | null;
  _id?: string; // Add evaluatorId if available in API response
};

type ViewEvaluatorScore = {
  averageScore: number;
  allEvaluators: number;
  submittedEvaluators: number;
  evaluators: EvaluatorScoreData[];
};

export interface VendorProposalData {
  proposalDetails: ProposalDetails;
  overview: Overview;
  submittedDocument: SubmittedDocument[];
}

export interface Criteria {
  title: string;
  criteria: CriteriaClass;
  scoring: number;
}

export interface CriteriaClass {}

export interface Overview {
  evaluation: number;
  uploads: number;
  criteria: Criteria[];
}

export interface ProposalDetails {
  name: string;
  vendor: string;
  contact: string;
  ref: string;
  submissiion: Date;
  status: string;
  score: number;
  allEvaluators: number;
}

export interface SubmittedDocument {
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedAt: Date;
  _id: string;
}

const ProposalDetailsPage: React.FC = () => {
  const { id, proposalId } = useParams<{ id: string; proposalId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toastHandlers = useToastHandler();
  const [showAwardModal, setShowAwardModal] = useState(false);

  // Get vendor ID from location state
  const vendorId = location.state?.vendorId || proposalId;

  // Fetch solicitation data
  const { data: solicitationData } = useQuery<
    ApiResponse<{ solicitation: { name: string; _id: string } }>,
    ApiResponseError
  >({
    queryKey: ["solicitation", id],
    queryFn: () =>
      getRequest({
        url: `/procurement/solicitations/${id}`,
      }),
    enabled: !!id,
  });

  // Fetch vendor proposal data
  const {
    data: proposalData,
    isLoading: isLoadingProposal,
    error: proposalError,
  } = useQuery<ApiResponse<VendorProposalData>, ApiResponseError>({
    queryKey: ["vendor-proposal", id, vendorId],
    queryFn: () =>
      getRequest({
        url: `/procurement/solicitations/${id}/vendor-proposal/${vendorId}`,
      }),
    enabled: !!(id && vendorId),
  });

  // Fetch evaluator scores data
  const {
    data: evaluatorScoresData,
    isLoading: isLoadingEvaluatorScores,
    error: evaluatorScoresError,
  } = useQuery<ApiResponse<ViewEvaluatorScore>, ApiResponseError>({
    queryKey: ["evaluator-scores", id],
    queryFn: () =>
      getRequest({
        url: `/procurement/solicitations/${id}/evaluator-score`,
      }),
    enabled: !!id,
  });

  const proposal = proposalData?.data?.data;
  const submittedDocument = proposalData?.data?.data?.submittedDocument || [];
  const solicitation = solicitationData?.data?.data?.solicitation;
  const criterias = proposalData?.data?.data?.overview?.criteria || [];
  const evaluatorScores = evaluatorScoresData?.data?.data;

  // Transform evaluator scores data for DataTable
  const evaluatorTableData: EvaluatorData[] = evaluatorScores?.evaluators?.map((evaluator, index) => ({
    id: evaluator._id || `evaluator-${index}`,
    evaluatorName: evaluator.name,
    email: evaluator.email,
    assignedDate: evaluator.dateAssigned 
      ? format(new Date(evaluator.dateAssigned), "MMM d, yyyy")
      : "N/A",
    submittedDate: evaluator.dateSubmitted 
      ? format(new Date(evaluator.dateSubmitted), "MMM d, yyyy")
      : "N/A",
    status: evaluator.status === "submitted" ? "Completed" : "Pending",
    totalScore: evaluator.score ? `${evaluator.score}/100` : "N/A",
    commentSummary: "View details for comments", // Placeholder as API doesn't provide comment summary
  })) || [];

  // Helper function to get file type styling
  const getFileTypeStyle = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "doc":
      case "docx":
        return {
          bgColor: "bg-blue-100",
          iconBg: "bg-blue-600",
          label: "DOC",
          shortLabel: "W",
        };
      case "pdf":
        return {
          bgColor: "bg-red-100",
          iconBg: "bg-red-600",
          label: "PDF",
          shortLabel: "PDF",
        };
      case "xls":
      case "xlsx":
        return {
          bgColor: "bg-green-100",
          iconBg: "bg-green-600",
          label: "XLS",
          shortLabel: "XLS",
        };
      case "zip":
      case "rar":
        return {
          bgColor: "bg-purple-100",
          iconBg: "bg-purple-600",
          label: "ZIP",
          shortLabel: "ZIP",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          iconBg: "bg-gray-600",
          label: extension?.toUpperCase() || "FILE",
          shortLabel: extension?.charAt(0).toUpperCase() || "F",
        };
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleExport = () => {
    if (!proposal) return;
    // Export proposal as PDF using the API endpoint
    const exportUrl = `/procurement/solicitations/${id}/vendor-proposal/${vendorId}/export`;
    window.open(
      `${process.env.REACT_APP_API_BASE_URL || ""}${exportUrl}`,
      "_blank"
    );
  };

  const awardVendorMutation = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    string
  >({
    mutationFn: (vendorId: string) =>
      putRequest({
        url: `/procurement/solicitations/${id}/award-vendor/${vendorId}`,
      }),
    onSuccess: (result) => {
      toastHandlers.success(
        "Award Vendor",
        result.data.message ?? "Vendor awarded successfully"
      );
      setShowAwardModal(false);
    },
    onError: (error) => {
      toastHandlers.error("Award Vendor", error);
    },
  });

  // Add remind evaluator mutation
  const remindEvaluatorMutation = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    string
  >({
    mutationFn: (evaluatorId: string) =>
      putRequest({
        url: `/procurement/solicitations/${id}/remind-evaluator/${evaluatorId}`,
      }),
    onSuccess: (result) => {
      toastHandlers.success(
        "Remind Evaluator",
        result.data.message ?? "Reminder sent successfully"
      );
    },
    onError: (error) => {
      toastHandlers.error("Remind Evaluator", error);
    },
  });

  const handleAwardVendor = () => {
    setShowAwardModal(true);
  };

  const handleConfirmAward = () => {
    // Note: vendorId should be passed from the award button context
    // This is a placeholder - actual implementation would need the specific vendor ID
    awardVendorMutation.mutate("vendor-id-placeholder");
  };

  // Handle remind evaluator
  const handleRemindEvaluator = (evaluatorId: string) => {
    remindEvaluatorMutation.mutate(evaluatorId);
  };

  // Handle view evaluator score card
  const handleViewEvaluator = (evaluatorId: string) => {
    // Navigate to evaluator score card page
    navigate(`/procurement/solicitations/${id}/evaluator-score-card/${evaluatorId}`);
  };

  // Define columns for the evaluator scores table
  const evaluatorColumns: ColumnDef<EvaluatorData>[] = [
    {
      accessorKey: "evaluatorName",
      header: "Evaluator Name",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-white">
            {row.original.evaluatorName}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400 underline cursor-pointer">
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Assigned: {row.original.assignedDate}
          </div>
          <div className="text-sm text-gray-900 dark:text-white">
            Submitted: {row.original.submittedDate}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="secondary"
            className={`${
              status === "Completed"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "totalScore",
      header: "Total Score",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {row.original.totalScore}
        </div>
      ),
    },
    {
      accessorKey: "commentSummary",
      header: "Comment Summary",
      cell: ({ row }) => (
        <div className="text-gray-900 dark:text-white">
          {row.original.commentSummary}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className="flex items-center space-x-2">
            {status === "Completed" ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-0 h-auto font-normal"
                onClick={() => handleViewEvaluator(row.original.id)}
              >
                View
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-0 h-auto font-normal"
                onClick={() => handleRemindEvaluator(row.original.id)}
                disabled={remindEvaluatorMutation.isPending}
              >
                {remindEvaluatorMutation.isPending ? "Sending..." : "Remind"}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div onClick={handleBack} className="text-sm text-gray-500 dark:text-gray-400 space-x-2 cursor-pointer">
            Solicitations &gt; {solicitation?.name || "Loading..."} &gt; Vendors
            &gt; {proposal?.proposalDetails?.vendor || "Loading..."}&#39;s
            Proposal Details
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Title and Export */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Proposal Details
          </h1>
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>

        {/* Loading State */}
        {isLoadingProposal && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              Loading proposal details...
            </div>
          </div>
        )}

        {/* Error State */}
        {proposalError && (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">
              Error loading proposal details. Please try again.
            </div>
          </div>
        )}

        {/* Proposal Overview */}
        {proposal && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Solicitation Name
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {solicitation?.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Contact
                </label>
                <p className="text-base text-blue-600 dark:text-blue-400 underline cursor-pointer">
                  {proposal?.proposalDetails?.contact || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Submission Date
                </label>
                <p className="text-base text-gray-900 dark:text-white">
                  {proposal?.proposalDetails?.submissiion
                    ? format(
                        new Date(proposal.proposalDetails.submissiion),
                        "MMMM d, yyyy pppp"
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Evaluation Score (Avg score)
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {proposal?.proposalDetails?.score
                    ? `${proposal.proposalDetails.score}%`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Vendor Name
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {proposal?.proposalDetails?.vendor || "N/A"}
                </p>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Reference Number
                </label>
                <p className="text-base text-gray-900 dark:text-white">
                  {proposal?.proposalDetails?.ref || "N/A"}
                </p>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                  Status
                </label>
                <Badge
                  variant="secondary"
                  className={`${
                    proposal?.proposalDetails?.status === "submit"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {proposal?.proposalDetails?.status === "submit"
                    ? "Submitted"
                    : proposal?.proposalDetails?.status || "N/A"}
                </Badge>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Amount
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  N/A
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Award Vendor Button */}
        {proposal && (
          <div className="flex justify-start">
            <Button
              onClick={handleAwardVendor}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={proposal?.proposalDetails?.status !== "submit"}
            >
              Award Vendor
            </Button>
          </div>
        )}

        {/* Award Vendor Confirmation Modal */}
        <ConfirmAlert
          open={showAwardModal}
          onClose={setShowAwardModal}
          type="award"
          title="Confirm Award Vendor"
          text="Are you sure you want to award this vendor? This action cannot be undone."
          primaryButtonText="Award Vendor"
          secondaryButtonText="Cancel"
          onPrimaryAction={handleConfirmAward}
          onSecondaryAction={() => setShowAwardModal(false)}
          hideDialog={false}
        />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="h-auto rounded-none border-b border-gray-300 dark:border-gray-600 !bg-transparent p-0 w-full justify-start">
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
              Submitted Documents
            </TabsTrigger>
            <TabsTrigger
              value="scores"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              Evaluator Scores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Submission Details */}
            <h4 className="text-xl font-medium mt-5 text-gray-900 dark:text-white">
              Submission Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Submission Date
                </label>
                <p className="text-base text-gray-900 dark:text-white">
                  {proposal?.proposalDetails?.submissiion
                    ? format(
                        new Date(proposal.proposalDetails.submissiion),
                        "MMMM d, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Vendor Contact
                </label>
                <p className="text-base text-blue-600 dark:text-blue-400 underline cursor-pointer">
                  {proposal?.proposalDetails?.contact || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Documents Uploaded
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {proposal?.submittedDocument?.length || 0}
                </p>
              </div>
            </div>

            {/* Evaluation Summary */}
            <h4 className="text-xl font-medium text-gray-900 dark:text-white">
              Evaluation Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Average Score
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {proposal?.proposalDetails?.score
                    ? `${proposal.proposalDetails.score}%`
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Evaluation
                </label>
                <p className="text-base text-gray-900 dark:text-white">
                  {proposal?.overview?.evaluation
                    ? `${proposal.overview.evaluation}% Complete`
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Criteria Breakdown */}
            <h4 className="text-xl font-medium text-gray-900 dark:text-white">
              Criteria Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {criterias.map((criteria, index) => (
                <div key={index}>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {criteria.title} ({criteria.scoring}%)
                  </label>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    Avg: N/A
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <h4 className="text-xl font-medium text-gray-900 dark:text-white">
              Submitted Documents
            </h4>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submittedDocument.length > 0 ? (
                submittedDocument.map((document: any, index: number) => {
                  const fileStyle = getFileTypeStyle(
                    document.fileName || document.name || "file"
                  );

                  return (
                    <Card
                      key={index}
                      className="border hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          {/* Left side - Icon and Info */}
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-12 h-12 ${fileStyle.bgColor} rounded-lg flex items-center justify-center`}
                              >
                                <div
                                  className={`w-6 h-6 ${fileStyle.iconBg} rounded-sm flex items-center justify-center`}
                                >
                                  <span className="text-white text-xs font-bold">
                                    {fileStyle.shortLabel}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                                {document.fileName ||
                                  document.name ||
                                  "Untitled Document"}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {fileStyle.label}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {document.size
                                    ? document.size
                                    : "Unknown size"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right side - Action Buttons */}
                          <div className="flex items-center gap-2 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0 bg-gray-100 dark:bg-slate-900 rounded-full hover:bg-gray-200"
                              title="View"
                              onClick={() => {
                                if (document.fileUrl || document.url) {
                                  window.open(
                                    document.fileUrl || document.url,
                                    "_blank"
                                  );
                                }
                              }}
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0 bg-blue-100 dark:bg-slate-900 rounded-full hover:bg-blue-200"
                              title="Download"
                              onClick={() => {
                                if (document.fileUrl || document.url) {
                                  const link =
                                    window.document.createElement("a");
                                  link.href = document.fileUrl || document.url;
                                  link.download =
                                    document.fileName ||
                                    document.name ||
                                    "download";
                                  window.document.body.appendChild(link);
                                  link.click();
                                  window.document.body.removeChild(link);
                                }
                              }}
                            >
                              <Download className="w-4 h-4 text-blue-500 dark:text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No documents submitted yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scores" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-medium text-gray-900 dark:text-white">
                  Evaluators
                </h4>
                {evaluatorScores && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {evaluatorScores.submittedEvaluators} of {evaluatorScores.allEvaluators} evaluators submitted
                    {evaluatorScores.averageScore && (
                      <span className="ml-4">
                        Average Score: <span className="font-medium">{evaluatorScores.averageScore.toFixed(1)}/100</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Loading State */}
              {isLoadingEvaluatorScores && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500 dark:text-gray-400">
                    Loading evaluator scores...
                  </div>
                </div>
              )}
              
              {/* Error State */}
              {evaluatorScoresError && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-red-500">
                    Error loading evaluator scores. Please try again.
                  </div>
                </div>
              )}
              
              {/* Data Table */}
              {!isLoadingEvaluatorScores && !evaluatorScoresError && (
                <DataTable
                  data={evaluatorTableData}
                  columns={evaluatorColumns}
                  options={{
                    disablePagination: true,
                    disableSelection: true,
                    isLoading: isLoadingEvaluatorScores,
                    totalCounts: evaluatorTableData.length,
                    manualPagination: false,
                    setPagination: () => {},
                    pagination: { pageIndex: 0, pageSize: 10 },
                  }}
                  classNames={{
                    table: "border-separate border-spacing-y-2",
                    tHeader: "bg-gray-50 dark:bg-slate-800",
                    tHead:
                      "text-left font-medium text-gray-700 dark:text-gray-300 py-3 px-4",
                    tRow: "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg",
                    tCell: "py-4 px-4 text-sm",
                  }}
                />
              )}
              
              {/* Empty State */}
              {!isLoadingEvaluatorScores && !evaluatorScoresError && evaluatorTableData.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No evaluators assigned to this solicitation yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmAlert
        open={showAwardModal}
        onClose={setShowAwardModal}
        onPrimaryAction={handleConfirmAward}
        title="Award Vendor"
        text="Are you sure you want to award this vendor? This action cannot be undone."
        primaryButtonText="Award Vendor"
        secondaryButtonText="Cancel"
        type="award"
        showSecondaryButton={true}
      />
    </div>
  );
};

export default ProposalDetailsPage;
