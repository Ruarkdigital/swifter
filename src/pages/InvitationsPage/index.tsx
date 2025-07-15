import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { StatCard } from "./components/StatCard";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import SolicitationDetailsSheet from "./components/SolicitationDetailsSheet";
import { DropdownFilters } from "@/components/layouts/SolicitationFilters";
import { IconMap } from "@/components/layouts/RoleBasedDashboard/components/StatsCard";
import { format } from "date-fns";

// API Types based on Swagger documentation
type VendorSolicitation = {
  _id: string;
  solId: string;
  name: string;
  typeId: {
    name: string;
  };
  categoryIds: string[];
  createdAt: string;
  status: "draft" | "active" | "closed" | "awarded" | "evaluating";
  questionDeadline: string;
  submissionDeadline: string;
  bidIntentDeadline: string;
  vendors: {
    total: number;
    status: Record<string, any>;
  };
};

// UI Invitation type definition (mapped from API response)
type Invitation = {
  id: string;
  solId: string;
  solicitationName: string;
  solicitationId: string;
  rfp: string;
  invitedDate: string;
  deadline: string;
  status: "draft" | "active" | "closed" | "awarded" | "evaluating" | "not available";
};

// Map API status to UI status
const mapApiStatusToUIStatus = (apiStatus: string): Invitation["status"] => {
  switch (apiStatus.toLowerCase()) {
    case "active":
      return "active";
    case "draft":
      return "draft";
    case "evaluating":
      return "evaluating";
    case "closed":
      return "closed";
    case "awarded":
      return "awarded";
    default:
      return "not available";
  }
};

// Transform API data to UI format
const transformSolicitationToInvitation = (
  solicitation: VendorSolicitation
): Invitation => {
  return {
    id: solicitation._id,
    solId: solicitation.solId,
    solicitationName: solicitation.name,
    solicitationId: solicitation.solId,
    rfp: solicitation.typeId?.name || "RFP",
    invitedDate: format(new Date(solicitation.createdAt), "MMM d, yyyy, pppp"),
    deadline: format(new Date(solicitation.submissionDeadline), "MMM d, yyyy, pppp"),
    status: mapApiStatusToUIStatus(solicitation.status),
  };
};

