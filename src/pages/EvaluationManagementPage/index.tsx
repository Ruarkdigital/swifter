import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateEvaluationDialog from "./components/CreateEvaluationDialog";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { useToastHandler } from "@/hooks/useToaster";
import { StatCard } from "./components/StatCard";
import { useUserRole } from "@/hooks/useUserRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  useEvaluationDashboard,
  useEvaluationsList,
  useMyEvaluationsList,
  useAssignedEvaluationsList,
  useManageEvaluation,
  type EvaluationApiResponse,
  type AssignedEvaluationApiResponse,
} from "./hooks/useEvaluationApi";
import { StatusBadge } from "./components/StatusBadge";
import { EmptyState } from "./components/EmptyState";
// import { SearchInput } from "@/components/layouts/SearchInput";
import { DropdownFilters } from "@/components/layouts/SolicitationFilters";

// Evaluation type definition
type Evaluation = {
  id: string;
  name: string;
  solicitationId: string;
  type: string;
  deadline: string;
  daysLeft: number;
  status: "Active" | "Pending" | "Completed";
  owner: boolean;
};

// Assigned Evaluation type definition
type AssignedEvaluation = {
  id: string;
  name: string;
  solicitationId: string;
  type: string;
  evaluationGroup: string;
  groupId: string;
  assignedDate: string;
  deadline: string;
  progress: number;
  status: "Active" | "Pending" | "Completed";
};

// Helper function to calculate days left
const calculateDaysLeft = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Transform API data to component format
const transformEvaluationData = (
  apiData:
    | { evaluations: EvaluationApiResponse[]; total: Record<string, number>[] }
    | undefined
): Evaluation[] => {
  if (!apiData || !Array.isArray(apiData.evaluations)) {
    return [];
  }

  return apiData.evaluations.map((item) => ({
    id: item._id,
    name: item.solicitationName,
    solicitationId: item._id,
    type: item.solicitationType,
    deadline: format(new Date(item.endDate), "MMM dd, yyyy pppp"),
    daysLeft: calculateDaysLeft(item.endDate),
    status: item.status as "Active" | "Pending" | "Completed",
    owner: item.owner,
  }));
};

// Transform API data to assigned evaluation format
const transformAssignedEvaluationData = (
  apiData: AssignedEvaluationApiResponse[] | undefined
): AssignedEvaluation[] => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }
  return apiData.map((item) => {
    // Determine status based on progress
    let status: "Active" | "Pending" | "Completed" = "Active";
    if (item.averageProgress === 100) {
      status = "Completed";
    } else if (item.averageProgress === 0) {
      status = "Pending";
    }

    return {
      id: item._id,
      solId: item.solicitationId,
      name: item.solicitationTitle || item.solicitationName,
      solicitationId: item.solicitationId,
      type: item.solicitationType,
      evaluationGroup: item.evaluationGroups?.[0]?.name || "No Group Assigned",
      groupId: item.evaluationGroups?.[0]?._id || "",
      assignedDate: format(
        new Date(item.evaluationGroups?.[0]?.assignedOn),
        "MMM dd, yyyy pppp"
      ), // API doesn't provide assignedDate
      deadline:
        format(new Date(item.endDate), "MMM dd, yyyy pppp") ?? "N/A", // API doesn't provide deadline
      progress: Math.round(item.averageProgress || 0),
      status,
    };
  });
};

