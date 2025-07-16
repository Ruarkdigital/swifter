import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, UserRole } from "@/types";
import { DashboardDataTransformer } from "@/lib/dashboardDataTransformer";

// Dashboard data types based on API documentation
export interface SuperAdminDashboardCount {
  company: {
    activeCompanies: number;
    allCompanies: number;
    suspendedCompanies: number;
    totalAdmins: number;
    superAdmins: number;
    companyAdmins: number;
  };
  users: {
    super_admin: number;
    company_admin: number;
  };
}

export interface RoleDistribution {
  roleName: string;
  count: string;
}

export interface TimeStats {
  timeStats: TimeStat[];
}

export interface TimeStat {
  label: string;
  total: number;
  active: number;
  expiring: number;
}

export interface WeeklyActivities {
  solicitations: any[];
  evaluations: any[];
}

export interface SubDistribution {
  totalActive: number;
  distribution: Distribution[];
}

export interface Distribution {
  count: number;
  plan: string;
}

export interface SolicitationStatusData {
  total: number;
  awarded: number;
  active: number;
  evaluating: number;
  closed: number;
  draft: number;
  percentage: number;
}

export interface VendorsDistributionData {
  pending: { count: number; percentage: number };
  inactive: { count: number; percentage: number };
  active: { count: number; percentage: number };
  total: number;
}

// Evaluator Dashboard Data Types
export interface EvaluatorDashboardData {
  total: number;
  Active: number;
  Inactive: number;
  Suspended: number;
  Pending: number;
  Completed: number;
  Draft: number;
}

export interface EvaluatorMyActions {
  // Based on MyAction schema from API
  [key: string]: any;
}

export interface EvaluatorEvaluationActivity {
  // Based on EvaluationActivity schema from API
  [key: string]: any;
}

// Vendor Dashboard Data Types
export interface VendorMyActions {
  action: string;
  solicitation: {
    _id: string;
    name: string;
    vendors: {
      status: string;
    }[];
  };
  _id: string;
  createdAt: "2025-06-26T08:09:06.611Z";
}

export interface VendorGeneralUpdates {
  [key: string]: any;
}

export interface VendorDashboardStats {
  status: string;
  count: number;
}

export interface ModuleUsage {
  evaluationUsage: number;
  adendumUsage: number;
  solicitationUsage: number;
  vendorUage: number;
}

export interface CompanyStatus {
  month: string;
  active: number;
  suspended: number;
  pending: number;
}

/**
 * Custom hook for fetching dashboard data based on user role
 * Implements API integration for SuperAdmin and other roles
 */