// Status badge component
const StatusBadge = ({ status }: { status: Invitation["status"] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Declined":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Not Selected":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0 p-2 px-4`}>
      {status}
    </Badge>
  );
};

const InvitationsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Handle filter changes
  const handleFilterChange = (filterTitle: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterTitle]: value
    }));

    switch (filterTitle.toLowerCase()) {
      case "status":
        setStatusFilter(value === "all" ? "all" : value.toLowerCase());
        break;
      case "category":
        setCategoryFilter(value === "all" ? "all" : value);
        break;
      case "date":
        setDateFilter(value);
        break;
    }

    // Reset pagination when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // API query for vendor invitations
  const {
    data: invitationsData,
    isLoading,
  } = useQuery<ApiResponse<VendorSolicitation[]>, ApiResponseError>({
    queryKey: [
      "vendor-invitations",
      {
        status: statusFilter !== "all" ? statusFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        dateFilter: dateFilter || undefined,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }
      if (dateFilter) {
        // Add date filtering based on the selected date filter
        switch (dateFilter) {
          case "date_invited":
            // You can add specific date range logic here if needed
            params.append("sortBy", "createdAt");
            params.append("sortOrder", "desc");
            break;
        }
      }
      params.append("page", String(pagination.pageIndex + 1));
      params.append("limit", String(pagination.pageSize));

      const queryString = params.toString();
      const url = `/vendor/solicitations/my-invitations${
        queryString ? `?${queryString}` : ""
      }`;

      return await getRequest({ url });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform API data to UI format
  const transformedData = useMemo(() => {
    if (!invitationsData?.data?.data) return [];
    return invitationsData.data.data.map(transformSolicitationToInvitation);
  }, [invitationsData]);

  // Calculate statistics from the data
  const invitationStats = useMemo(() => {
    if (!transformedData.length) {
      return {
        allInvitations: 0,
        confirmedInvitations: 0,
        declinedInvitations: 0,
        pendingInvitations: 0,
      };
    }

    const stats = transformedData.reduce(
      (acc, invitation) => {
        acc.allInvitations++;
        switch (invitation.status) {
          case "active":
            acc.confirmedInvitations++;
            break;
          case "closed":
            acc.declinedInvitations++;
            break;
          case "draft":
            acc.pendingInvitations++;
            break;
        }
        return acc;
      },
      {
        allInvitations: 0,
        confirmedInvitations: 0,
        declinedInvitations: 0,
        pendingInvitations: 0,
      }
    );

    return stats;
  }, [transformedData]);

  // Use transformed data for display
  const displayData = transformedData;
  const totalCount = invitationsData?.data?.data?.length || 0;

  // Table columns definition
  const columns: ColumnDef<Invitation>[] = [
    {
      accessorKey: "solicitationName",
      header: "Solicitation Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {row.original.solicitationName}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {row.original.solicitationId} • {row.original.rfp}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "invitedDate",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            Invited: {row.original.invitedDate}
          </span>
          <span className="text-gray-700 dark:text-gray-300">
            Deadline: {row.original.deadline}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <SolicitationDetailsSheet solicitation={row.original} />
      ),
    },
  ];

  return (
    <div className="p-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Invitations
          </h1>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="All Invitations"
          value={invitationStats.allInvitations}
          icon={IconMap["folder-open"] as any}
          iconColor="text-gray-600 dark:text-gray-400"
          bgColor="bg-gray-500/20 dark:bg-gray-500/30"
          onClick={() => {
            setStatusFilter("all");
            setFilterValues(prev => ({ ...prev, Status: "all" }));
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
        />
        <StatCard
          title="Confirmed Invitations"
          value={invitationStats.confirmedInvitations}
          icon={IconMap["folder-open"] as any}
          iconColor="text-green-600 dark:text-green-400"
          bgColor="bg-green-500/20 dark:bg-green-500/30"
          onClick={() => {
            setStatusFilter("active");
            setFilterValues(prev => ({ ...prev, Status: "active" }));
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
        />
        <StatCard
          title="Declined Invitations"
          value={invitationStats.declinedInvitations}
          icon={IconMap["folder-open"] as any}
          iconColor="text-red-600 dark:text-red-400"
          bgColor="bg-red-500/20 dark:bg-red-500/30"
          onClick={() => {
            setStatusFilter("closed");
            setFilterValues(prev => ({ ...prev, Status: "closed" }));
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
        />
        <StatCard
          title="Pending Invitations"
          value={invitationStats.pendingInvitations}
          icon={IconMap["folder-open"] as any}
          iconColor="text-yellow-600 dark:text-yellow-400"
          bgColor="bg-yellow-500/20 dark:bg-yellow-500/30"
          onClick={() => {
            setStatusFilter("draft");
            setFilterValues(prev => ({ ...prev, Status: "draft" }));
            setPagination({ pageIndex: 0, pageSize: 10 });
          }}
        />
      </div>

      {/* Invitations Table */}

      <DataTable
        data={displayData}
        columns={columns}
        options={{
          manualPagination: true,
          setPagination: setPagination,
          pagination: pagination,
          totalCounts: totalCount,
          isLoading: isLoading,
        }}
        classNames={{
          container:
            "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
          // tCell: "text-center",
          // tHead: "text-center",
        }}
        header={() => (
          <div className="flex items-center w-full justify-between border-b border-[#E9E9EB] dark:border-slate-600 p-3 pt-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-base font-semibold text-gray-700 dark:text-gray-300"
                    style={{ fontFamily: "Quicksand" }}
                  >
                    Invitations
                  </h2>
                </div>
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
                        label: "Date Invited",
                        subOptions: [
                          {
                            title: "Date Invited",
                            value: "date_invited",
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
                        label: "All",
                        value: "all",
                      },
                      {
                        label: "Confirmed",
                        value: "active",
                      },
                      {
                        label: "Declined",
                        value: "closed",
                      },
                      {
                        label: "Not Selected",
                        value: "awarded",
                      },
                      {
                        label: "Pending",
                        value: "draft",
                      },
                    ],
                  },
                  // {
                  //   title: "Category",
                  //   options: [
                  //     {
                  //       label: "All",
                  //       value: "all",
                  //     },
                  //   ],
                  // },
                ]}
                onFilterChange={handleFilterChange}
                selectedValues={filterValues}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default InvitationsPage;