export const EvaluationManagementPage = () => {
  const navigate = useNavigate();
  const { isProcurement, isEvaluator, isCompanyAdmin } = useUserRole();
  const manageEvaluationMutation = useManageEvaluation();
  const { success: successToast, error: errorToast } = useToastHandler();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [activeStatCard, setActiveStatCard] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // API Queries
  const { data: dashboardStats } = useEvaluationDashboard();

  const { data: evaluationsResponse, isLoading: isEvaluationsLoading } =
    useEvaluationsList({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      name: searchQuery || undefined,
      status: statusFilter || undefined,
    });

  const { data: myEvaluationsResponse, isLoading: isMyEvaluationsLoading } =
    useMyEvaluationsList({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      status: statusFilter || undefined,
    });

  // Removed useEvaluatorMyEvaluations as it's redundant with useAssignedEvaluationsList

  const {
    data: assignedEvaluationsResponse,
    isLoading: isAssignedEvaluationsLoading,
  } = useAssignedEvaluationsList({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status: statusFilter || undefined,
  });

  // Transform API data
  const evaluationData = useMemo(() => {
    if (!evaluationsResponse?.data) return [];
    return transformEvaluationData(evaluationsResponse.data);
  }, [evaluationsResponse]);

  const myEvaluationData = useMemo(() => {
    // if (isEvaluator) {
    //   if (!assignedEvaluationsResponse?.data) return [];
    //   return transformAssignedEvaluationData(assignedEvaluationsResponse.data.data);
    // }
    if (!myEvaluationsResponse?.data) return [];
    return transformEvaluationData(myEvaluationsResponse.data);
  }, [myEvaluationsResponse, assignedEvaluationsResponse, isEvaluator]);

  // Statistics with fallback to default values
  const evaluationStats = useMemo(() => {
    if (dashboardStats) {
      return {
        allEvaluations: dashboardStats.total || 0,
        activeEvaluations: dashboardStats.Active || 0,
        pendingEvaluations: dashboardStats.Pending || 0,
        completedEvaluations: dashboardStats.Completed || 0,
      };
    }
    // Fallback values
    return {
      allEvaluations: 0,
      activeEvaluations: 0,
      pendingEvaluations: 0,
      completedEvaluations: 0,
    };
  }, [dashboardStats]);

  // Handle stat card click for filtering
  const handleStatCardClick = (cardType: string) => {
    setActiveStatCard(cardType);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    
    switch (cardType) {
      case "all":
        setStatusFilter("");
        break;
      case "active":
        setStatusFilter("Active");
        break;
      case "pending":
        setStatusFilter("Pending");
        break;
      case "completed":
        setStatusFilter("Completed");
        break;
      default:
        setStatusFilter("");
    }
  };

  // Handle manage evaluation
  const handleManageEvaluation = async (evaluationId: string) => {
    try {
      await manageEvaluationMutation.mutateAsync(evaluationId);
      successToast("Evaluation management taken over successfully!", "success");
    } catch (error) {
      errorToast("Failed to take over evaluation management");
    }
  };

  // Clear active stat card when search is used
  useEffect(() => {
    if (searchQuery) {
      setActiveStatCard("");
    }
  }, [searchQuery]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter]);

  const assignedEvaluationData = useMemo(() => {
    if (!assignedEvaluationsResponse?.data.data) return [];
    return transformAssignedEvaluationData(
      assignedEvaluationsResponse.data.data
    );
  }, [assignedEvaluationsResponse]);

  // Define table columns
  const columns: ColumnDef<Evaluation>[] = [
    {
      accessorKey: "name",
      header: "Solicitation Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {row.original.solicitationId} • {row.original.type}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "deadline",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">Deadline: {row.original.deadline}</span>
          <span className="text-sm text-red-600 font-medium">
            Days Left: {row.original.daysLeft} days
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate(`/dashboard/evaluation/${row.original.id}`)}
          >
            View
          </Button>
          {!row.original.owner && (
            <ConfirmAlert
              type="info"
              title="Take Over Evaluation"
              text={`Are you sure you want to take over the evaluation for "${row.original.name}"? This will make you the manager of this evaluation.`}
              primaryButtonText="Take Over"
              secondaryButtonText="Cancel"
              onPrimaryAction={() => handleManageEvaluation(row.original.id)}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  Manage
                </Button>
              }
            />
          )}
        </div>
      ),
    },
  ];

  const myEvaluationColumns: ColumnDef<Evaluation>[] = [
    {
      accessorKey: "name",
      header: "Solicitation Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {row.original.solicitationId} • {row.original.type}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "deadline",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">Deadline: {row.original.deadline}</span>
          <span className="text-sm text-red-600 font-medium">
            Days Left: {row.original.daysLeft} days
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate(`/dashboard/evaluation/${row.original.id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  // Define assigned evaluation table columns
  const assignedEvaluationColumns: ColumnDef<AssignedEvaluation>[] = [
    {
      accessorKey: "name",
      header: "Solicitation Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {row.original.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {row.original.solicitationId} • {row.original.type}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "evaluationGroup",
      header: "Evaluation Group",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.original.evaluationGroup}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span className="text-blue-600 dark:text-blue-400">
            Assigned: {row.original.assignedDate}
          </span>
          <span className="text-blue-600 dark:text-blue-400">
            Deadline: {row.original.deadline}
          </span>
        </div>
      ),
    },
    // {
    //   accessorKey: "progress",
    //   header: "Progress",
    //   cell: ({ row }) => (
    //     <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
    //       {row.original.progress}%
    //     </span>
    //   ),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-800 font-medium w-full"
          onClick={() =>
            navigate(
              `/dashboard/evaluation/assigned/${row.original.id}/${row.original.groupId}`
            )
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-gray-100 text-gray-800 mb-1">
            Evaluations
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isProcurement && <CreateEvaluationDialog />}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="All Evaluations"
          value={evaluationStats.allEvaluations ?? 0}
          icon={FileText}
          iconColor="text-gray-600"
          iconBgColor="bg-gray-100"
          onClick={() => handleStatCardClick("all")}
          isActive={activeStatCard === "all"}
        />
        <StatCard
          title="Active Evaluations"
          value={evaluationStats.activeEvaluations}
          icon={FileText}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          onClick={() => handleStatCardClick("active")}
          isActive={activeStatCard === "active"}
        />
        <StatCard
          title="Pending Evaluations"
          value={evaluationStats.pendingEvaluations}
          icon={FileText}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
          onClick={() => handleStatCardClick("pending")}
          isActive={activeStatCard === "pending"}
        />
        <StatCard
          title="Completed Evaluations"
          value={evaluationStats.completedEvaluations}
          icon={FileText}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          onClick={() => handleStatCardClick("completed")}
          isActive={activeStatCard === "completed"}
        />
      </div>

      <Tabs
        defaultValue={
          isEvaluator
            ? "assigned_evaluation"
            : isCompanyAdmin
            ? "all_evaluations"
            : "all_evaluations"
        }
        className="w-full bg-transparent"
      >
        <TabsList className="h-auto rounded-none border-b border-gray-300 dark:border-gray-600 !bg-transparent p-0 w-full justify-start">
          {(isProcurement || isCompanyAdmin) && (
            <TabsTrigger
              value="all_evaluations"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              All Evaluations
            </TabsTrigger>
          )}
          {isProcurement && (
            <TabsTrigger
              value="my_evaluations"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              My Evaluations
            </TabsTrigger>
          )}
          {!isCompanyAdmin && (
            <TabsTrigger
              value="assigned_evaluation"
              className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
            >
              Assigned Evaluation
            </TabsTrigger>
          )}
        </TabsList>

        {(isProcurement || isCompanyAdmin) && (
          <TabsContent value="all_evaluations">
            {/* Search and Filter Section */}
            <div className="mt-6">
              <DataTable
                header={() => (
                  <Header
                    title="All Evaluations"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                )}
                emptyPlaceholder={<EmptyState />}
                classNames={{
                  container:
                    "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
                  tCell: "text-center",
                  tHead: "text-center",
                }}
                data={evaluationData}
                columns={columns}
                options={{
                  disableSelection: true,
                  isLoading: isEvaluationsLoading,
                  totalCounts:
                    evaluationsResponse?.data?.total?.[0]?.total || 0,
                  manualPagination: true,
                  setPagination,
                  pagination,
                }}
              />
            </div>
          </TabsContent>
        )}

        {isProcurement && (
          <TabsContent value="my_evaluations" className="mt-6">
            <DataTable
              header={() => (
                <Header
                  title="My Evaluations"
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}
              emptyPlaceholder={<EmptyState />}
              classNames={{
                container:
                  "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
                tCell: "text-center",
                tHead: "text-center",
              }}
              data={myEvaluationData as any}
              columns={myEvaluationColumns as any}
              options={{
                disableSelection: true,
                isLoading: isMyEvaluationsLoading,
                totalCounts:
                  myEvaluationsResponse?.data?.total?.[0]?.total || 0,
                manualPagination: true,
                setPagination,
                pagination,
              }}
            />
          </TabsContent>
        )}

        {!isCompanyAdmin && (
          <TabsContent value="assigned_evaluation" className="mt-6">
            <DataTable
              emptyPlaceholder={<EmptyState />}
              header={() => (
                <Header
                  title="Assigned Evaluations"
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}
              classNames={{
                container:
                  "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
                tCell: "text-center",
                tHead: "text-center",
              }}
              data={assignedEvaluationData}
              columns={assignedEvaluationColumns}
              options={{
                disableSelection: true,
                isLoading: isAssignedEvaluationsLoading,
                totalCounts: 0,
                manualPagination: true,
                setPagination,
                pagination,
              }}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EvaluationManagementPage;

type HeaderProps = {
  title: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="flex items-center w-full justify-between border-b border-[#E9E9EB] dark:border-slate-600 p-3 pt-0">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <h2
              className="text-base font-semibold text-gray-600 dark:text-gray-400"
              style={{ fontFamily: "Quicksand" }}
            >
              {title}
            </h2>
          </div>
          {/* <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          /> */}
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
                      title: "Date Published",
                      value: "date_published",
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
            // {
            //   title: "Plan",
            //   options: [],
            // },
          ]}
        />
      </div>
    </div>
  );
};
