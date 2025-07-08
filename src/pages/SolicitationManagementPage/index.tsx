import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal } from "lucide-react";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import { SearchInput } from "@/components/layouts/SearchInput";
import { DropdownFilters as SolicitationFilters } from "@/components/layouts/SolicitationFilters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, deleteRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import CreateSolicitationDialog from "./components/CreateSolicitationDialog";
import { StatCard } from "./components/StatCard";
import { useUserRole } from "@/hooks/useUserRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconMap } from "@/components/layouts/RoleBasedDashboard/components/StatsCard";
import { useToastHandler } from "@/hooks/useToaster";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import EditSolicitationDialog from "./components/EditSolicitationDialog";
import { truncate } from "lodash";
// import ExportReportSheet from "@/components/layouts/ExportReportSheet";

// Safe date formatting utility
const safeFormatDate = (
  dateString: string | undefined,
  formatStr: string
): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return format(date, formatStr);
  } catch {
    return "N/A";
  }
};

// Types based on API documentation
type Category = {
  _id: string;
  name: string;
};

type SolicitationType = {
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
  _id: string;
  email: string;
  name?: string;
  status: "invited" | "confirmed" | "declined";
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
  submissionStatus: "not submitted" | "submitted";
  timezone: string;
  events: SolicitationEvent[];
  files: SolicitationFile[];
  vendors: SolicitationVendor[];
  contact: string;
  vendorConfirmed: number;
  vendorDeclined: number;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  createdBy: {
    _id: string;
    name: string;
  };
  solId: string;
};

// API Response types based on documentation
type SolicitationsResponse = {
  total: number;
  page: number;
  limit: number;
  data: Solicitation[];
};

type DashboardStatsResponse = {
  total: number;
  active: number;
  awarded: number;
  underEvaluating: number;
  pending: number;
  closed: number;
  draft: number;
  all: number;
};

type SolicitationQueryParams = {
  page?: number;
  limit?: number;
  status?: "draft" | "active" | "closed" | "awarded" | "evaluating";
  categoryId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
};

// Custom hooks for API calls based on Swagger documentation
const useAllSolicitations = (params?: SolicitationQueryParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.date) queryParams.append("date", params.date);

  const queryString = queryParams.toString();
  const url = `/procurement/solicitations${
    queryString ? `?${queryString}` : ""
  }`;

  return useQuery<ApiResponse<SolicitationsResponse>, ApiResponseError>({
    queryKey: ["solicitations", params],
    queryFn: () => getRequest({ url }),
  });
};

const useMySolicitations = (params?: SolicitationQueryParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.date)
    queryParams.append("date", `${params.startDate} - ${params.endDate}`);

  const queryString = queryParams.toString();
  const url = `/procurement/solicitations/me${
    queryString ? `?${queryString}` : ""
  }`;

  return useQuery<ApiResponse<SolicitationsResponse>, ApiResponseError>({
    queryKey: ["my-solicitations", params],
    queryFn: () => getRequest({ url }),
  });
};

// Vendor-specific hooks for API calls
const useVendorAllSolicitations = (params?: SolicitationQueryParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.date)
    queryParams.append("date", `${params.startDate} - ${params.endDate}`);

  const queryString = queryParams.toString();
  const url = `/vendor/solicitations${queryString ? `?${queryString}` : ""}`;

  return useQuery<ApiResponse<SolicitationsResponse>, ApiResponseError>({
    queryKey: ["vendor-solicitations", params],
    queryFn: () => getRequest({ url }),
  });
};

const useVendorMySolicitations = (params?: SolicitationQueryParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.date)
    queryParams.append("date", `${params.startDate} - ${params.endDate}`);

  const queryString = queryParams.toString();
  const url = `/vendor/solicitations/me${queryString ? `?${queryString}` : ""}`;

  return useQuery<ApiResponse<SolicitationsResponse>, ApiResponseError>({
    queryKey: ["vendor-my-solicitations", params],
    queryFn: () => getRequest({ url }),
  });
};

const useDashboardStats = () => {
  const { isVendor } = useUserRole();

  return useQuery<ApiResponse<DashboardStatsResponse>, ApiResponseError>({
    queryKey: ["dashboard-stats", isVendor ? "vendor" : "procurement"],
    queryFn: () => {
      const url = isVendor
        ? "/vendor/solicitations/dashboard"
        : "/procurement/solicitations/dashboard";
      return getRequest({ url });
    },
  });
};

