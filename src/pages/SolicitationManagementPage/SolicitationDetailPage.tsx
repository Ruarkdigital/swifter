import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EvaluationScorecard from "./components/EvaluationScorecard";
import DocumentsTab from "./components/DocumentsTab";
import QuestionsTab from "./components/QuestionsTab";
import AddendumsTab from "./components/AddendumsTab";
import EditSolicitationDialog from "./components/EditSolicitationDialog";
import ProposalDetailsSheet from "./components/ProposalDetailsSheet";
import {
  ChevronRight,
  Users,
  FileText,
  Folder,
  Search,
  FolderOpen,
  Share2,
  ChevronDown,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, putRequest, deleteRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { useToastHandler } from "@/hooks/useToaster";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useUserRole } from "@/hooks/useUserRole";
import { format } from "date-fns";
import { PageLoader } from "@/components/ui/PageLoader";

// Vendor proposal type definition
type VendorProposal = {
  id: string;
  vendorName: string;
  companyName: string;
  email: string;
  submissionDate: string;
  status: "Submitted" | "Under Review" | "Accepted" | "Rejected" | "Pending";
  proposalValue: number;
  documents: number;
  evaluationScore?: number;
};

// Evaluator type definition based on API response
export interface Evaluator {
  _id: null;
  groups: Group[];
  averageProgress: null;
  totalEvaluatorsInEvaluation: number;
}

export interface Group {
  groupId: string;
  groupName: string;
  evaluators: EvaluatorElement[];
  criteriaCount: null;
  totalEvaluators: number;
  groupProgress: null;
  completedEvaluators: number;
}

export interface EvaluatorElement {
  _id: string;
  name: string;
  email: string;
  progress: null;
  status: null;
  assignnOn: Date;
}

// Define Solicitation type based on API response
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
  owner: boolean;
};

type Solicitation = {
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
  status: "draft" | "active" | "closed" | "awarded" | "evaluating";
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
  participation?: {
    invitedVendors: number;
    proposalsReceived: number;
    evaluators: number;
    documents: number;
  };
};

export interface RequiredFile {
  _id: string;
  title: string;
  type: string;
}

const ParticipationCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: number;
  icon: any;
  iconColor: string;
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 dark:border-slate-800 rounded-xl border border-gray-200">
      <div className="flex flex-col">
        <div className="text-sm text-gray-500  mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          {value}
        </div>
      </div>
      <div
        className={`p-3 rounded-full ${
          iconColor === "blue"
            ? "bg-blue-50"
            : iconColor === "green"
            ? "bg-green-50"
            : iconColor === "purple"
            ? "bg-purple-50"
            : "bg-gray-50"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            iconColor === "blue"
              ? "text-blue-600"
              : iconColor === "green"
              ? "text-green-600"
              : iconColor === "purple"
              ? "text-purple-600"
              : "text-gray-600"
          }`}
        />
      </div>
    </div>
  );
};

// Status badge component for solicitation status
const StatusBadge = ({
  status,
}: {
  status: "draft" | "active" | "closed" | "awarded" | "evaluating";
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "awarded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "evaluating":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "draft":
        return "Draft";
      case "awarded":
        return "Awarded";
      case "closed":
        return "Closed";
      case "evaluating":
        return "Under Evaluation";
      default:
        return status;
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0`}>
      {getStatusLabel(status)}
    </Badge>
  );
};

// Status badge component for vendor proposals
const ProposalStatusBadge = ({
  status,
}: {
  status: VendorProposal["status"];
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0`}>{status}</Badge>
  );
};

// Status badge component for evaluators
const EvaluatorStatusBadge = ({ status }: { status: string | null }) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const displayStatus = status || "Pending";

  return (
    <Badge className={`${getStatusColor(displayStatus)} border-0`}>
      {displayStatus}
    </Badge>
  );
};

