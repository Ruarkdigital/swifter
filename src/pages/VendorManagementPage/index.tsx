import { Button } from "@/components/ui/button";
import { Users, MoreHorizontal } from "lucide-react";
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, deleteRequest, putRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";
import CreateVendorDialog from "./components/CreateVendorDialog";
import { StatCard } from "./components/StatCard";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
// import EditVendorDialog from "./components/EditVendorDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconMap } from "@/components/layouts/RoleBasedDashboard/components/StatsCard";
import { DropdownFilters } from "@/components/layouts/SolicitationFilters";

// Dashboard statistics type (matching API response)
type VendorDashboard = {
  allVendor: number;
  activeVendor: number;
  inActiveVendor: number;
  suspendedVendor: number;
};

// Vendor type definition (matching API schema)
type Vendor = {
  _id: string;
  name: string;
  businessType: string;
  website: string;
  status: string;
  isSuspended: boolean;
  location: string;
  secondaryEmail: string;
  lastActive: string;
  user: {
    _id: string;
    email: string;
    phone?: string;
    name: string;
    status: "pending" | "active" | "inactive";
  };
};

// API response types
type VendorsListResponse = {
  vendors: Vendor[];
  total: number;
  page: number;
  limit: number;
};

// Status badge component
const StatusBadge = ({ status }: { status: Vendor["status"] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Suspended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0 p-2 px-4`}>
      {status}
    </Badge>
  );
};

// Empty state component
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 h-full">
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
        <Users className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
        No Vendors Added Yet
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        Manage your vendors easily by adding them here. Start by creating a new
        vendor profile.
      </p>
      <CreateVendorDialog />
    </div>
  );
};

export const VendorManagementPage = () => {
  const navigate = useNavigate();
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [searchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState({
    datePublished: "",
    status: "",
    plan: "",
  });
  const [activeStatCard, setActiveStatCard] = useState<string | null>(null);
  const [suspendedVendorId, setSuspendedVendorId] = useState<string | null>(
    null
  );
  const [isSuspendModel, setIsSuspendModel] = useState(false);
  const [isUnsuspendModel, setIsUnsuspendModel] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && ['Active', 'Inactive', 'Pending', 'Suspended'].includes(statusParam)) {
      setFilters(prev => ({ ...prev, status: statusParam }));
      setActiveStatCard(statusParam);
    }
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [
    debouncedSearchQuery,
    filters.datePublished,
    filters.status,
    filters.plan,
  ]);

  // Fetch vendors dashboard statistics
  const { data: dashboardData } = useQuery<
    ApiResponse<VendorDashboard>,
    ApiResponseError
  >({
    queryKey: ["vendorDashboard"],
    queryFn: async () =>
      await getRequest({ url: "/procurement/vendors/dashboard" }),
  });

  // Fetch vendors list
  const { data: vendorsData, isLoading } = useQuery<
    ApiResponse<VendorsListResponse>,
    ApiResponseError
  >({
    queryKey: [
      "vendors",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearchQuery,
      filters,
    ],
    queryFn: async () => {
      // Prepare filter parameters
      const params: Record<string, any> = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearchQuery || undefined,
      };

      // Add date filter if selected
      if (filters.datePublished && filters.datePublished !== "all") {
        const today = new Date();
        let startDate, endDate;

        switch (filters.datePublished) {
          case "today":
            startDate = startOfDay(today);
            endDate = endOfDay(today);
            break;
          case "yesterday":
            startDate = startOfDay(subDays(today, 1));
            endDate = endOfDay(subDays(today, 1));
            break;
          case "last7days":
            startDate = startOfDay(subDays(today, 6));
            endDate = endOfDay(today);
            break;
          case "last30days":
            startDate = startOfDay(subDays(today, 29));
            endDate = endOfDay(today);
            break;
          case "thisWeek":
            startDate = startOfWeek(today, { weekStartsOn: 1 });
            endDate = endOfWeek(today, { weekStartsOn: 1 });
            break;
          case "thisMonth":
            startDate = startOfMonth(today);
            endDate = endOfMonth(today);
            break;
          case "thisYear":
            startDate = startOfYear(today);
            endDate = endOfYear(today);
            break;
          default:
            // For custom date ranges or other options, use the original value
            params.dateFilter = filters.datePublished;
            break;
        }

        // If we calculated a date range, format and add it to params
        if (startDate && endDate) {
          params.startDate = format(startDate, "yyyy-MM-dd");
          params.endDate = format(endDate, "yyyy-MM-dd");
        }
      }

      // Add status filter if selected
      if (filters.status && filters.status !== "all_status") {
        if (filters.status === "Suspended") {
          params.isSuspended = true;
        } else {
          params.status = filters.status;
          params.isSuspended = false;
        }
      }

      // Add plan filter if selected
      if (filters.plan && filters.plan !== "") {
        params.plan = filters.plan;
      }

      return await getRequest({
        url: "/procurement/vendors/",
        config: { params },
      });
    },
  });

  // Suspend vendor mutation
  const { mutateAsync: suspendVendor, isPending: isSuspendingVendor } =
    useMutation<ApiResponse<any>, ApiResponseError, string>({
      mutationKey: ["suspendVendor"],
      mutationFn: async (vendorId) =>
        await deleteRequest({
          url: `/procurement/vendors/${vendorId}/suspend`,
        }),
      onSuccess: () => {
        toast.success("Success", "Vendor suspended successfully");
        queryClient.invalidateQueries({ queryKey: ["vendors"] });
        queryClient.invalidateQueries({ queryKey: ["vendorDashboard"] });
        setIsSuspendModel(false);
      },
      onError: (error) => {
        console.log(error);
        const err = error as ApiResponseError;
        toast.error(
          "Error",
          err?.response?.data?.message ?? "Failed to suspend vendor"
        );
      },
    });

  // Unsuspend vendor mutation
  const { mutateAsync: unsuspendVendor, isPending: isUnsuspendingVendor } =
    useMutation<ApiResponse<any>, ApiResponseError, string>({
      mutationKey: ["unsuspendVendor"],
      mutationFn: async (vendorId) =>
        await putRequest({
          url: `/procurement/vendors/${vendorId}/unsuspend`,
          payload: {},
        }),
      onSuccess: () => {
        toast.success("Success", "Vendor unsuspend successfully");
        queryClient.invalidateQueries({ queryKey: ["vendors"] });
        queryClient.invalidateQueries({ queryKey: ["vendorDashboard"] });
        setIsUnsuspendModel(false);
      },
      onError: (error) => {
        console.log(error);
        const err = error as ApiResponseError;
        toast.error(
          "Error",
          err?.response?.data?.message ?? "Failed to unsuspend vendor"
        );
      },
    });

  // Handle vendor suspension
  const handleSuspendVendor = async (vendorId: string) => {
    try {
      await suspendVendor(vendorId);
    } catch (error) {
      console.error("Failed to suspend vendor:", error);
    }
  };

  // Handle vendor un-suspension
  const handleUnsuspendVendor = async (vendorId: string) => {
    try {
      await unsuspendVendor(vendorId);
    } catch (error) {
      console.error("Failed to unsuspend vendor:", error);
    }
  };

  // Extract data from API responses (matching API response structure)
  const vendorStats = dashboardData?.data?.data || {
    allVendor: 0,
    activeVendor: 0,
    inActiveVendor: 0,
    suspendedVendor: 0,
  };

  const vendors = vendorsData?.data?.data?.vendors || [];
  const totalVendors = vendorsData?.data?.data?.total || 0;

  // Handle StatCard clicks for filtering
  const handleStatCardClick = (cardType: string) => {
    // Reset pagination when filter changes
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    // Set active card and update filters
    setActiveStatCard(cardType);

    switch (cardType) {
      case "all":
        setFilters((prev) => ({ ...prev, status: "" }));
        break;
      case "active":
        setFilters((prev) => ({ ...prev, status: "Active" }));
        break;
      case "inactive":
        setFilters((prev) => ({ ...prev, status: "Inactive" }));
        break;
      case "suspended":
        setFilters((prev) => ({ ...prev, status: "Suspended" }));
        break;
      default:
        setFilters((prev) => ({ ...prev, status: "" }));
        break;
    }
  };

  // Handle filter changes from dropdown
  const handleFilterChange = (
    filterType: string,
    value: string
    // label: string
  ) => {
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    // Clear active stat card when using dropdown filters
    if (filterType === "Status") {
      setActiveStatCard(null);
    }

    // Update filters based on the filter type
    if (filterType === "Date") {
      setFilters((prev) => ({ ...prev, datePublished: value }));
    } else if (filterType === "Status") {
      setFilters((prev) => ({ ...prev, status: value }));
    } else if (filterType === "Plan") {
      setFilters((prev) => ({ ...prev, plan: value }));
    }
  };

  // Filter data based on search query and filters
  const filteredData = useMemo(() => {
    let filtered = [...vendors];

    // Apply any additional client-side filtering if needed
    // This is a fallback in case the API doesn't support certain filters
    // or if we want to add additional filtering logic

    // Example: Filter by status if not handled by API
    if (
      filters.status &&
      filters.status !== "all_status" &&
      filters.status !== ""
    ) {
      // Convert status values from the filter dropdown to match the API's status values
      const statusMap: Record<string, string> = {
        published: "Active",
        draft: "Inactive",
        "under evaluation": "Pending",
        closed: "Suspended",
      };

      const targetStatus =
        statusMap[filters.status.toLowerCase()] || filters.status;

      filtered = filtered.filter((vendor) => {
        const vendorStatus = vendor.isSuspended ? "Suspended" : vendor.status;
        return vendorStatus === targetStatus;
      });
    }

    return filtered;
  }, [vendors, filters]);

  // Define table columns
  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "name",
      header: "Vendor Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-sm text-blue-500 underline underline-offset-2">
            {row.original.user?.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "businessType",
      header: "Business Type",
      cell: ({ row }) => (
        <span className="text-xs">{row.original.businessType || "N/A"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.isSuspended
          ? "Suspended"
          : row.original.status;
        return <StatusBadge status={status} />;
      },
    },
    {
      accessorKey: "lastActive",
      header: "Last Activity",
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span className="">
            {row.original.lastActive
              ? format(new Date(row.original.lastActive), "MMM dd, yyyy, pppp")
              : "N/A"}
          </span>
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
          <DropdownMenuContent align="end" className="w-44 rounded-2xl">
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/vendor/${row.original._id}`)}
              className="p-3"
            >
              View Vendor
            </DropdownMenuItem>
            {/* <EditVendorDialog
              vendorId={row.original.vendorId}
              vendorData={{
                name: row.original.name,
                website: row.original.website,
                location: row.original.location,
                // phone: row.original.,
                businessType: row.original.businessType,
                secondaryEmails: row.original.secondaryEmail ? [row.original.secondaryEmail] : [],
              }}
              trigger={
                <DropdownMenuItem className="p-3">
                  Edit Vendor
                </DropdownMenuItem>
              }
            /> */}
            {row.original.isSuspended ? (
              <DropdownMenuItem
                className="p-3 text-green-600"
                onClick={() => {
                  setSuspendedVendorId(row.original._id);
                  setIsUnsuspendModel(true);
                }}
              >
                Unsuspend Vendor
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="p-3 text-orange-600"
                onClick={() => {
                  setSuspendedVendorId(row.original._id);
                  setIsSuspendModel(true);
                }}
              >
                Suspend Vendor
              </DropdownMenuItem>
            )}
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Vendors</h1>
        </div>
        <div className="flex items-center gap-3">
          <CreateVendorDialog />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="All Vendors"
          value={vendorStats.allVendor ?? 0}
          icon={IconMap?.users as any}
          iconColor="text-gray-600"
          iconBgColor="bg-gray-100"
          onClick={() => handleStatCardClick("all")}
          isActive={activeStatCard === "all"}
        />
        <StatCard
          title="Active Vendors"
          value={vendorStats.activeVendor ?? 0}
          icon={IconMap?.users as any}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          onClick={() => handleStatCardClick("active")}
          isActive={activeStatCard === "active"}
        />
        <StatCard
          title="Inactive Vendors"
          value={vendorStats.inActiveVendor ?? 0}
          icon={IconMap?.users as any}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
          onClick={() => handleStatCardClick("inactive")}
          isActive={activeStatCard === "inactive"}
        />
        <StatCard
          title="Suspended Vendors"
          value={vendorStats.suspendedVendor ?? 0}
          icon={IconMap?.users as any}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
          onClick={() => handleStatCardClick("suspended")}
          isActive={activeStatCard === "suspended"}
        />
      </div>

      {/* Main Content */}
      <DataTable
        data={filteredData}
        columns={columns}
        header={() => (
          <div className="flex items-center justify-between border-b border-[#E9E9EB] dark:border-gray-800 pb-3 w-full px-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-base font-semibold text-[#0F0F0F] dark:text-gray-400"
                    style={{ fontFamily: "Quicksand" }}
                  >
                    Vendors
                  </h2>
                </div>
                {/* <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B6B6B]"
                    strokeWidth={1.67}
                  />
                  <Input
                    placeholder="Search Users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 w-[300px] h-12 border border-[#E5E7EB] rounded-lg text-sm text-[#6B6B6B] focus:border-[#2A4467] focus:ring-[#2A4467]"
                    style={{ fontFamily: "PushPenny" }}
                  />
                </div> */}
              </div>

              <DropdownFilters
                filters={[
                  {
                    title: "Date",
                    showIcon: true,
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
                        value: "under evaluation",
                      },
                      {
                        label: "Closed",
                        value: "closed",
                      },
                    ],
                  },
                ]}
                onFilterChange={handleFilterChange}
                selectedValues={{
                  Date: filters.datePublished || "",
                  Status: filters.status || "",
                  Plan: filters.plan || "",
                }}
              />
            </div>
          </div>
        )}
        emptyPlaceholder={<EmptyState />}
        classNames={{
          container:
            "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
          // tCell: "text-center",
          // tHead: "text-center",
        }}
        options={{
          disableSelection: true,
          isLoading: isLoading,
          totalCounts: totalVendors,
          manualPagination: true,
          setPagination,
          pagination,
        }}
      />

      <ConfirmAlert
        text="Are you sure you want to unsuspend this vendor?"
        title="Unsuspend Vendor"
        onPrimaryAction={() => handleUnsuspendVendor(suspendedVendorId ?? "")}
        onClose={() => {
          setSuspendedVendorId(null)
          setIsUnsuspendModel(false)
        }}
        open={isUnsuspendModel}
        isLoading={isUnsuspendingVendor}
      ></ConfirmAlert>

      <ConfirmAlert
        text="Are you sure you want to suspend this vendor?"
        title="Suspend Vendor"
        onPrimaryAction={() => handleSuspendVendor(suspendedVendorId ?? "")}
        onClose={() => {
          setSuspendedVendorId(null)
          setIsSuspendModel(false)
        }}
        open={isSuspendModel}
        isLoading={isSuspendingVendor}
      ></ConfirmAlert>
    </div>
  );
};

export default VendorManagementPage;