// Mutation hooks for CRUD operations

const useDeleteSolicitation = () => {
  const queryClient = useQueryClient();
  const toast = useToastHandler();

  return useMutation({
    mutationFn: (id: string) =>
      deleteRequest({ url: `/procurement/solicitations/${id}` }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solicitations"] });
      queryClient.invalidateQueries({ queryKey: ["my-solicitations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success(
        "Solicitation deleted successfully",
        "Solicitation has been deleted successfully"
      );
    },
    onError: (error: ApiResponseError) => {
      toast.error("Failed to delete solicitation", error);
    },
  });
};

// Status badge component
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
    <Badge className={`${getStatusColor(status)} border-0 !text-center mx-auto`}>
      {getStatusLabel(status)}
    </Badge>
  );
};

// Empty state component
const EmptyState = ({ isProcurement }: { isProcurement: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-400 mb-2">
        No Solicitations Yet
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        {isProcurement
          ? "You don't have any active solicitations at the moment. Click the button below to create your first one and start receiving proposals."
          : "There are no solicitations available at the moment."}
      </p>
      {isProcurement && <CreateSolicitationDialog />}
    </div>
  );
};

export const SolicitationManagementPage = () => {
  const navigate = useNavigate();
  const { isProcurement, isVendor } = useUserRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<SolicitationQueryParams>({
    page: 1,
    limit: 10,
  });

  // Date range picker states
  const [dateRange, setDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSolicitationId, setSelectedSolicitationId] = useState<
    string | null
  >(null);
  // const [activeTab, setActiveTab] = useState<string>("all");

  // Update filters when pagination changes
  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState)
  ) => {
    const newPagination =
      typeof updaterOrValue === "function"
        ? updaterOrValue(pagination)
        : updaterOrValue;
    setPagination(newPagination);
    setFilters((prev) => ({
      ...prev,
      page: newPagination.pageIndex + 1,
      limit: newPagination.pageSize,
    }));
  };

  // Update filters when status or date filter changes
  const handleFilterChange = (filterTitle: string, value: string) => {
    if (filterTitle === "Status") {
      if (value === "all" || value === "all_status") {
        setFilters((prev) => ({ ...prev, status: undefined, page: 1 }));
      } else {
        setFilters((prev) => ({
          ...prev,
          status: value as
            | "draft"
            | "active"
            | "closed"
            | "awarded"
            | "evaluating",
          page: 1,
        }));
      }
    } else if (filterTitle === "Date") {
      // Handle date filter
      if (value === "all") {
        setFilters((prev) => ({ ...prev, date: undefined, page: 1 }));
        setDateRange({ startDate: undefined, endDate: undefined });
      } else if (value === "today") {
        setFilters((prev) => ({ ...prev, date: "today", page: 1 }));
        const now = new Date();
        setDateRange({
          startDate: startOfDay(now),
          endDate: endOfDay(now),
        });
      } else if (value === "7_days") {
        setFilters((prev) => ({ ...prev, date: "7_days", page: 1 }));
        const now = new Date();
        setDateRange({
          startDate: subDays(now, 7),
          endDate: now,
        });
      } else if (value === "30_days") {
        setFilters((prev) => ({ ...prev, date: "30_days", page: 1 }));
        const now = new Date();
        setDateRange({
          startDate: subDays(now, 30),
          endDate: now,
        });
      } else if (value === "custom") {
        // Open the date range picker dialog
        setIsDatePickerOpen(true);
        // Initialize temp date range with current values
        setTempDateRange({
          from: dateRange.startDate,
          to: dateRange.endDate,
        });
        setFilters((prev) => ({ ...prev, date: "custom", page: 1 }));
      }
    } else if (filterTitle === "Category") {
      if (value === "all") {
        setFilters((prev) => ({ ...prev, categoryId: undefined, page: 1 }));
      } else {
        setFilters((prev) => ({ ...prev, categoryId: value, page: 1 }));
      }
    }
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Handle date range selection
  const handleDateRangeSelect = (
    range: { from?: Date; to?: Date } | undefined
  ) => {
    if (range) {
      setTempDateRange(range);
    }
  };

  // Handle date range confirmation
  const handleDateRangeConfirm = () => {
    if (tempDateRange.from || tempDateRange.to) {
      setDateRange({
        startDate: tempDateRange.from,
        endDate: tempDateRange.to,
      });

      // Update filters with custom date range
      setFilters((prev) => ({
        ...prev,
        date: "custom",
        page: 1,
      }));
    }
    setIsDatePickerOpen(false);
  };

  // Handle date range cancellation
  const handleDateRangeCancel = () => {
    setIsDatePickerOpen(false);
  };

  // API hooks based on user role
  const { data: allSolicitationsData, isLoading: isLoadingAll } = isVendor
    ? useVendorAllSolicitations({
        ...filters,
        startDate:
          filters.date && dateRange.startDate
            ? format(dateRange.startDate, "yyyy-MM-dd")
            : undefined,
        endDate:
          filters.date && dateRange.endDate
            ? format(dateRange.endDate, "yyyy-MM-dd")
            : undefined,
      })
    : useAllSolicitations({
        ...filters,
        startDate:
          filters.date && dateRange.startDate
            ? format(dateRange.startDate, "yyyy-MM-dd")
            : undefined,
        endDate:
          filters.date && dateRange.endDate
            ? format(dateRange.endDate, "yyyy-MM-dd")
            : undefined,
      });
  const { data: mySolicitationsData, isLoading: isLoadingMy } = isVendor
    ? useVendorMySolicitations({
        ...filters,
        startDate:
          filters.date && dateRange.startDate
            ? format(dateRange.startDate, "yyyy-MM-dd")
            : undefined,
        endDate:
          filters.date && dateRange.endDate
            ? format(dateRange.endDate, "yyyy-MM-dd")
            : undefined,
      })
    : useMySolicitations({
        ...filters,
        startDate:
          filters.date && dateRange.startDate
            ? format(dateRange.startDate, "yyyy-MM-dd")
            : undefined,
        endDate:
          filters.date && dateRange.endDate
            ? format(dateRange.endDate, "yyyy-MM-dd")
            : undefined,
      });
  const { data: dashboardStatsData } = useDashboardStats();

  // Mutation hooks
  const deleteSolicitationMutation = useDeleteSolicitation();

  // Get current data based on active tab
  const currentData = useMemo(() => {
    if (activeTab === "all") {
      return (
        allSolicitationsData?.data?.data?.data ||
        (allSolicitationsData?.data?.data as unknown as Solicitation[]) ||
        []
      );
    } else {
      return (
        mySolicitationsData?.data?.data?.data ||
        (mySolicitationsData?.data?.data as unknown as Solicitation[]) ||
        []
      );
    }
  }, [activeTab, allSolicitationsData, mySolicitationsData]);

  const handleDeleteClick = (id: string) => {
    setSelectedSolicitationId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSolicitationId) {
      deleteSolicitationMutation.mutate(selectedSolicitationId);
      setDeleteDialogOpen(false);
      setSelectedSolicitationId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedSolicitationId(null);
  };

  // Get current loading state
  const isLoading = activeTab === "all" ? isLoadingAll : isLoadingMy;

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return currentData;
    return currentData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categories.some((cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [currentData, searchQuery]);

  // Get dashboard statistics from API
  const dashboardStats = useMemo(() => {
    if (!dashboardStatsData?.data) {
      return {
        total: 0,
        active: 0,
        underEvaluating: 0,
        pending: 0,
        draft: 0,
        awarded: 0,
        closed: 0,
        all: 0,
      };
    }
    return dashboardStatsData.data.data;
  }, [dashboardStatsData]);

  // Define table columns based on user role
  const columns: ColumnDef<Solicitation>[] = isVendor
    ? [
        {
          accessorKey: "name",
          header: "Solicitation Name",
          cell: ({ row }) => (
            <div className="flex flex-col max-w-sm">
              <span className="font-medium ">{row.original.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {row.original.solId}
              </span>
            </div>
          ),
        },
        {
          accessorKey: "visibility",
          header: "Type (Visibility)",
          cell: ({ row }) => (
            <Badge
              variant={
                row.original.visibility === "public" ? "default" : "secondary"
              }
              className="text-xs"
            >
              {row.original.visibility === "public" ? "Public" : "Invited"}
            </Badge>
          ),
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
          accessorKey: "submissionDeadline",
          header: "Date",
          cell: ({ row }) => (
            <div className="text-sm">
              <div className="font-medium">
                {safeFormatDate(row.original.submissionDeadline, "MMM d, yyyy")}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {safeFormatDate(row.original.submissionDeadline, "pppp")}
              </div>
            </div>
          ),
        },
        {
          accessorKey: "submissionStatus",
          header: "Submission Status",
          cell: ({ row }) => {
            // Check if vendor has submitted a proposal for this solicitation
            // This is a simplified check - in a real implementation, you would
            // fetch proposal data from the API to determine actual submission status
            const hasSubmitted =
              row.original.submissionStatus === "submitted" || false;

            return (
              <Badge
                variant={hasSubmitted ? "default" : "destructive"}
                className="text-xs"
              >
                {hasSubmitted ? "Submitted" : "Not Submitted"}
              </Badge>
            );
          },
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="py-3 px-4"
                  onClick={() =>
                    navigate(`/dashboard/solicitation/${row.original._id}`)
                  }
                >
                  View Details
                </DropdownMenuItem>
                {/* <DropdownMenuItem
              className="py-3 px-4"
              onClick={() =>
                navigate(`/dashboard/proposal/${row.original._id}`)
              }
            >
              Complete Proposal
            </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]
    : isProcurement
    ? [
        {
          accessorKey: "name",
          header: "Solicitation Name",
          cell: ({ row }) => (
            <div className="flex flex-col max-w-sm">
              <span className="font-medium ">
                {truncate(row.original.name, { length: 50 })}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {row.original.solId} • {row.original.typeId?.name.split("-")?.[0]}
              </span>
            </div>
          ),
        },
        {
          accessorKey: "categories",
          header: "Categories",
          cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
              {row.original.categoryIds?.map((category) => (
                <Badge
                  key={category._id}
                  variant="secondary"
                  className="text-xs text-center"
                >
                  {category.name}
                </Badge>
              )) || (
                <span className="text-muted-foreground">No categories</span>
              )}
            </div>
          ),
        },
        {
          accessorKey: "createdBy",
          header: "Contact",
          cell: ({ row }) => (
            <span>
              {row.getValue<Solicitation["createdBy"]>("createdBy")?.name}
            </span>
          ),
        },
        {
          accessorKey: "submissionDeadline",
          header: "Submission Deadline",
          cell: ({ row }) => (
            <span>
              {safeFormatDate(
                row.original.submissionDeadline,
                "MMM d, yyyy, pppp"
              )}
            </span>
          ),
        },
        {
          accessorKey: "questionDeadline",
          header: "Question Deadline",
          cell: ({ row }) => (
            <span>
              {safeFormatDate(
                row.original.questionDeadline,
                "MMM d, yyyy pppp"
              )}
            </span>
          ),
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
          accessorKey: "vendors",
          header: "Vendors",
          cell: ({ row }) => (
            <div className="text-sm">
              <div className="text-green-600">
                Confirmed: {row.original.vendorConfirmed || 0}
              </div>
              <div className="text-red-600">
                Declined: {row.original.vendorDeclined || 0}
              </div>
            </div>
          ),
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="py-3 px-4"
                  onClick={() =>
                    navigate(`/dashboard/solicitation/${row.original._id}`)
                  }
                >
                  View Details
                </DropdownMenuItem>
                <EditSolicitationDialog
                  solicitation={row.original as any}
                  isLink
                />
                <DropdownMenuItem
                  className="py-3 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleDeleteClick(row.original._id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]
    : [
        {
          accessorKey: "name",
          header: "Solicitation Name",
          cell: ({ row }) => (
            <div className="flex flex-col max-w-sm">
              <span className="font-medium ">
                {truncate(row.original.name, { length: 50 })}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {row.original.solId} • {row.original.typeId?.name.split("-")?.[0]}
              </span>
            </div>
          ),
        },
        {
          accessorKey: "categories",
          header: "Categories",
          cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
              {row.original.categoryIds?.map((category) => (
                <Badge
                  key={category._id}
                  variant="secondary"
                  className="text-xs text-center"
                >
                  {category.name}
                </Badge>
              )) || (
                <span className="text-muted-foreground">No categories</span>
              )}
            </div>
          ),
        },
        {
          accessorKey: "createdBy",
          header: "Contact",
          cell: ({ row }) => (
            <span>
              {row.getValue<Solicitation["createdBy"]>("createdBy")?.name}
            </span>
          ),
        },
        {
          accessorKey: "submissionDeadline",
          header: "Date",
          cell: ({ row }) => (
            <>
              <span className="text-sm block">
                <strong>Published:</strong>{" "}
                {safeFormatDate(
                  row.original.submissionDeadline,
                  "MMM d, yyyy pppp"
                )}
              </span>
              <span>
                <strong>Closing:</strong>{" "}
                {safeFormatDate(
                  row.original.questionDeadline,
                  "MMM d, yyyy pppp"
                )}
              </span>
            </>
          ),
        },     
        {
          accessorKey: "status",
          header: "Status",
          cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
          accessorKey: "vendors",
          header: "Vendors",
          cell: ({ row }) => (
            <div className="text-sm">
              <div className="text-green-600">
                Confirmed: {row.original.vendorConfirmed || 0}
              </div>
              <div className="text-red-600">
                Declined: {row.original.vendorDeclined || 0}
              </div>
            </div>
          ),
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="py-3 px-4"
                  onClick={() =>
                    navigate(`/dashboard/solicitation/${row.original._id}`)
                  }
                >
                  View Details
                </DropdownMenuItem>
                <EditSolicitationDialog
                  solicitation={row.original as any}
                  isLink
                />
                <DropdownMenuItem
                  className="py-3 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleDeleteClick(row.original._id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ];

  return (
    <div className="p-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-200 mb-1">
            Solicitations
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isProcurement && <CreateSolicitationDialog />}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="All Solicitations"
          value={dashboardStats.total || dashboardStats.all}
          icon={IconMap["folder-open"] as any}
          className="col"
          iconColor="text-gray-600"
          iconBgColor="bg-gray-100"
          onClick={() => {
            setFilters(prev => ({ ...prev, status: undefined, page: 1 }));
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
        />
        <StatCard
          title="Active Solicitations"
          value={dashboardStats.active}
          icon={IconMap["folder-open"] as any}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          onClick={() => {
            setFilters(prev => ({ ...prev, status: "active", page: 1 }));
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
        />
        {isProcurement && (
          <StatCard
            title="Pending Evaluations"
            value={dashboardStats.pending}
            icon={IconMap["folder-open"] as any}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
            onClick={() => {
              setFilters(prev => ({ ...prev, status: "evaluating", page: 1 }));
              setPagination({ pageIndex: 0, pageSize: 10 });
            }}
          />
        )}
        <StatCard
          title="Draft Solicitations"
          value={dashboardStats.draft}
          icon={IconMap["folder-open"] as any}
          iconColor="text-gray-600"
          iconBgColor="bg-gray-100"
          onClick={() => {
            setFilters(prev => ({ ...prev, status: "draft", page: 1 }));
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
        />
        <StatCard
          title="Awarded"
          value={dashboardStats.awarded}
          icon={IconMap["folder-open"] as any}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          onClick={() => {
            setFilters(prev => ({ ...prev, status: "awarded", page: 1 }));
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
        />
        <StatCard
          title="Closed Evaluations"
          value={dashboardStats.closed}
          icon={IconMap["folder-open"] as any}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
          onClick={() => {
            setFilters(prev => ({ ...prev, status: "closed", page: 1 }));
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full bg-transparent"
      >
        <TabsList className="h-auto rounded-none border-b border-gray-300 dark:border-gray-600 dark:bg-transparent p-0 w-full justify-start bg-transparent">
          <TabsTrigger
            value="all"
            className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
          >
            All Solicitation
          </TabsTrigger>
          {(isProcurement || isVendor) && (
            <TabsTrigger
              value="my"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              My Solicitation
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all">
          {/* Search and Filter Section */}
          <div className="mt-6">
            <DataTable
              header={() => (
                <div className="flex items-center w-full justify-between border-b border-[#E9E9EB] dark:border-slate-600 p-3 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <h2
                          className="text-base font-semibold text-gray-600 dark:text-gray-400"
                          style={{ fontFamily: "Quicksand" }}
                        >
                          Solicitations
                        </h2>
                      </div>
                      <SearchInput
                        placeholder="Solicitations"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                      />
                    </div>

                    <SolicitationFilters
                      filters={[
                        {
                          title: "Date",
                          options: [
                            {
                              hasOptions: true,
                              value: "date",
                              label: "Date Published",
                              subOptions: [
                                {
                                  title: "All",
                                  value: "all",
                                },
                                {
                                  title: "Today",
                                  value: "today",
                                },
                                {
                                  title: "Last 7 Days",
                                  value: "7_days",
                                },
                                {
                                  title: "Last 30 Days",
                                  value: "30_days",
                                },
                                {
                                  title: "Custom",
                                  value: "custom",
                                },
                              ],
                            },
                          ],
                        },
                        {
                          title: "Status",
                          showIcon: true,
                          options: [
                            {
                              label: "All Status",
                              value: "all_status",
                            },
                            {
                              label: "Published",
                              value: "published",
                            },
                            {
                              label: "Draft",
                              value: "draft",
                            },
                            {
                              label: "Under Evaluation",
                              value: "under_evaluation",
                            },
                            {
                              label: "Closed",
                              value: "closed",
                            },
                          ],
                        },
                      ]}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </div>
              )}
              emptyPlaceholder={<EmptyState isProcurement={isProcurement} />}
              classNames={{
                container:
                  "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
              }}
              data={filteredData}
              columns={columns}
              options={{
                disableSelection: true,
                isLoading: isLoading,
                totalCounts: allSolicitationsData?.data?.data?.total || 0,
                manualPagination: true,
                setPagination: handlePaginationChange,
                pagination,
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          {/* Search and Filter Section */}
          <DataTable
            header={() => (
              <div className="flex items-center w-full justify-between border-b border-[#E9E9EB] dark:border-slate-600 p-3 pt-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <h2
                        className="text-base font-semibold text-gray-600 dark:text-gray-400"
                        style={{ fontFamily: "Quicksand" }}
                      >
                        Solicitations
                      </h2>
                    </div>
                    <SearchInput
                      placeholder="Solicitations"
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </div>

                  <SolicitationFilters
                    filters={[
                      {
                        title: "Date",
                        options: [
                          {
                            hasOptions: true,
                            value: "date",
                            label: "Date Published",
                            subOptions: [
                              {
                                title: "All",
                                value: "all",
                              },
                              {
                                title: "Today",
                                value: "today",
                              },
                              {
                                title: "Last 7 Days",
                                value: "7_days",
                              },
                              {
                                title: "Last 30 Days",
                                value: "30_days",
                              },
                              {
                                title: "Custom",
                                value: "custom",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        title: "Status",
                        showIcon: true,
                        options: [
                          {
                            label: "Active",
                            value: "active",
                          },
                          {
                            label: "Suspended",
                            value: "suspended",
                          },
                          {
                            label: "Pending",
                            value: "pending",
                          },
                        ],
                      },
                      {
                        title: "Category",
                        options: [
                          {
                            label: "All",
                            value: "all",
                          },
                        ],
                      },
                    ]}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            )}
            emptyPlaceholder={<EmptyState isProcurement={isProcurement} />}
            classNames={{
              container:
                "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
            }}
            data={filteredData}
            columns={columns}
            options={{
              disableSelection: true,
              isLoading: isLoading,
              totalCounts: mySolicitationsData?.data?.data?.total || 0,
              manualPagination: true,
              setPagination: handlePaginationChange,
              pagination,
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Date Range Picker Dialog */}
      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Select Date Range
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Calendar
              mode="range"
              required={false}
              selected={{
                from: tempDateRange.from,
                to: tempDateRange.to,
              }}
              onSelect={handleDateRangeSelect}
              className="rounded-md border"
              numberOfMonths={2}
            />

            <div className="mt-4">
              <div className="text-sm mb-4">
                <div className="font-medium">Selected Range:</div>
                <div className="text-gray-500 dark:text-gray-400">
                  {tempDateRange.from ? (
                    tempDateRange.to ? (
                      <>
                        {format(tempDateRange.from, "PPP")} -{" "}
                        {format(tempDateRange.to, "PPP")}
                      </>
                    ) : (
                      format(tempDateRange.from, "PPP")
                    )
                  ) : (
                    "No date selected"
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDateRangeCancel}>
              Cancel
            </Button>
            <Button onClick={handleDateRangeConfirm}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmAlert
        open={deleteDialogOpen}
        onClose={setDeleteDialogOpen}
        type="delete"
        title="Delete Solicitation"
        text="Are you sure you want to delete this solicitation? This action cannot be undone and will permanently remove all associated data including addendums, evaluations, and logs."
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onPrimaryAction={handleDeleteConfirm}
        onSecondaryAction={handleDeleteCancel}
        showSecondaryButton={true}
      />
    </div>
  );
};

export default SolicitationManagementPage;
