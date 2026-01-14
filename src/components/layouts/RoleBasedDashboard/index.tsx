/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import { ExportReportSheet } from "@/components/layouts/ExportReportSheet";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useUser } from "@/store/authSlice";
import { DashboardDataTransformer } from "@/lib/dashboardDataTransformer";
import { ChartComponent } from "./components/ChartCard";
import { ActivityComponent } from "./components/ActivityCard";
import { CardStats } from "./components/StatsCard";
import { cn } from "@/lib/utils";
import { DashboardConfig } from "@/config/dashboardConfig";
import { PageLoader } from "@/components/ui/PageLoader";

// Main Role-Based Dashboard Component
export const RoleBasedDashboard: React.FC = () => {
  const { dashboardConfig, userRole } = useUserRole();
  const user = useUser();
  const modules = user?.module;
  // Individual chart filters instead of global filter
  const [chartFilters, setChartFilters] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Fetch dashboard data based on user role (without global filter)
  const {
    dashboardCount,
    roleDistribution,
    weeklyActivities,
    subDistribution,
    companyStatus,
    moduleUsage,
    solicitationStatus,
    bidIntent,
    vendorsDistribution,
    proposalSubmission,
    companyRoleDistribution,
    generalUpdates,
    procurementDashboard,
    procurementMyActions,
    procurementGeneralUpdates,
    procurementSolicitationStatus,
    procurementBidIntent,
    procurementVendorsDistribution,
    procurementProposalSubmission,
    procurementWeeklyActivities,
    procurementTotalEvaluations,

    evaluatorDashboard,
    evaluatorMyActions,
    evaluatorEvaluationUpdates,
    vendorDashboard,
    vendorMyActions,
    vendorGeneralUpdates,
    isLoading,
    // Individual chart data fetchers
    getChartData,
  } = useDashboardData(userRole, chartFilters);

  // Transform API data into dashboard configuration format
  const enhancedDashboardConfig: DashboardConfig = useMemo(() => {
    if (userRole === "super_admin") {
      // Transform SuperAdmin data
      const transformedStats =
        DashboardDataTransformer.transformSuperAdminStats(dashboardCount);
      DashboardDataTransformer.transformWeeklyActivities(weeklyActivities);
      const transformedSubData =
        DashboardDataTransformer.transformSubDistribution(subDistribution);
      const transformedStatusData = getChartData("company-status");
      const transformedModuleData =
        DashboardDataTransformer.transformModuleUsage(moduleUsage);
      const transformedRoleData =
        DashboardDataTransformer.transformRoleDistribution(roleDistribution);

      return {
        ...dashboardConfig,
        stats: transformedStats,
        rows: dashboardConfig.rows.map((row) => {
          if (row.type === "chart") {
            return {
              ...row,
              properties: row.properties.map((chart) => {
                switch (chart.id) {
                  case "sub-distribution":
                    return {
                      ...chart,
                      data: transformedSubData,
                      centerText: {
                        value:
                          subDistribution?.totalActive?.toString?.() ?? "0",
                        label: "Active Subscriptions",
                      },
                    };
                  case "company-status":
                    return {
                      ...chart,
                      data: transformedStatusData,
                    };
                  case "module-usage":
                    return {
                      ...chart,
                      data: transformedModuleData,
                    };
                  case "portal-role-distribution":
                    return {
                      ...chart,
                      data: transformedRoleData,
                    };
                  default:
                    return chart;
                }
              }),
            };
          }
          return row;
        }),
      };
    }

    if (userRole === "company_admin") {
      // Transform Company Admin data
      const transformedSolicitationStatus =
        DashboardDataTransformer.transformSolicitationStatus(
          solicitationStatus
        );
      const transformedBidIntent =
        DashboardDataTransformer.transformBidIntent(bidIntent);
      const transformedVendorsDistribution =
        DashboardDataTransformer.transformVendorsDistribution(
          vendorsDistribution
        );
      const transformedProposalSubmission =
        DashboardDataTransformer.transformProposalSubmission(
          proposalSubmission
        );
      const transformedCompanyRoleDistribution =
        DashboardDataTransformer.transformCompanyRoleDistribution(
          companyRoleDistribution
        );
      const transformedCompanyAdminGeneralUpdates =
        DashboardDataTransformer.transformCompanyAdminGeneralUpdates(
          generalUpdates
        );

      return {
        ...dashboardConfig,
        stats: transformedSolicitationStatus,
        rows: dashboardConfig.rows.map((row) => {
          if (row.type === "mixed") {
            return {
              ...row,
              properties: row.properties.map((property) => {
                if (property.id === "vendors-distribution") {
                  return {
                    ...property,
                    centerText: {
                      label: property?.centerText?.label ?? "Vendors",
                      value: vendorsDistribution?.total ?? 0,
                    },
                    data: transformedVendorsDistribution,
                  };
                }
                if (property.title === "General Updates") {
                  return {
                    ...property,
                    items: transformedCompanyAdminGeneralUpdates,
                  };
                }
                return property;
              }),
            };
          }
          if (row.type === "chart") {
            return {
              ...row,
              properties: row.properties.map((chart) => {
                switch (chart.id) {
                  case "bid-intent":
                    return {
                      ...chart,
                      data: transformedBidIntent,
                    };
                  case "proposal-submission":
                    return {
                      ...chart,
                      data: transformedProposalSubmission,
                    };
                  case "company-role-distribution":
                    return {
                      ...chart,
                      data: transformedCompanyRoleDistribution,
                    };
                  default:
                    return chart;
                }
              }),
            };
          }
          return row;
        }),
      };
    }

    if (userRole === "evaluator") {
      // Transform Evaluator data
      const transformedEvaluatorMyActions =
        DashboardDataTransformer.transformEvaluatorMyActions(
          evaluatorMyActions
        );
      const transformedEvaluatorEvaluationUpdates =
        DashboardDataTransformer.transformEvaluatorEvaluationUpdates(
          evaluatorEvaluationUpdates
        );

      return {
        ...dashboardConfig,
        stats:
          DashboardDataTransformer.transformEvaluatorStats(evaluatorDashboard),
        rows: dashboardConfig.rows.map((row) => {
          if (row.type === "activity") {
            return {
              ...row,
              properties: row.properties.map((activity) => {
                if (activity.id === "my-actions") {
                  return {
                    ...activity,
                    items: transformedEvaluatorMyActions,
                  };
                }
                if (activity.id === "evaluation-updates") {
                  return {
                    ...activity,
                    items: transformedEvaluatorEvaluationUpdates,
                  };
                }
                return activity;
              }),
            };
          }
          return row;
        }),
      };
    }

    if (userRole === "vendor") {
      // Transform Vendor data
      const transformedVendorMyActions =
        DashboardDataTransformer.transformVendorMyActions(vendorMyActions);
      const transformedVendorGeneralUpdates =
        DashboardDataTransformer.transformVendorGeneralUpdates(
          vendorGeneralUpdates
        );

      return {
        ...dashboardConfig,
        stats: DashboardDataTransformer.transformVendorStats(vendorDashboard),
        rows: dashboardConfig.rows.map((row) => {
          if (row.type === "activity") {
            return {
              ...row,
              properties: row.properties.map((activity) => {
                if (activity.id === "my-actions") {
                  return {
                    ...activity,
                    items: transformedVendorMyActions,
                  };
                }
                if (activity.id === "general-updates") {
                  return {
                    ...activity,
                    items: transformedVendorGeneralUpdates,
                  };
                }
                return activity;
              }),
            };
          }
          return row;
        }),
      };
    }

    if (userRole === "procurement") {
      // Transform Procurement data
      const transformedProcurementStats =
        DashboardDataTransformer.transformProcurementStats(
          procurementDashboard
        );
      const transformedSolicitationStatus =
        DashboardDataTransformer.transformChartData(
          "solicitation-status",
          procurementSolicitationStatus
        );
      const transformedBidIntent = DashboardDataTransformer.transformChartData(
        "bid-intent",
        procurementBidIntent
      );
      const transformedVendorsDistribution =
        DashboardDataTransformer.transformChartData(
          "vendors-distribution",
          procurementVendorsDistribution
        );
      const transformedProposalSubmission =
        DashboardDataTransformer.transformChartData(
          "proposal-submission",
          procurementProposalSubmission,
          "line"
        );

      const transformedTotalEvaluations =
        DashboardDataTransformer.transformChartData(
          "total-evaluation",
          procurementTotalEvaluations,
          "bar"
        );
      const transformedSolicitationActivities =
        DashboardDataTransformer.transformChartData(
          "solicitation-activities",
          procurementWeeklyActivities,
          "area"
        );
      const transformedProcurementMyActions =
        DashboardDataTransformer.transformProcurementMyActions(
          procurementMyActions
        );
      const transformedProcurementGeneralUpdates =
        DashboardDataTransformer.transformProcurementGeneralUpdates(
          procurementGeneralUpdates
        );

      const payload = {
        ...dashboardConfig,
        stats: transformedProcurementStats,
        rows: dashboardConfig.rows.map((row) => {
          if (row.type === "activity") {
            return {
              ...row,
              properties: row.properties.map((activity) => {
                if (activity.id === "my-actions") {
                  return {
                    ...activity,
                    items: transformedProcurementMyActions,
                  };
                }
                if (activity.id === "general-updates") {
                  return {
                    ...activity,
                    items: transformedProcurementGeneralUpdates,
                  };
                }
                return activity;
              }),
            };
          }

          if (row.type === "chart") {
            return {
              ...row,
              properties: row.properties.map((chart) => {
                switch (chart.id) {
                  case "solicitation-status":
                    return {
                      ...chart,
                      data: transformedSolicitationStatus,
                    };
                  case "solicitation-activities":
                    return {
                      ...chart,
                      data: transformedSolicitationActivities,
                    };
                  case "vendors-bid-intent-status":
                    return {
                      ...chart,
                      centerText: {
                        label: "Active Bids",
                        value:
                          procurementBidIntent?.activeBid.toString() || "0",
                      },
                      data: transformedBidIntent,
                    };
                  case "vendors-distribution":
                    return {
                      ...chart,
                      centerText: {
                        label: "Vendors",
                        value:
                          procurementVendorsDistribution?.total.toString() ||
                          "0",
                      },
                      data: transformedVendorsDistribution,
                    };
                  case "proposal-submission":
                    return {
                      ...chart,
                      data: transformedProposalSubmission,
                    };
                  case "weekly-activities":
                    return {
                      ...chart,
                      data: transformedSolicitationActivities,
                    };
                  case "total-evaluation":
                    return {
                      ...chart,
                      data: transformedTotalEvaluations,
                    };
                  default:
                    return chart;
                }
              }),
            };
          }

          return row;
        }),
      };

      return payload;
    }

    // For other roles, return the original config
    // This can be extended to handle other role-specific data transformations
    return dashboardConfig;
  }, [
    dashboardConfig,
    userRole,
    dashboardCount,
    roleDistribution,
    weeklyActivities,
    subDistribution,
    companyStatus,
    moduleUsage,
    solicitationStatus,
    bidIntent,
    vendorsDistribution,
    proposalSubmission,
    companyRoleDistribution,
    generalUpdates,
    procurementDashboard,
    procurementMyActions,
    procurementGeneralUpdates,
    procurementSolicitationStatus,
    procurementBidIntent,
    procurementVendorsDistribution,
    procurementProposalSubmission,
    procurementWeeklyActivities,
    procurementTotalEvaluations,
    evaluatorDashboard,
    evaluatorMyActions,
    evaluatorEvaluationUpdates,
    vendorDashboard,
    vendorMyActions,
    vendorGeneralUpdates,
  ]);

  const primaryTabs = enhancedDashboardConfig.primaryTabs || [];
  const secondaryTabs = enhancedDashboardConfig.secondaryTabs || [];

  const [activePrimaryTab, setActivePrimaryTab] = useState(
    primaryTabs[0] || "Overview"
  );
  const [activeSecondaryTab, setActiveSecondaryTab] = useState(
    secondaryTabs[0] || "Total Contracts"
  );

  // Handle individual chart filter changes
  const handleFilterChange = (chartId?: string, filter?: string) => {
    if (!chartId || !filter) return;
    setChartFilters((prev) => ({
      ...prev,
      [chartId]: filter.replace(/\s+/g, ""),
    }));
  };

  // Get filter for specific chart (default to "12months")
  const getChartFilter = (chartId?: string) => {
    if (!chartId) return "12months";
    return chartFilters[chartId] || "12months";
  };

  // Handle stat card clicks for navigation with filters
  const handleStatCardClick = (title: string) => {
    // Define route mappings with filters for each user role
    const routeMappings: Record<
      string,
      { route: string; filters?: Record<string, string> }
    > = {
      // Super Admin routes
      "All Companies": { route: "/dashboard/companies" },
      "Active Companies": {
        route: "/dashboard/companies",
        filters: { status: "active" },
      },
      "Suspended Companies": {
        route: "/dashboard/companies",
        filters: { status: "suspended" },
      },
      "All Admins": { route: "/dashboard/admin-management" },
      "Super Admins": {
        route: "/dashboard/admin-management",
        filters: { role: "super_admin" },
      },
      "Organisation Admins": {
        route: "/dashboard/admin-management",
        filters: { role: "company_admin" },
      },

      // Procurement routes
      "All Solicitations": { route: "/dashboard/solicitation" },
      "Active Solicitations": {
        route: "/dashboard/solicitation",
        filters: { status: "active" },
      },
      "Pending Evaluations": {
        route: "/dashboard/evaluation",
        filters: { status: "pending" },
      },
      Awarded: {
        route: "/dashboard/solicitation",
        filters: { status: "awarded" },
      },

      // Evaluator routes
      "All Evaluations": { route: "/dashboard/evaluation" },
      "Active Evaluations": {
        route: "/dashboard/evaluation",
        filters: { status: "active" },
      },
      "Completed Evaluations": {
        route: "/dashboard/evaluation",
        filters: { status: "completed" },
      },

      // Vendor routes
      "All Invitations": { route: "/dashboard/invitations" },
      "Confirmed Invitations": {
        route: "/dashboard/invitations",
        filters: { status: "confirmed" },
      },
      "Declined Invitations": {
        route: "/dashboard/invitations",
        filters: { status: "declined" },
      },
      "Pending Invitations": {
        route: "/dashboard/invitations",
        filters: { status: "pending" },
      },

      // Company Admin routes (similar to procurement for solicitations)
      "Total Solicitations": { route: "/dashboard/solicitation" },
      "Total Users": { route: "/dashboard/user-management" },
      "Active Users": {
        route: "/dashboard/user-management",
        filters: { status: "active" },
      },
      "Inactive Users": {
        route: "/dashboard/user-management",
        filters: { status: "inactive" },
      },
    };

    const mapping = routeMappings[title];
    if (mapping) {
      const { route, filters } = mapping;

      if (filters && Object.keys(filters).length > 0) {
        // Create URLSearchParams for filters
        const searchParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          searchParams.set(key, value);
        });

        // Navigate with query parameters
        navigate(`${route}?${searchParams.toString()}`);
      } else {
        // Navigate without filters
        navigate(route);
      }
    }
  };

  // Show loading state if data is being fetched
  if (
    isLoading &&
    [
      "super_admin",
      "company_admin",
      "evaluator",
      "vendor",
      "procurement",
    ].includes(userRole)
  ) {
    return (
      <PageLoader
        title="Dashboard"
        // headerContent={<ExportReportSheet />}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
          </div>
          {enhancedDashboardConfig.showExport && (
            <ExportReportSheet>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                <span>Export</span>
              </button>
            </ExportReportSheet>
          )}
        </div>

        {primaryTabs.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
            <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-sm">
              {primaryTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium text-slate-500",
                    activePrimaryTab === tab &&
                      "bg-white text-slate-900 shadow-sm"
                  )}
                  onClick={() => setActivePrimaryTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {secondaryTabs.length > 0 && (
              <div className="flex gap-2 text-xs">
                {secondaryTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={cn(
                      "rounded-full px-3 py-1 font-medium",
                      activeSecondaryTab === tab
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 border border-slate-200 bg-white"
                    )}
                    onClick={() => setActiveSecondaryTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Stats Cards */}
      <div
        className={cn(`grid grid-cols-1 md:grid-cols-2 gap-6`, {
          "lg:grid-cols-2": enhancedDashboardConfig.stats.length === 8,
          "lg:grid-cols-3": enhancedDashboardConfig.stats.length === 6,
          "lg:grid-cols-4":
            enhancedDashboardConfig.stats.length === 4 ||
            enhancedDashboardConfig.stats.length > 8,
        })}
      >
        {enhancedDashboardConfig.stats?.map?.((stat, index) => (
          <CardStats
            key={index}
            {...stat}
            onClick={() => handleStatCardClick(stat.title)}
          />
        ))}
      </div>

      {/* Activities and Charts Section */}
      {enhancedDashboardConfig.rows?.map?.((item, rowIndex) => {
        if (item.type === "activity") {
          const gatedActivities = item.properties.filter((activity) => {
            if (activity.id === "my-actions" && modules?.myActions !== true) {
              return false;
            }
            if (
              activity.id === "general-updates" &&
              modules?.generalUpdatesNotifications !== true
            ) {
              return false;
            }
            return true;
          });
          return (
            <div
              key={`activity-row-${rowIndex}`}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-6",
                item.className
              )}
            >
              {gatedActivities.map((activity, index) => (
                <ActivityComponent key={index} activity={activity} />
              ))}
            </div>
          );
        } else if (item.type === "chart") {
          return (
            <div
              key={`chart-row-${rowIndex}`}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-6",
                item.className
              )}
            >
              {item.properties?.map?.((chart) => (
                <ChartComponent
                  key={chart.id}
                  chart={chart}
                  selected={getChartFilter(chart.id)}
                  onFilterChange={(filter) =>
                    handleFilterChange(chart.id, filter)
                  }
                  chartData={getChartData ? getChartData(chart.id) : chart.data}
                />
              ))}
            </div>
          );
        } else if (item.type === "mixed") {
          return (
            <div
              key={`mixed-row-${rowIndex}`}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-6",
                item.className
              )}
            >
              {item.properties
                ?.filter?.((component) => {
                  if (
                    component.items &&
                    component.title === "General Updates" &&
                    modules?.generalUpdatesNotifications !== true
                  ) {
                    return false;
                  }
                  if (
                    component.items &&
                    component.id === "my-actions" &&
                    modules?.myActions !== true
                  ) {
                    return false;
                  }
                  return true;
                })
                ?.map?.((component, index) => {
                  // Check if component has activity-specific properties
                  if (component.items) {
                    return (
                      <ActivityComponent
                        key={`activity-${index}`}
                        activity={component}
                      />
                    );
                  } else {
                    // Assume it's a chart component
                    return (
                      <ChartComponent
                        key={`chart-${component.id || index}`}
                        chart={component}
                        selected={getChartFilter(
                          component.id || `chart-${index}`
                        )}
                        onFilterChange={(filter) =>
                          handleFilterChange(
                            component.id || `chart-${index}`,
                            filter
                          )
                        }
                        chartData={
                          getChartData
                            ? getChartData(component.id || `chart-${index}`)
                            : component.data
                        }
                      />
                    );
                  }
                })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default RoleBasedDashboard;