export const useDashboardData = (
  userRole: UserRole,
  chartFilters: Record<string, string> = {}
) => {
  const defaultFilter = "12months";

  // Helper function to get filter for a specific chart
  const getFilterForChart = (chartId: string) => {
    return chartFilters[chartId] || defaultFilter;
  };

  // Function to get chart-specific data
  const getChartData = (chartId?: string) => {
    if(!chartId) return []
    // const filter = getFilterForChart(chartId);

    // Map chart IDs to their corresponding data with proper transformation
    switch (chartId) {
      case "role-distribution":
        return DashboardDataTransformer.transformRoleDistribution(roleDistribution?.data?.data);
      case "weekly-activities":
        return DashboardDataTransformer.transformWeeklyActivities(weeklyActivities?.data?.data);
      case "sub-distribution":
        return DashboardDataTransformer.transformSubDistribution(subDistribution?.data?.data);
      case "company-status":
        return DashboardDataTransformer.transformCompanyStatus(companyStatus?.data?.data);
      case "module-usage":
        return DashboardDataTransformer.transformModuleUsage(moduleUsage?.data?.data);
      case "solicitation-status":
        return DashboardDataTransformer.transformSolicitationStatusChart(solicitationStatus?.data?.data);
      case "bid-intent":
        return DashboardDataTransformer.transformBidIntentChart(bidIntent?.data?.data);
      case "vendors-distribution":
        return DashboardDataTransformer.transformVendorsDistribution(vendorsDistribution?.data?.data);
      case "proposal-submission":
        return DashboardDataTransformer.transformProposalSubmission(proposalSubmission?.data?.data);
      case "company-role-distribution":
        return DashboardDataTransformer.transformRoleDistribution(companyRoleDistribution?.data?.data);
      case "procurement-solicitation-status":
        return DashboardDataTransformer.transformSolicitationStatusChart(procurementSolicitationStatus?.data?.data);
      case "procurement-bid-intent":
        return DashboardDataTransformer.transformBidIntentChart(procurementBidIntent?.data?.data);
      case "procurement-vendors-distribution":
        return DashboardDataTransformer.transformVendorsDistribution(procurementVendorsDistribution?.data?.data);
      case "procurement-proposal-submission":
        return DashboardDataTransformer.transformProposalSubmission(procurementProposalSubmission?.data?.data);
      case "procurement-weekly-activities":
        return DashboardDataTransformer.transformWeeklyActivities(procurementWeeklyActivities?.data?.data);
      case "procurement-total-evaluations":
        return DashboardDataTransformer.transformTotalEvaluations(procurementTotalEvaluations?.data?.data);
      default:
        return [];
    }
  };
  // SuperAdmin dashboard count
  const { data: dashboardCount, isLoading: isLoadingCount } = useQuery<
    ApiResponse<SuperAdminDashboardCount>,
    ApiResponseError
  >({
    queryKey: ["dashboard-count", userRole],
    queryFn: async () => await getRequest({ url: "/companies/dashboard" }),
    enabled: userRole === "super_admin",
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Role distribution data
  const { data: roleDistribution, isLoading: isLoadingRoles } = useQuery<
    ApiResponse<RoleDistribution[]>,
    ApiResponseError
  >({
    queryKey: [
      "role-distribution",
      userRole,
      getFilterForChart("role-distribution"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/companies/dashboard/role-distribution",
        config: {
          params: { range: getFilterForChart("role-distribution") },
        },
      }),
    enabled: userRole === "super_admin",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Weekly activities data
  const { data: weeklyActivities, isLoading: isLoadingActivities } = useQuery<
    ApiResponse<WeeklyActivities>,
    ApiResponseError
  >({
    queryKey: [
      "weekly-activities",
      userRole,
      getFilterForChart("weekly-activities"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/companies/dashboard/weekly-activities",
        config: {
          params: { range: getFilterForChart("weekly-activities") },
        },
      }),
    enabled: userRole === "super_admin",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Subscription distribution data
  const { data: subDistribution, isLoading: isLoadingSubs } = useQuery<
    ApiResponse<SubDistribution>,
    ApiResponseError
  >({
    queryKey: [
      "sub-distribution",
      userRole,
      getFilterForChart("sub-distribution"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/companies/dashboard/sub-distribution",
        config: {
          params: { range: getFilterForChart("sub-distribution") },
        },
      }),
    enabled: userRole === "super_admin",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Company status data
  const { data: companyStatus, isLoading: isLoadingStatus } = useQuery<
    ApiResponse<TimeStats[]>,
    ApiResponseError
  >({
    queryKey: ["company-status", userRole, getFilterForChart("company-status")],
    queryFn: async () =>
      await getRequest({
        url: "/companies/dashboard/company-status",
        config: {
          params: { range: getFilterForChart("company-status") },
        },
      }),
    enabled: userRole === "super_admin",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Module usage data
  const { data: moduleUsage, isLoading: isLoadingModules } = useQuery<
    ApiResponse<ModuleUsage[]>,
    ApiResponseError
  >({
    queryKey: ["module-usage", userRole, getFilterForChart("module-usage")],
    queryFn: async () =>
      await getRequest({
        url: "/companies/dashboard/module-usage",
        config: {
          params: { range: getFilterForChart("module-usage") },
        },
      }),
    enabled: userRole === "super_admin",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Company Admin Analytics - Solicitation Status
  const { data: solicitationStatus, isLoading: isLoadingSolicitationStatus } =
    useQuery<ApiResponse<SolicitationStatusData>, ApiResponseError>({
      queryKey: [
        "solicitation-status",
        userRole,
        getFilterForChart("solicitation-status"),
      ],
      queryFn: async () =>
        await getRequest({
          url: "/procurement/solicitations/analytics/status",
          config: {
            params: { range: getFilterForChart("solicitation-status") },
          },
        }),
      enabled: userRole === "company_admin",
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  // Company Admin Analytics - Bid Intent
  const { data: bidIntent, isLoading: isLoadingBidIntent } = useQuery<
    ApiResponse<any>,
    ApiResponseError
  >({
    queryKey: ["bid-intent", userRole, getFilterForChart("bid-intent")],
    queryFn: async () =>
      await getRequest({
        url: "/procurement/solicitations/analytics/bid-intent",
        config: {
          params: { range: getFilterForChart("bid-intent") },
        },
      }),
    enabled: userRole === "company_admin",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Company Admin Analytics - Vendors Distribution
  const { data: vendorsDistribution, isLoading: isLoadingVendorsDistribution } =
    useQuery<ApiResponse<VendorsDistributionData>, ApiResponseError>({
      queryKey: [
        "vendors-distribution",
        userRole,
        getFilterForChart("vendors-distribution"),
      ],
      queryFn: async () =>
        await getRequest({
          url: "/procurement/solicitations/analytics/vendors-distribution",
          config: {
            params: { range: getFilterForChart("vendors-distribution") },
          },
        }),
      enabled: userRole === "company_admin",
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  // Company Admin Analytics - Proposal Submission
  const { data: proposalSubmission, isLoading: isLoadingProposalSubmission } =
    useQuery<ApiResponse<any>, ApiResponseError>({
      queryKey: [
        "proposal-submission",
        userRole,
        getFilterForChart("proposal-submission"),
      ],
      queryFn: async () =>
        await getRequest({
          url: "/procurement/solicitations/analytics/proposal-submission",
          config: {
            params: { range: getFilterForChart("proposal-submission") },
          },
        }),
      enabled: userRole === "company_admin",
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  // Company Admin - Role Distribution
  const {
    data: companyRoleDistribution,
    isLoading: isLoadingCompanyRoleDistribution,
  } = useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: [
      "company-role-distribution",
      userRole,
      getFilterForChart("company-role-distribution"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/admins/dashboard/role-distribution",
        config: {
          params: { range: getFilterForChart("company-role-distribution") },
        },
      }),
    enabled: userRole === "company_admin",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Company Admin - General Updates
  const { data: generalUpdates, isLoading: isLoadingGeneralUpdates } = useQuery<
    ApiResponse<any>,
    ApiResponseError
  >({
    queryKey: ["general-updates", userRole],
    queryFn: async () =>
      await getRequest({ url: "/admins/dashboard/general-updates" }),
    enabled: userRole === "company_admin",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Evaluator Dashboard - Evaluation Status Summary
  const { data: evaluatorDashboard, isLoading: isLoadingEvaluatorDashboard } =
    useQuery<ApiResponse<EvaluatorDashboardData>, ApiResponseError>({
      queryKey: ["evaluator-dashboard", userRole],
      queryFn: async () =>
        await getRequest({ url: "/procurement/evaluations/dashboard" }),
      enabled: userRole === "evaluator",
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  // Evaluator Dashboard - My Actions
  const { data: evaluatorMyActions, isLoading: isLoadingEvaluatorMyActions } =
    useQuery<ApiResponse<EvaluatorMyActions>, ApiResponseError>({
      queryKey: ["evaluator-my-actions", userRole],
      queryFn: async () =>
        await getRequest({ url: "/evaluator/dashboard/my-actions" }),
      enabled: userRole === "evaluator",
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  // Evaluator Dashboard - Evaluation Updates
  const {
    data: evaluatorEvaluationUpdates,
    isLoading: isLoadingEvaluatorEvaluationUpdates,
  } = useQuery<ApiResponse<EvaluatorEvaluationActivity>, ApiResponseError>({
    queryKey: ["evaluator-evaluation-updates", userRole],
    queryFn: async () =>
      await getRequest({ url: "/evaluator/dashboard/evalutions-update" }),
    enabled: userRole === "evaluator",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Vendor Dashboard - Solicitation Overview
  const { data: vendorDashboard, isLoading: isLoadingVendorDashboard } =
    useQuery<ApiResponse<VendorDashboardStats[]>, ApiResponseError>({
      queryKey: ["vendor-dashboard", userRole],
      queryFn: async () =>
        await getRequest({ url: "/vendor/solicitations/dashboard" }),
      enabled: userRole === "vendor",
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  // Vendor Dashboard - My Actions
  const { data: vendorMyActions, isLoading: isLoadingVendorMyActions } =
    useQuery<ApiResponse<VendorMyActions[]>, ApiResponseError>({
      queryKey: ["vendor-my-actions", userRole],
      queryFn: async () =>
        await getRequest({ url: "/vendor/solicitations/my-actions" }),
      enabled: userRole === "vendor",
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  // Vendor Dashboard - General Updates
  const {
    data: vendorGeneralUpdates,
    isLoading: isLoadingVendorGeneralUpdates,
  } = useQuery<ApiResponse<VendorGeneralUpdates>, ApiResponseError>({
    queryKey: ["vendor-general-updates", userRole],
    queryFn: async () =>
      await getRequest({ url: "/vendor/solicitations/general-updates" }),
    enabled: userRole === "vendor",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // For other roles, we can add similar queries here
  // Example for procurement role (if needed):
  const { data: procurementDashboard, isLoading: isLoadingProcurement } =
    useQuery<ApiResponse<any>, ApiResponseError>({
      queryKey: ["procurement-dashboard", userRole],
      queryFn: async () =>
        await getRequest({ url: "/procurement/solicitations/dashboard" }),
      enabled: userRole === "procurement",
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  // Procurement Analytics - Solicitation Status
  const {
    data: procurementSolicitationStatus,
    isLoading: isLoadingProcurementSolicitationStatus,
  } = useQuery<ApiResponse<SolicitationStatusData>, ApiResponseError>({
    queryKey: [
      "procurement-solicitation-status",
      userRole,
      getFilterForChart("procurement-solicitation-status"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/procurement/solicitations/analytics/status",
        config: {
          params: {
            range: getFilterForChart("procurement-solicitation-status"),
          },
        },
      }),
    enabled: userRole === "procurement",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Procurement Analytics - Bid Intent
  const {
    data: procurementBidIntent,
    isLoading: isLoadingProcurementBidIntent,
  } = useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: [
      "procurement-bid-intent",
      userRole,
      getFilterForChart("procurement-bid-intent"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/procurement/solicitations/analytics/bid-intent",
        config: {
          params: { range: getFilterForChart("procurement-bid-intent") },
        },
      }),
    enabled: userRole === "procurement",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Procurement Analytics - Vendors Distribution
  const {
    data: procurementVendorsDistribution,
    isLoading: isLoadingProcurementVendorsDistribution,
  } = useQuery<ApiResponse<VendorsDistributionData>, ApiResponseError>({
    queryKey: [
      "procurement-vendors-distribution",
      userRole,
      getFilterForChart("procurement-vendors-distribution"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/procurement/solicitations/analytics/vendors-distribution",
        config: {
          params: {
            range: getFilterForChart("procurement-vendors-distribution"),
          },
        },
      }),
    enabled: userRole === "procurement",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Procurement Analytics - Proposal Submission
  const {
    data: procurementProposalSubmission,
    isLoading: isLoadingProcurementProposalSubmission,
  } = useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: [
      "procurement-proposal-submission",
      userRole,
      getFilterForChart("procurement-proposal-submission"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/procurement/solicitations/analytics/proposal-submission",
        config: {
          params: {
            range: getFilterForChart("procurement-proposal-submission"),
          },
        },
      }),
    enabled: userRole === "procurement",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Procurement Analytics - Weekly Activities
  const {
    data: procurementWeeklyActivities,
    isLoading: isLoadingProcurementWeeklyActivities,
  } = useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: [
      "procurement-weekly-activities",
      userRole,
      getFilterForChart("procurement-weekly-activities"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/procurement/solicitations/analytics/activities",
        config: {
          params: { range: getFilterForChart("procurement-weekly-activities") },
        },
      }),
    enabled: userRole === "procurement",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Procurement Analytics - Total Evaluations
  const {
    data: procurementTotalEvaluations,
    isLoading: isLoadingProcurementTotalEvaluations,
  } = useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: [
      "procurement-total-evaluations",
      userRole,
      getFilterForChart("procurement-total-evaluations"),
    ],
    queryFn: async () =>
      await getRequest({
        url: "/procurement/solicitations/analytics/total-evaluations",
        config: {
          params: { range: getFilterForChart("procurement-total-evaluations") },
        },
      }),
    enabled: userRole === "procurement",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Procurement My Actions
  const {
    data: procurementMyActions,
    isLoading: isLoadingProcurementMyActions,
  } = useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: ["procurement-my-actions", userRole],
    queryFn: async () =>
      await getRequest({ url: "/procurement/solicitations/my-actions" }),
    enabled: userRole === "procurement",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Procurement General Updates
  const {
    data: procurementGeneralUpdates,
    isLoading: isLoadingProcurementGeneralUpdates,
  } = useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: ["procurement-general-updates", userRole],
    queryFn: async () =>
      await getRequest({ url: "/procurement/solicitations/general-updates" }),
    enabled: userRole === "procurement",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const isLoading =
    isLoadingCount ||
    isLoadingRoles ||
    isLoadingActivities ||
    isLoadingSubs ||
    isLoadingStatus ||
    isLoadingModules ||
    isLoadingProcurement ||
    isLoadingSolicitationStatus ||
    isLoadingBidIntent ||
    isLoadingVendorsDistribution ||
    isLoadingProposalSubmission ||
    isLoadingCompanyRoleDistribution ||
    isLoadingGeneralUpdates ||
    isLoadingEvaluatorDashboard ||
    isLoadingEvaluatorMyActions ||
    isLoadingEvaluatorEvaluationUpdates ||
    isLoadingVendorDashboard ||
    isLoadingVendorMyActions ||
    isLoadingVendorGeneralUpdates ||
    isLoadingProcurementMyActions ||
    isLoadingProcurementGeneralUpdates ||
    isLoadingProcurementSolicitationStatus ||
    isLoadingProcurementBidIntent ||
    isLoadingProcurementVendorsDistribution ||
    isLoadingProcurementProposalSubmission ||
    isLoadingProcurementWeeklyActivities ||
    isLoadingProcurementTotalEvaluations;

  return {
    // SuperAdmin data
    dashboardCount: dashboardCount?.data?.data,
    roleDistribution: roleDistribution?.data?.data,
    weeklyActivities: weeklyActivities?.data?.data,
    subDistribution: subDistribution?.data?.data,
    companyStatus: companyStatus?.data?.data,
    moduleUsage: moduleUsage?.data?.data,

    // Company Admin data
    solicitationStatus: solicitationStatus?.data?.data,
    bidIntent: bidIntent?.data?.data,
    vendorsDistribution: vendorsDistribution?.data?.data,
    proposalSubmission: proposalSubmission?.data?.data,
    companyRoleDistribution: companyRoleDistribution?.data?.data,
    generalUpdates: generalUpdates?.data?.data,

    // Other roles data
    procurementDashboard: procurementDashboard?.data?.data,
    procurementMyActions: procurementMyActions?.data?.data,
    procurementGeneralUpdates: procurementGeneralUpdates?.data?.data,

    // Procurement Analytics data
    procurementSolicitationStatus: procurementSolicitationStatus?.data?.data,
    procurementBidIntent: procurementBidIntent?.data?.data,
    procurementVendorsDistribution: procurementVendorsDistribution?.data?.data,
    procurementProposalSubmission: procurementProposalSubmission?.data?.data,
    procurementWeeklyActivities: procurementWeeklyActivities?.data?.data,
    procurementTotalEvaluations: procurementTotalEvaluations?.data?.data,

    // Evaluator data
    evaluatorDashboard: evaluatorDashboard?.data?.data,
    evaluatorMyActions: evaluatorMyActions?.data?.data,
    evaluatorEvaluationUpdates: evaluatorEvaluationUpdates?.data?.data,

    // Vendor data
    vendorDashboard: vendorDashboard?.data?.data,
    vendorMyActions: vendorMyActions?.data?.data,
    vendorGeneralUpdates: vendorGeneralUpdates?.data?.data,

    // Chart data function
    getChartData,

    // Loading states
    isLoading,
    isLoadingCount,
    isLoadingRoles,
    isLoadingActivities,
    isLoadingSubs,
    isLoadingStatus,
    isLoadingModules,
    isLoadingProcurement,
    isLoadingSolicitationStatus,
    isLoadingBidIntent,
    isLoadingVendorsDistribution,
    isLoadingProposalSubmission,
    isLoadingCompanyRoleDistribution,
    isLoadingGeneralUpdates,
    isLoadingEvaluatorDashboard,
    isLoadingEvaluatorMyActions,
    isLoadingEvaluatorEvaluationUpdates,
    isLoadingVendorDashboard,
    isLoadingVendorMyActions,
    isLoadingVendorGeneralUpdates,
    isLoadingProcurementMyActions,
    isLoadingProcurementGeneralUpdates,
  };
};