// Invited Vendor Card Component
export const InvitedVendorCard = ({
  title,
  count,
  icon: Icon,
  iconBgColor,
  iconColor,
}: {
  title: string;
  count: number;
  icon: any;
  iconBgColor: string;
  iconColor: string;
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-500  mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            {count}
          </p>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
};

export const SolicitationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isVendor } = useUserRole();
  const queryClient = useQueryClient();
  const toastHandlers = useToastHandler();
  const [searchQuery, setSearchQuery] = useState("");
  const [evaluatorSearchQuery, setEvaluatorSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch solicitation details from API
  const {
    data: solicitationData,
    isLoading,
    error,
  } = useQuery<
    ApiResponse<{
      solicitation: Solicitation;
      details: Solicitation;
      requiredFiles: RequiredFile[];
      viewProposal: { _id: string } | null;
      owner: boolean;
    }>,
    ApiResponseError
  >({
    queryKey: ["solicitation", id, isVendor ? "vendor" : "procurement"],
    queryFn: async () => {
      const endpoint = isVendor
        ? `/vendor/solicitations/${id}`
        : `/procurement/solicitations/${id}`;
      return await getRequest({ url: endpoint });
    },
    enabled: !!id,
  });

  // Fetch evaluators data from API
  const { data: evaluatorsData, isLoading: isLoadingEvaluators } = useQuery<
    ApiResponse<Evaluator[]>,
    ApiResponseError
  >({
    queryKey: ["evaluators", id],
    queryFn: async () =>
      await getRequest({ url: `/procurement/solicitations/${id}/evaluators` }),
    enabled: !!id,
  });

  // Remind evaluator mutation
  const remindEvaluatorMutation = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    string
  >({
    mutationFn: (evaluatorId: string) =>
      putRequest({
        url: `/procurement/solicitations/${id}/remind-evaluator/${evaluatorId}`,
      }),
    onSuccess: () => {
      toastHandlers.success("Remind Evaluator", "Reminder sent successfully");
    },
    onError: (error) => {
      toastHandlers.error("Remind Evaluator", error);
    },
  });

  // Remove evaluator mutation
  const removeEvaluatorMutation = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    string
  >({
    mutationFn: (evaluatorId: string) =>
      deleteRequest({
        url: `/procurement/solicitations/${id}/evaluator/${evaluatorId}`,
      }),
    onSuccess: () => {
      toastHandlers.success(
        "Remove Evaluator",
        "Evaluator removed successfully"
      );
      // Refresh evaluators data
      queryClient.invalidateQueries({ queryKey: ["evaluators", id] });
    },
    onError: (error) => {
      toastHandlers.error("Remove Evaluator", error);
    },
  });

  // Export solicitation mutation
  const exportSolicitationMutation = useMutation<
    any,
    ApiResponseError,
    { type: "pdf" | "docx" }
  >({
    mutationFn: async ({ type }) => {
      const response = await getRequest({
        url: `/procurement/solicitations/${id}/export?type=${type}`,
        config: {
          responseType: "blob",
        },
      });
      return response;
    },
    onSuccess: (response, variables) => {
      // Create blob and download file
      const blob = new Blob([response.data], {
        type:
          variables.type === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${solicitation?.name || "solicitation"}.${
        variables.type
      }`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toastHandlers.success(
        "Export Successful",
        `Solicitation exported as ${variables.type.toUpperCase()} successfully`
      );
    },
    onError: (error) => {
      toastHandlers.error("Export Failed", error);
    },
  });

  const handleExport = (type: "pdf" | "docx") => {
    exportSolicitationMutation.mutate({ type });
  };

  // Extract solicitation data from API response
  const solicitation =
    solicitationData?.data?.data?.solicitation ||
    (solicitationData?.data?.data?.details as unknown as Solicitation);
  const requiredFiles = solicitationData?.data?.data?.requiredFiles || [];
  const viewProposal = solicitationData?.data?.data?.viewProposal;
  const isOwner = solicitationData?.data?.data?.owner;

  // Use API data for evaluators or fallback to mock data
  const evaluators = useMemo(() => {
    if (evaluatorsData?.data?.data) {
      return evaluatorsData.data.data?.[0]?.groups[0].evaluators;
    }
    // Fallback to mock data if API is not available
    return [];
  }, [evaluatorsData]);

  // Filter vendor proposals based on search query
  const filteredProposals = useMemo(() => {
    if (!searchQuery) return solicitation?.vendors ?? [];
    return (
      solicitation?.vendors.filter(
        (proposal: SolicitationVendor) =>
          proposal.id.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proposal.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? []
    );
  }, [solicitation, searchQuery]);

  // Filter evaluators based on search query
  const filteredEvaluators = useMemo(() => {
    if (!evaluatorSearchQuery) return evaluators;
    return evaluators.filter(
      (evaluator) =>
        evaluator.name
          .toLowerCase()
          .includes(evaluatorSearchQuery.toLowerCase()) ||
        evaluator.email
          .toLowerCase()
          .includes(evaluatorSearchQuery.toLowerCase())
    );
  }, [evaluators, evaluatorSearchQuery]);

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading state
  if (isLoading) {
    return (
      <PageLoader
        title="Solicitation Details"
        message="Loading solicitation details..."
        className="p-6 min-h-full"
      />
    );
  }

  // Show error state
  if (error || !solicitation) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-red-600 dark:text-red-400">
          {error?.response?.data?.message ||
            "Failed to load solicitation details"}
        </div>
      </div>
    );
  }

  // Define vendor proposals table columns
  const proposalColumns: ColumnDef<SolicitationVendor>[] = [
    {
      accessorKey: "id.name",
      header: "Vendor",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.id.name}</span>
          <span className="text-sm text-blue-500">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        // Map vendor status to proposal status
        const statusMap: Record<
          string,
          "Submitted" | "Under Review" | "Accepted" | "Rejected" | "Pending"
        > = {
          invited: "Pending",
          confirmed: "Submitted",
          declined: "Rejected",
        };
        return (
          <ProposalStatusBadge
            status={statusMap[row.original.status] || "Pending"}
          />
        );
      },
    },
    {
      accessorKey: "responseStatus",
      header: "Response Status",
      cell: ({ row }) => (
        <span className="">{row.original.responseStatus || "-"}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center ">
          {isOwner && (
            <Button
              variant="link"
              className="text-green-700"
              onClick={() =>
                navigate(
                  `/dashboard/solicitations/${id}/proposal-details/${row.original.id._id}`,
                  {
                    state: { vendorId: row.original.id._id },
                  }
                )
              }
            >
              View
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Define requested documents table columns
  const requestedDocumentsColumns: ColumnDef<RequiredFile>[] = [
    {
      accessorKey: "title",
      header: "Document",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          {/* <FileText className="h-5 w-5 text-blue-500" /> */}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {row.original.title || `Document ${row.index + 1}`}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Document Type",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-300 uppercase">
          {row.original.type || "Document"}
        </span>
      ),
    },
    {
      accessorKey: "required",
      header: "Required",
      cell: ({}) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">Yes</span>
      ),
    },
    {
      accessorKey: "multiple",
      header: "Multiple",
      cell: () => (
        <span className="text-sm text-gray-600 dark:text-gray-300">Yes</span>
      ),
    },
  ];

  // Define evaluators table columns
  const evaluatorColumns: ColumnDef<EvaluatorElement>[] = [
    {
      accessorKey: "name",
      header: "Evaluator Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium ">{row.original.name}</span>
          <span className="font-medium text-blue-500">
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "groupName",
      header: "Group",
      cell: ({ row }) => (
        <span className="">{row.getValue("groupName") || "-"}</span>
      ),
    },
    {
      accessorKey: "assignedDate",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">
            Assigned:{" "}
            {row.original.assignnOn
              ? format(new Date(row.original.assignnOn), "MMM d, yyyy pppp")
              : "-"}
          </span>
          <span className="text-sm text-gray-400">
            Submitted: {row.original.progress === 100 ? "Completed" : "-"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <EvaluatorStatusBadge status={row.original.status || "Pending"} />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <>
          {isOwner && (
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="link" className="text-green-600">
                    View
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="md:max-w-[50dvw] sm:w-[600px] p-0"
                >
                  <EvaluationScorecard
                    solicitationId={id!}
                    evaluatorId={row.original._id}
                    evaluatorData={{
                      name: row.original.name,
                      email: row.original.email,
                      submissionDate:
                        row.original.progress === 100
                          ? format(new Date(), "MMM d, yyyy pppp")
                          : row.original.assignnOn
                          ? format(
                              new Date(row.original.assignnOn),
                              "MMM d, yyyy pppp"
                            )
                          : format(new Date(), "MMM d, yyyy pppp"),
                      status:
                        row.original.progress === 100
                          ? "Submitted"
                          : row.original.status || "Pending",
                      evaluationScore: 87,
                    }}
                  />
                </SheetContent>
              </Sheet>
              {!row.original.status || row.original.status === "Pending" ? (
                <ConfirmAlert
                  title="Send Reminder"
                  text={`Are you sure you want to send a reminder to ${row.original.name}?`}
                  type="info"
                  primaryButtonText="Send Reminder"
                  secondaryButtonText="Cancel"
                  onPrimaryAction={() =>
                    remindEvaluatorMutation.mutate(row.original._id)
                  }
                  trigger={
                    <Button
                      variant="link"
                      className="text-blue-600"
                      disabled={remindEvaluatorMutation.isPending}
                    >
                      {remindEvaluatorMutation.isPending
                        ? "Sending..."
                        : "Remind"}
                    </Button>
                  }
                />
              ) : (
                <ConfirmAlert
                  title="Remove Evaluator"
                  text={`Are you sure you want to remove ${row.original.name} from this evaluation? This action cannot be undone.`}
                  type="delete"
                  primaryButtonText="Remove"
                  secondaryButtonText="Cancel"
                  onPrimaryAction={() =>
                    removeEvaluatorMutation.mutate(row.original._id)
                  }
                  trigger={
                    <Button
                      variant="link"
                      className="text-red-600"
                      disabled={removeEvaluatorMutation.isPending}
                    >
                      {removeEvaluatorMutation.isPending
                        ? "Removing..."
                        : "Remove"}
                    </Button>
                  }
                />
              )}
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-full pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-200 mb-6">
        <span
          onClick={handleBack}
          className="cursor-pointer hover:text-gray-700"
        >
          Solicitations
        </span>
        <ChevronRight className="h-4 w-4" />
        <span
          onClick={handleBack}
          className="cursor-pointer hover:text-gray-700"
        >
          My Solicitations
        </span>
        <ChevronRight className="h-4 w-4" />
        <span>Solicitation Details</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-gray-200 font-medium">
          {solicitation.name}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">
            {solicitation.name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {solicitation.solId} •{" "}
              {solicitation.typeId?.name || solicitation.type?.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {solicitation?.status && (
            <StatusBadge
              status={
                solicitation.status as
                  | "draft"
                  | "active"
                  | "closed"
                  | "awarded"
                  | "evaluating"
              }
            />
          )}
        </div>
      </div>

      {/* Submit Proposal Button */}
      {isVendor && (
        <div className="mb-4 flex items-center gap-2">
          {viewProposal && (
            <Sheet>
              <SheetTrigger asChild>
                <Button className=" px-6 py-2">View Proposal</Button>
              </SheetTrigger>
              <ProposalDetailsSheet
                proposalId={viewProposal?._id || ""}
                onClose={() => {}}
                solicitationId={solicitation?.solId || id || ""}
                solicitationName={solicitation?.name || ""}
              />
            </Sheet>
          )}

          {solicitation?.status?.toLowerCase() !== "awarded" && !viewProposal && isOwner && (
            <Link to={`/dashboard/solicitations/${id}/submit-proposal`}>
              <Button className="text-white px-6 py-2">Submit Proposal</Button>
            </Link>
          )}

          {solicitation?.status?.toLowerCase() !== "awarded" && viewProposal && isOwner && (
            <Link to={`/dashboard/solicitations/${id}/edit-proposal/${viewProposal._id}`}>
              <Button className="text-white px-6 py-2">Edit Proposal</Button>
            </Link>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full bg-transparent">
        <TabsList className="h-auto rounded-none border-b border-gray-300 !bg-transparent p-0 w-full justify-start">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Overview
          </TabsTrigger>
          {isVendor && (
            <TabsTrigger
              value="timeline-bid-details"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              Timeline Bid Details
            </TabsTrigger>
          )}
          {isVendor && (
            <TabsTrigger
              value="requested-documents"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              Requested Documents
            </TabsTrigger>
          )}
          {!isVendor && (
            <>
              <TabsTrigger
                value="vendor-proposals"
                className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
              >
                Vendor & Proposals
              </TabsTrigger>
              <TabsTrigger
                value="evaluation"
                className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
              >
                Evaluation
              </TabsTrigger>
            </>
          )}
          {!isVendor && (
            <TabsTrigger
              value="documents"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              Documents
            </TabsTrigger>
          )}

          <TabsTrigger
            value="questions"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="addendums"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            Addendums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Solicitation Details */}
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Solicitation Details
              </CardTitle>
              {!isVendor && (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="lg"
                        variant="outline"
                        className="space-x-4 rounded-xl"
                        disabled={exportSolicitationMutation.isPending}
                      >
                        <Share2 className="h-4 w-4 mr-3" />
                        {exportSolicitationMutation.isPending
                          ? "Exporting..."
                          : "Export"}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleExport("pdf")}>
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("docx")}>
                        Export as DOCX
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {isOwner && (
                    <EditSolicitationDialog
                      solicitation={solicitation as any}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">
                    Solicitation Name
                  </label>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {solicitation.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">
                    Solicitation Type
                  </label>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {solicitation.typeId?.name || solicitation.type?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">
                    Category
                  </label>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {solicitation.categories
                      ?.map((cat: Category) => cat.name)
                      .join(", ") ||
                      solicitation.categoryIds
                        ?.map((cat: Category) => cat.name)
                        .join(", ") ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">
                    Status
                  </label>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0">
                    {solicitation.status.charAt(0).toUpperCase() +
                      solicitation.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">
                    Project Owner Contact
                  </label>
                  <p className="text-blue-600 dark:text-gray-200 font-medium">
                    {solicitation.projectOwner?.email ||
                      solicitation.contact ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">
                    Created by
                  </label>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {typeof solicitation.createdBy === "object"
                      ? solicitation.createdBy.name ||
                        solicitation.createdBy.email ||
                        "N/A"
                      : solicitation.createdBy || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  Description
                </label>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  {solicitation.description}
                </p>
              </div>
            </div>

            {/* Timeline & Bid Details */}
            {!isVendor && (
              <>
                <h5 className="text-lg font-semibold text-gray-900">
                  Timeline & Bid Details
                </h5>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Submission Deadline
                      </label>
                      <p className="text-gray-900 dark:text-gray-200 font-medium">
                        {format(
                          new Date(solicitation.submissionDeadline),
                          "MMM d, yyyy pppp"
                        )}
                      </p>
                    </div>
                    {solicitation.questionDeadline && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">
                          Question Acceptance Deadline
                        </label>
                        <p className="text-gray-900 dark:text-gray-200 font-medium">
                          {format(
                            new Date(solicitation.questionDeadline),
                            "MMM d, yyyy pppp"
                          )}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Timezone
                      </label>
                      <p className="text-gray-900 dark:text-gray-200 font-medium">
                        {solicitation.timezone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Bid Intent
                      </label>
                      <p className="text-gray-900 dark:text-gray-200 font-medium">
                        {solicitation.bidIntentDeadline
                          ? "Required"
                          : "Not Required"}
                      </p>
                    </div>
                    {solicitation.bidIntentDeadline && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">
                          Bid Intent Deadline
                        </label>
                        <p className="text-gray-900 dark:text-gray-200 font-medium">
                          {format(
                            new Date(solicitation.bidIntentDeadline),
                            "MMM d, yyyy pppp"
                          )}
                        </p>
                      </div>
                    )}
                    {solicitation.estimatedCost && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">
                          Estimated Cost
                        </label>
                        <p className="text-gray-900 dark:text-gray-200 font-medium">
                          ${solicitation.estimatedCost.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-1 block">
                      Visibility
                    </label>
                    <p className="text-gray-900 dark:text-gray-200 font-medium">
                      {solicitation.visibility.charAt(0).toUpperCase() +
                        solicitation.visibility.slice(1)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Participation Summary (Hidden for Vendors) */}
          {!isVendor && (
            <div className="space-y-3">
              <h5 className="text-lg font-semibold text-gray-900">
                Participation Summary
              </h5>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ParticipationCard
                    title="Invited Vendors"
                    value={solicitation.vendors?.length || 0}
                    icon={Folder}
                    iconColor="blue"
                  />
                  <ParticipationCard
                    title="Proposal Received"
                    value={solicitation.vendorConfirmed || 0}
                    icon={FileText}
                    iconColor="green"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ParticipationCard
                    title="Evaluators"
                    value={solicitation.participation?.evaluators || 0}
                    icon={Users}
                    iconColor="purple"
                  />
                  <ParticipationCard
                    title="Documents"
                    value={solicitation.files?.length || 0}
                    icon={FileText}
                    iconColor="green"
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Vendor & Proposals Tab (Hidden for Vendors) */}
        {!isVendor && (
          <TabsContent value="vendor-proposals">
            <div className="space-y-6 pt-4">
              {/* Invited Vendors Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InvitedVendorCard
                  title="Invited Vendors"
                  count={solicitation.vendors?.length || 0}
                  icon={FolderOpen}
                  iconBgColor="bg-gray-50"
                  iconColor="text-gray-600"
                />
                <InvitedVendorCard
                  title="Evaluators"
                  count={solicitation.participation?.evaluators || 0}
                  icon={Users}
                  iconBgColor="bg-blue-50"
                  iconColor="text-blue-600"
                />
                <InvitedVendorCard
                  title="Proposals Received"
                  count={solicitation.vendorConfirmed || 0}
                  icon={FileText}
                  iconBgColor="bg-green-50"
                  iconColor="text-green-600"
                />
              </div>

              {/* Vendor Proposals Table */}
              <DataTable
                header={() => (
                  <div className="flex items-center gap-4 w-full py-5 px-5 rounded-t-2xl">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-400">
                      Vendors
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search vendors..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                )}
                data={filteredProposals}
                classNames={{
                  container:
                    "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
                }}
                columns={proposalColumns}
                options={{
                  disableSelection: true,
                  isLoading: false,
                  totalCounts: filteredProposals?.length || 0,
                  manualPagination: false,
                  setPagination,
                  pagination,
                }}
                emptyPlaceholder={
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                      <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
                      No Vendors Found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                      {searchQuery
                        ? `No vendors match your search for "${searchQuery}". Try adjusting your search terms.`
                        : "No vendors have been invited to this solicitation yet."}
                    </p>
                  </div>
                }
              />
            </div>
          </TabsContent>
        )}

        <TabsContent value="timeline-bid-details">
          <div className="space-y-6 pt-4">
            <div className="">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-6">
                Timeline & Bid Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Submission Deadline
                  </label>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {format(
                      new Date(solicitation.submissionDeadline),
                      "MMMM dd, yyyy pppp"
                    )}
                  </p>
                </div>

                {solicitation.questionDeadline && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                      Questions Acceptance Deadline
                    </label>
                    <p className="text-gray-900 dark:text-gray-200 font-medium">
                      {format(
                        new Date(solicitation.questionDeadline),
                        "MMMM dd, yyyy pppp"
                      )}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Timezone
                  </label>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {solicitation.timezone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evaluation">
          <div className="space-y-6 pt-4">
            {/* Evaluation Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InvitedVendorCard
                title="Evaluation Progress"
                count={evaluatorsData?.data.data?.[0]?.averageProgress || 0}
                icon={Folder}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
              />
              <InvitedVendorCard
                title="Evaluators"
                count={
                  evaluatorsData?.data.data?.[0]?.totalEvaluatorsInEvaluation ||
                  0
                }
                icon={Users}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
              />
            </div>

            {/* Evaluators Table */}
            <DataTable
              header={() => (
                <div className="flex items-center gap-3 w-full py-5 px-5 rounded-t-2xl">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-400">
                    Evaluators
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search Evaluator"
                        value={evaluatorSearchQuery}
                        onChange={(e) =>
                          setEvaluatorSearchQuery(e.target.value)
                        }
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              )}
              data={filteredEvaluators}
              classNames={{
                container:
                  "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
              }}
              columns={evaluatorColumns}
              options={{
                disableSelection: true,
                isLoading: isLoadingEvaluators,
                totalCounts: filteredEvaluators.length,
                manualPagination: false,
                setPagination,
                pagination,
              }}
              emptyPlaceholder={
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
                    No Evaluators Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    {evaluatorSearchQuery
                      ? `No evaluators match your search for "${evaluatorSearchQuery}". Try adjusting your search terms.`
                      : "No evaluators have been assigned to this solicitation yet."}
                  </p>
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="requested-documents">
          <div className="space-y-6 pt-4">
            <div className="">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Requested Documents
              </h3>
              <DataTable
                data={requiredFiles}
                columns={requestedDocumentsColumns}
                classNames={{
                  container: "bg-white dark:bg-slate-950 rounded-xl",
                }}
                options={{
                  disableSelection: true,
                  disablePagination: true,
                  isLoading: false,
                  totalCounts: requiredFiles.length,
                  manualPagination: false,
                  setPagination: () => {},
                  pagination: { pageIndex: 0, pageSize: 10 },
                }}
                emptyPlaceholder={
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                      <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
                      No Documents Required
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                      This solicitation does not require any specific documents
                      to be submitted.
                    </p>
                  </div>
                }
              />
            </div>
          </div>
        </TabsContent>

        {!isVendor && (
          <TabsContent value="documents">
            <DocumentsTab files={solicitation?.files} />
          </TabsContent>
        )}

        <TabsContent value="questions">
          <QuestionsTab />
        </TabsContent>

        <TabsContent value="addendums">
          <AddendumsTab solicitationId={id} />
        </TabsContent>
      </Tabs>
      <div className="h-10" />
    </div>
  );
};

export default SolicitationDetailPage;
