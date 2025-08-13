import {
  SuperAdminDashboardCount,
  RoleDistribution,
  // TimeStats,
  SubDistribution,
  // ModuleUsage,
  WeeklyActivities,
  EvaluatorDashboardData,
  EvaluatorMyActions,
  EvaluatorEvaluationActivity,
  VendorMyActions,
  VendorsDistributionData,
} from "@/hooks/useDashboardData";
import { DashboardConfig } from "@/config/dashboardConfig";
import { applyConsistentColors } from "./chartColorUtils";
import { format } from "date-fns";

// Dynamic link generation utility
type UserRole = 'procurement' | 'evaluator' | 'vendor';
type ActivityType = 'general' | 'myActions';

interface LinkMapping {
  [role: string]: {
    [activityType: string]: {
      [action: string]: string;
    };
  };
}

const ACTIVITY_LINK_MAPPINGS: LinkMapping = {
  procurement: {
    general: {
      published: '/dashboard/solicitation',
      addendum: '/dashboard/solicitation',
      question: '/dashboard/solicitation',
      vendor_accept: '/dashboard/solicitation',
      proposal_submitted: '/dashboard/solicitation',
      scored: '/dashboard/evaluation',
    },
    myActions: {
      create_evaluation: '/dashboard/evaluation',
      create_evaluation_group: '/dashboard/evaluation',
      release_group: '/dashboard/evaluation',
    },
  },
  evaluator: {
    general: {
      Scored: '/dashboard/evaluation',
      Created: '/dashboard/evaluation',
    },
    myActions: {
      'score solicitation': '/dashboard/evaluation',
    },
  },
  vendor: {
    general: {
      vendor_accept: '/dashboard/solicitation',
      vendor_decline: '/dashboard/solicitation',
      addendum_question: '/dashboard/solicitation',
    },
    myActions: {
      draft: '/dashboard/solicitation',
      invited: '/dashboard/invitations',
      no_response: '/dashboard/solicitation',
      submit_proposal: '/dashboard/solicitation',
    },
  },
};

/**
 * Generate dynamic link based on user role, activity type, and action
 * @param userRole - The user's role (procurement, evaluator, vendor)
 * @param activityType - Type of activity (general, myActions)
 * @param action - The specific action from statusText
 * @param data - Object containing id and name for the link
 * @returns The complete href or null if no mapping exists
 */
function generateDynamicLink(
  userRole: UserRole,
  activityType: ActivityType,
  action: string,
  data: { id: string; name: string }
): string | null {
  const roleMapping = ACTIVITY_LINK_MAPPINGS[userRole];
  if (!roleMapping) return null;

  const activityMapping = roleMapping[activityType];
  if (!activityMapping) return null;

  const basePath = activityMapping[action];
  if (!basePath) return null;

  return `${basePath}/${data.id}`;
}

/**
 * Apply dynamic status text replacement based on user role and activity action
 * @param statusText - The original status text
 * @param userRole - The user's role
 * @param activityType - Type of activity (general or myActions)
 * @param data - Object containing id and name
 * @returns Modified status text with dynamic links
 */
function applyDynamicStatusTextReplacement(
  statusText: string,
  userRole: UserRole,
  activityType: ActivityType,
  data: { id: string; name: string }
): string {
  // Extract potential actions from statusText to match against mappings
  const roleMapping = ACTIVITY_LINK_MAPPINGS[userRole]?.[activityType];
  if (!roleMapping) {
    // Fallback to original behavior if no mapping exists
    return statusText.replace(
      data.name,
      `<a href="/dashboard/solicitation/${data.id}" class="underline underline-offset-4 text-blue-600">${data.name}</a>`
    );
  }

  // Find matching action in statusText (case-sensitive)
  for (const action of Object.keys(roleMapping)) {
    if (statusText.includes(action)) {
      const href = generateDynamicLink(userRole, activityType, action, data);
      if (href) {
        return statusText.replace(
          data.name,
          `<a href="${href}" class="underline underline-offset-4 text-blue-600">${data.name}</a>`
        );
      } else {
        return statusText
      }
    }
  }

  // Fallback to original behavior if no action matches
  return statusText.replace(
    data.name,
    `<a href="/dashboard/solicitation/${data.id}" class="underline underline-offset-4 text-blue-600">${data.name}</a>`
  );
}

// Types for Recharts-compatible data formats
export interface PieChartData {
  [key: string]: string | number | undefined;
  name: string;
  value: number;
  percentage?: number;
}

export interface LineChartData {
  [key: string]: string | number;
}

export interface BarChartData {
  [key: string]: string | number;
}

export type RechartsData = PieChartData | LineChartData | BarChartData;

// Chart transformation utilities
export class ChartDataTransformer {
  /**
   * Convert month number to short month name
   */
  static getMonthName(monthNumber: number): string {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[monthNumber - 1] || "Unknown";
  }

  /**
   * Calculate percentage for pie/donut charts
   */
  static calculatePercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  /**
   * Transform flat key-value objects to array format
   */
  static transformKeyValueToArray(
    data: Record<string, any>,
    valueKey = "count"
  ): PieChartData[] {
    if (!data || typeof data !== "object") return [];

    return Object.entries(data).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: typeof value === "object" ? value[valueKey] || 0 : value || 0,
    }));
  }

  /**
   * Extract nested distribution arrays
   */
  static extractDistributionArray(
    data: any,
    distributionKey = "distribution"
  ): any[] {
    if (!data) return [];

    // Handle nested structure like { data: { distribution: [...] } }
    if (data.data && data.data[distributionKey]) {
      return data.data[distributionKey];
    }

    // Handle direct distribution array
    if (data[distributionKey] && Array.isArray(data[distributionKey])) {
      return data[distributionKey];
    }

    return [];
  }

  /**
   * Transform pie/donut chart data
   */
  static transformPieChart(rawData: any, chartId?: string): PieChartData[] {
    if (!rawData) {
      return this.getDefaultPieData(chartId);
    }

    // Handle different data structures based on chart type
    switch (chartId) {
      case "solicitation-status":
        return this.transformSolicitationStatusPie(rawData);
      case "vendors-distribution":
      case "vendors-bid-intent-status":
        return this.transformVendorsDistributionPie(rawData);
      case "sub-distribution":
        return this.transformSubscriptionDistributionPie(rawData);
      case "portal-role-distribution":
        return this.transformRoleDistributionPie(rawData);
      case "bid-intent":
        return this.transformBidIntentPie(rawData);
      default:
        return this.transformGenericPieData(rawData);
    }
  }

  /**
   * Transform line/area chart data
   */
  static transformLineChart(rawData: any, chartId?: string): LineChartData[] {
    if (!rawData || !Array.isArray(rawData)) {
      return this.getDefaultLineData(chartId);
    }

    return rawData.map((item: any) => {
      const transformedItem: LineChartData = {};

      // Handle month conversion
      if (item.month && typeof item.month === "number") {
        transformedItem.month = this.getMonthName(item.month);
      } else if (item.month) {
        transformedItem.month = item.month;
      }

      // Handle date formatting
      if (item.year && item.month) {
        const monthName =
          typeof item.month === "number"
            ? this.getMonthName(item.month)
            : item.month;
        transformedItem.date = `${monthName} ${item.year}`;
      }

      // Copy all other properties
      Object.keys(item).forEach((key) => {
        if (key !== "month" && key !== "year") {
          transformedItem[key] = item[key] || 0;
        }
      });

      return transformedItem;
    });
  }

  /**
   * Transform bar chart data
   */
  static transformBarChart(rawData: any, chartId?: string): BarChartData[] {
    if (!rawData) {
      return this.getDefaultBarData(chartId);
    }

    // Handle stacked bar charts (like company-status)
    if (chartId === "company-status" || chartId === "total-evaluation") {
      return this.transformStackedBarData(rawData);
    }

    // Handle vertical bar charts (like role-distribution)
    if (chartId === "role-distribution" || chartId === "module-usage") {
      return this.transformVerticalBarData(rawData);
    }

    // Handle array data
    if (Array.isArray(rawData)) {
      return rawData.map((item: any) => ({
        name: item.name || item.roleName || "Unknown",
        value: item.value || item.count || 0,
        ...item,
      }));
    }

    // Handle object data - transform to bar chart format
    const keyValueData = this.transformKeyValueToArray(rawData);
    return keyValueData.map((item) => ({
      name: item.name,
      value: item.value,
    })) as BarChartData[];
  }

  /**
   * Main transformation method - routes to appropriate chart transformer
   */
  static transformChart(
    chartId: string,
    rawApiData: any,
    chartType?: string
  ): RechartsData[] {
    try {
      // Determine chart type from chartId if not provided
      const inferredType = chartType || this.inferChartType(chartId);

      switch (inferredType) {
        case "pie":
        case "donut":
          return this.transformPieChart(rawApiData, chartId);
        case "line":
        case "area":
          return this.transformLineChart(rawApiData, chartId);
        case "bar":
          return this.transformBarChart(rawApiData, chartId);
        default:
          console.warn(`Unknown chart type for chartId: ${chartId}`);
          return [];
      }
    } catch (error) {
      console.error(`Error transforming chart data for ${chartId}:`, error);
      return this.getDefaultDataForChart(chartId);
    }
  }

  // Private helper methods
  private static inferChartType(chartId: string): string {
    if (
      chartId.includes("status") ||
      chartId.includes("distribution") ||
      chartId.includes("intent")
    ) {
      return chartId.includes("donut") ? "donut" : "pie";
    }
    if (chartId.includes("activities") || chartId.includes("submission")) {
      return chartId.includes("line") ? "line" : "area";
    }
    if (chartId.includes("evaluation") || chartId.includes("usage")) {
      return "bar";
    }
    return "pie"; // default
  }

  private static transformSolicitationStatusPie(data: any): PieChartData[] {
    const defaultData = [
      { name: "Draft", value: 0 },
      { name: "Active", value: 0 },
      { name: "Under Evaluation", value: 0 },
      { name: "Closed", value: 0 },
      { name: "Awarded", value: 0 },
    ];

    if (!data) return applyConsistentColors(defaultData);

    const chartData = [
      { name: "Draft", value: data.draft || 0 },
      { name: "Active", value: data.active || 0 },
      {
        name: "Under Evaluation",
        value: data.evaluating || data.underEvaluating || 0,
      },
      { name: "Closed", value: data.closed || 0 },
      { name: "Awarded", value: data.awarded || 0 },
    ];

    return applyConsistentColors(chartData);
  }

  private static transformVendorsDistributionPie(data: any): PieChartData[] {
    const defaultData = [
      { name: "Active", value: 0, percentage: 0 },
      { name: "Pending", value: 0, percentage: 0 },
      { name: "Inactive", value: 0, percentage: 0 },
    ];

    if (!data) return applyConsistentColors(defaultData);

    // Handle different API response structures
    if (data.active && typeof data.active === "object") {
      const chartData = [
        {
          name: "Active",
          value: data.active.count || 0,
          percentage: data.active.percentage || 0,
        },
        {
          name: "Pending",
          value: data.pending?.count || 0,
          percentage: data.pending?.percentage || 0,
        },
        {
          name: "Inactive",
          value: data.inactive?.count || 0,
          percentage: data.inactive?.percentage || 0,
        },
      ];
      return applyConsistentColors(chartData);
    }

    // Handle flat structure
    const total =
      (data.invited || 0) + (data.confirmed || 0) + (data.declined || 0);
    const chartData = [
      {
        name: "Invited",
        value: data.invited || 0,
        percentage: this.calculatePercentage(data.invited || 0, total),
      },
      {
        name: "Confirmed",
        value: data.confirmed || 0,
        percentage: this.calculatePercentage(data.confirmed || 0, total),
      },
      {
        name: "Declined",
        value: data.declined || 0,
        percentage: this.calculatePercentage(data.declined || 0, total),
      },
    ];

    return applyConsistentColors(chartData);
  }

  private static transformSubscriptionDistributionPie(
    data: any
  ): PieChartData[] {
    const distributionArray = this.extractDistributionArray(data);

    if (distributionArray.length === 0) {
      return applyConsistentColors([
        { name: "Basic", value: 0 },
        { name: "Pro", value: 0 },
        { name: "Enterprise", value: 0 },
      ]);
    }

    const chartData = distributionArray.map((item: any) => ({
      name: item.plan || item.name || "Unknown",
      value: item.count || item.value || 0,
    }));

    return applyConsistentColors(chartData);
  }

  private static transformRoleDistributionPie(data: any): PieChartData[] {
    if (!data || !Array.isArray(data)) {
      return applyConsistentColors([
        { name: "Admin", value: 0 },
        { name: "Procurement Lead", value: 0 },
        { name: "Vendor", value: 0 },
      ]);
    }

    const roleTitle = {
      procurement: "Procurement Lead",
      super_admin: "Super Admin",
      company_admin: "Company Admin",
      evaluator: "Evaluator",
      vendor: "Vendor",
    };

    const chartData = data.map((item: any) => ({
      name:
        roleTitle[item.roleName as keyof typeof roleTitle] ||
        item.roleName ||
        "Unknown Role",
      value: parseInt(item.count) || 0,
    }));

    return applyConsistentColors(chartData);
  }

  private static transformBidIntentPie(data: any): PieChartData[] {
    if (!data) {
      return applyConsistentColors([
        { name: "Invited", value: 0, percentage: 0 },
        { name: "Confirmed", value: 0, percentage: 0 },
        { name: "Declined", value: 0, percentage: 0 },
      ]);
    }

    const total =
      (data.invited || 0) + (data.confirmed || 0) + (data.declined || 0);
    const chartData = [
      {
        name: "Invited",
        value: data.invited || 0,
        percentage: this.calculatePercentage(data.invited || 0, total),
      },
      {
        name: "Confirmed",
        value: data.confirmed || 0,
        percentage: this.calculatePercentage(data.confirmed || 0, total),
      },
      {
        name: "Declined",
        value: data.declined || 0,
        percentage: this.calculatePercentage(data.declined || 0, total),
      },
    ];

    return applyConsistentColors(chartData);
  }

  private static transformGenericPieData(data: any): PieChartData[] {
    if (Array.isArray(data)) {
      return applyConsistentColors(
        data.map((item: any) => ({
          name: item.name || item.label || "Unknown",
          value: item.value || item.count || 0,
          percentage: item.percentage,
        }))
      );
    }

    return applyConsistentColors(this.transformKeyValueToArray(data));
  }

  private static transformStackedBarData(data: any): BarChartData[] {
    // Handle company status with timeStats
    if (data && data[0] && data[0].timeStats) {
      const timeStats = data[0].timeStats;
      return timeStats.map((item: any, index: number) => {
        const month = item.label || this.getMonthName((index % 12) + 1);
        const total = item.total || 0;
        const active = item.active || 0;
        const expiring = item.expiring || 0;
        const suspended = Math.max(0, total - active - expiring);

        return {
          month,
          active,
          suspended,
          pending: expiring,
        };
      });
    }

    // Handle array data with month/time information
    if (Array.isArray(data)) {
      return data.map((item: any) => {
        const result: BarChartData = {};

        if (item.month) {
          result.month =
            typeof item.month === "number"
              ? this.getMonthName(item.month)
              : item.month;
        }

        Object.keys(item).forEach((key) => {
          if (key !== "month") {
            result[key] = item[key] || 0;
          }
        });

        return result;
      });
    }

    return [];
  }

  private static transformVerticalBarData(data: any): BarChartData[] {
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        name: item.name || item.roleName || "Unknown",
        value: item.value || item.count || 0,
      }));
    }

    // Handle module usage type data
    if (data && typeof data === "object") {
      return [
        { name: "Solicitation", value: data.solicitationUsage || 0 },
        { name: "Evaluation", value: data.evaluationUsage || 0 },
        { name: "Vendor", value: data.vendorUage || 0 }, // Keep original typo from API
        { name: "Addendum", value: data.adendumUsage || 0 },
      ];
    }

    return [];
  }

  private static getDefaultPieData(chartId?: string): PieChartData[] {
    const defaults: Record<string, PieChartData[]> = {
      "solicitation-status": [
        { name: "Draft", value: 0 },
        { name: "Active", value: 0 },
        { name: "Under Evaluation", value: 0 },
        { name: "Closed", value: 0 },
      ],
      "vendors-distribution": [
        { name: "Active", value: 0 },
        { name: "Pending", value: 0 },
        { name: "Inactive", value: 0 },
      ],
      default: [
        { name: "Category A", value: 0 },
        { name: "Category B", value: 0 },
        { name: "Category C", value: 0 },
      ],
    };

    return applyConsistentColors(
      defaults[chartId || "default"] || defaults.default
    );
  }

  private static getDefaultLineData(chartId?: string): LineChartData[] {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (chartId === "proposal-submission") {
      return months.slice(0, 6).map((month) => ({
        month,
        submitted: 0,
        declined: 0,
        missedDeadline: 0,
      }));
    }

    return months.slice(0, 7).map((month) => ({
      month,
      activities: 0,
    }));
  }

  private static getDefaultBarData(chartId?: string): BarChartData[] {
    if (chartId === "company-status") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.map((month) => ({
        month,
        active: 0,
        suspended: 0,
        pending: 0,
      }));
    }

    return [
      { name: "Category A", value: 0 },
      { name: "Category B", value: 0 },
      { name: "Category C", value: 0 },
    ];
  }

  private static getDefaultDataForChart(chartId: string): RechartsData[] {
    if (chartId.includes("status") || chartId.includes("distribution")) {
      return this.getDefaultPieData(chartId);
    }
    if (chartId.includes("activities") || chartId.includes("submission")) {
      return this.getDefaultLineData(chartId);
    }
    if (chartId.includes("evaluation") || chartId.includes("usage")) {
      return this.getDefaultBarData(chartId);
    }
    return this.getDefaultPieData(chartId);
  }
}

/**
 * Transforms API data into dashboard configuration format
 * This ensures compatibility with existing UI components
 */
export class DashboardDataTransformer {
  /**
   * Transform chart data using the new unified transformer
   * @param chartId - Chart identifier
   * @param rawData - Raw API data
   * @param chartType - Optional chart type override
   * @returns Recharts-compatible data
   */
  static transformChartData(
    chartId: string,
    rawData: any,
    chartType?: string
  ): RechartsData[] {
    return ChartDataTransformer.transformChart(chartId, rawData, chartType);
  }

  /**
   * Transform SuperAdmin dashboard count data into stats cards
   */
  static transformSuperAdminStats(
    data: SuperAdminDashboardCount | undefined
  ): DashboardConfig["stats"] {
    const stats = data?.company;
    const userStats = data?.users;

    if (typeof stats === "undefined") {
      // Return default/loading state
      return [
        {
          title: "All Companies",
          value: 0,
          icon: "building-clock",
          color: "text-gray-800",
          bgColor: "bg-gray-500/20",
        },
        {
          title: "Active Companies",
          value: 0,
          icon: "building-clock",
          color: "text-green-800",
          bgColor: "bg-green-500/20",
        },
        {
          title: "Suspended Companies",
          value: 0,
          icon: "building-clock",
          color: "text-red-800",
          bgColor: "bg-red-500/30",
        },
        {
          title: "All Admins",
          value: 0,
          icon: "users",
          color: "text-gray-800",
          bgColor: "bg-gray-500/30",
        },
        {
          title: "Super Admins",
          value: 0,
          icon: "user",
          color: "text-gray-800",
          bgColor: "bg-gray-500/30",
        },
        {
          title: "Organisation Admins",
          value: 0,
          icon: "user",
          color: "text-gray-800",
          bgColor: "bg-gray-500/30",
        },
      ];
    }

    return [
      {
        title: "All Companies",
        value: stats.allCompanies,
        icon: "building-clock",
        color: "text-gray-800",
        bgColor: "bg-gray-500/20",
      },
      {
        title: "Active Companies",
        value: stats.activeCompanies || 0,
        icon: "building-clock",
        color: "text-green-800",
        bgColor: "bg-green-500/20",
      },
      {
        title: "Suspended Companies",
        value: stats.suspendedCompanies || 0,
        icon: "building-clock",
        color: "text-red-800",
        bgColor: "bg-red-500/30",
      },
      {
        title: "All Admins",
        value: (userStats?.super_admin ?? 0) + (userStats?.company_admin ?? 0),
        icon: "users",
        color: "text-gray-800",
        bgColor: "bg-gray-500/30",
      },
      {
        title: "Super Admins",
        value: userStats?.super_admin || 0,
        icon: "user",
        color: "text-gray-800",
        bgColor: "bg-gray-500/30",
      },
      {
        title: "Organisation Admins",
        value: userStats?.company_admin || 0,
        icon: "user",
        color: "text-gray-800",
        bgColor: "bg-gray-500/30",
      },
    ];
  }

  /**
   * Transform weekly activities data for area chart
   */
  static transformWeeklyActivities(data: WeeklyActivities | undefined) {
    if (!data || (!data.solicitations && !data.evaluations)) {
      // Return default data structure
      return Array.from({ length: 7 }, (_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        activities: 0,
      }));
    }

    // Transform API data to chart format
    // Combine solicitations and evaluations data
    const totalActivities =
      (data.solicitations?.length || 0) + (data.evaluations?.length || 0);

    // For now, distribute activities across the week
    // This can be enhanced based on actual date data from the API
    return Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      activities:
        Math.floor(totalActivities / 7) + (i < totalActivities % 7 ? 1 : 0),
    }));
  }

  /**
   * Transform subscription distribution data for donut chart
   */
  static transformSubDistribution(data: SubDistribution | undefined) {
    if (
      !data ||
      !data.distribution ||
      !Array.isArray(data.distribution) ||
      data.distribution.length === 0
    ) {
      return applyConsistentColors([
        { name: "Basic", value: 0 },
        { name: "Pro", value: 0 },
        { name: "Enterprise", value: 0 },
      ]);
    }

    const chartData = data.distribution.map((item) => ({
      name: item.plan,
      value: item.count,
    }));

    return applyConsistentColors(chartData);
  }

  /**
   * Transform company status data for bar chart
   */
  static transformCompanyStatus(data: any) {
    // Handle new API structure: data is an array with timeStats inside
    const timeStats = data?.[0]?.timeStats;

    if (!timeStats || !Array.isArray(timeStats) || timeStats.length === 0) {
      return Array.from({ length: 12 }, (_, i) => ({
        month: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][i],
        active: 0,
        suspended: 0,
        pending: 0,
      }));
    }

    return timeStats.map((item: any, index: number) => {
      // Use the label from API or fallback to month names
      const month =
        item.label ||
        [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][index % 12];

      // Calculate suspended and pending from actual API data
      const total = item.total || 0;
      const active = item.active || 0;
      const expiring = item.expiring || 0;

      // Calculate suspended as total minus active minus expiring
      const suspended = Math.max(0, total - active - expiring);

      return {
        month,
        active,
        suspended,
        pending: expiring, // Use expiring as pending since they represent similar concepts
      };
    });
  }

  /**
   * Transform role distribution data for pie chart
   */
  static transformRoleDistribution(data: RoleDistribution[] | undefined) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return applyConsistentColors([
        { name: "Admin", value: 0 },
        { name: "Procurement Lead", value: 0 },
        { name: "Vendor", value: 0 },
      ]);
    }

    const roleTitle = {
      procurement: "Procurement Lead",
      super_admin: "Super Admin",
      company_admin: "Company Admin",
      evaluator: "Evaluator",
      vendor: "Vendor",
    };

    const chartData = data.map((item) => ({
      name:
        roleTitle[item.roleName as keyof typeof roleTitle] || "Unknown Role",
      value: parseInt(item.count) || 0,
    }));

    return applyConsistentColors(chartData);
  }

  /**
   * Calculate total active subscriptions for center text
   */
  static calculateTotalSubscriptions(
    data: SubDistribution | undefined
  ): number {
    if (!data) return 0;
    return data.totalActive || 0;
  }

  /**
   * Transform module usage data for pie chart
   */
  static transformModuleUsage(data: any) {
    // console.log({ data });
    if (!data) {
      return [
        { name: "Solicitation", value: 0 },
        { name: "Evaluation", value: 0 },
        { name: "Vendor", value: 0 },
        { name: "Addendum", value: 0 },
      ];
    }

    // Use raw values directly as indicators, not percentages
    return [
      {
        name: "Solicitation",
        value: data.solicitationUsage || 0,
      },
      {
        name: "Evaluation",
        value: data.evaluationUsage || 0,
      },
      {
        name: "Vendor",
        value: data.vendorUage || 0, // Keep original typo from API
      },
      {
        name: "Addendum",
        value: data.adendumUsage || 0,
      },
    ];
  }

  /**
   * Transform Company Admin solicitation status data into stats cards
   */
  static transformSolicitationStatus(data: any): DashboardConfig["stats"] {
    if (!data) {
      return [
        {
          title: "Total Solicitations",
          value: 0,
          icon: "file-text",
          color: "text-blue-800",
          bgColor: "bg-blue-500/20",
        },
        {
          title: "Active Solicitations",
          value: 0,
          icon: "activity",
          color: "text-green-800",
          bgColor: "bg-green-500/20",
        },
        {
          title: "Awarded Solicitations",
          value: 0,
          icon: "award",
          color: "text-yellow-800",
          bgColor: "bg-yellow-500/20",
        },
        {
          title: "Closed Solicitations",
          value: 0,
          icon: "x-circle",
          color: "text-red-800",
          bgColor: "bg-red-500/20",
        },
      ];
    }

    return [
      {
        title: "Total Solicitations",
        value: data.total || 0,
        icon: "file-text",
        color: "text-blue-800",
        bgColor: "bg-blue-500/20",
      },
      {
        title: "Active Solicitations",
        value: data.active || 0,
        icon: "activity",
        color: "text-green-800",
        bgColor: "bg-green-500/20",
      },
      {
        title: "Awarded Solicitations",
        value: data.awarded || 0,
        icon: "award",
        color: "text-yellow-800",
        bgColor: "bg-yellow-500/20",
      },
      {
        title: "Closed Solicitations",
        value: data.closed || 0,
        icon: "x-circle",
        color: "text-red-800",
        bgColor: "bg-red-500/20",
      },
    ];
  }

  /**
   * Transform Company Admin bid intent data
   */
  static transformBidIntent(data: any) {
    if (!data) {
      return applyConsistentColors([
        { name: "Invited", value: 0, percentage: 0 },
        { name: "Confirmed", value: 0, percentage: 0 },
        { name: "Declined", value: 0, percentage: 0 },
      ]);
    }

    const total =
      (data.invited || 0) + (data.confirmed || 0) + (data.declined || 0);

    const chartData = [
      {
        name: "Invited",
        value: data.invited || 0,
        percentage: total > 0 ? Math.round((data.invited / total) * 100) : 0,
      },
      {
        name: "Confirmed",
        value: data.confirmed || 0,
        percentage: total > 0 ? Math.round((data.confirmed / total) * 100) : 0,
      },
      {
        name: "Declined",
        value: data.declined || 0,
        percentage: total > 0 ? Math.round((data.declined / total) * 100) : 0,
      },
    ];

    return applyConsistentColors(chartData);
  }

  /**
   * Transform Company Admin vendors distribution data
   */
  static transformVendorsDistribution(data: any) {
    if (!data) {
      return applyConsistentColors([
        { name: "Active", value: 0, percentage: 0 },
        { name: "Pending", value: 0, percentage: 0 },
        { name: "Inactive", value: 0, percentage: 0 },
      ]);
    }

    const chartData = [
      {
        name: "Active",
        value: data.active?.percentage || 0,
        percentage: data?.active?.percentage ?? 0,
      },
      {
        name: "Pending",
        value: data.pending?.percentage || 0,
        percentage: data?.pending?.percentage ?? 0,
      },
      {
        name: "Inactive",
        value: data.inactive?.percentage || 0,
        percentage: data?.inactive?.percentage ?? 0,
      },
    ];

    return applyConsistentColors(chartData);
  }

  /**
   * Transform Company Admin proposal submission data
   */
  static transformProposalSubmission(data: any) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((item: any) => {
      // Create month-year label for x-axis
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthLabel = monthNames[item.month - 1] || "Unknown";
      const dateLabel = `${monthLabel} ${item.year}`;

      return {
        date: dateLabel,
        submitted: item.submitted || 0,
        missedDeadline: item.missedDeadline || 0,
        declined: item.declined || 0,
        // Keep backward compatibility
        count:
          (item.submitted || 0) +
          (item.missedDeadline || 0) +
          (item.declined || 0),
        ...item,
      };
    });
  }

  /**
   * Transform Procurement dashboard stats
   */
  static transformProcurementStats(data: any): DashboardConfig["stats"] {
    if (!data) {
      return [
        {
          title: "All Solicitations",
          value: 0,
          icon: "file-text",
          color: "text-blue-800",
          bgColor: "bg-blue-500/20",
        },
        {
          title: "Active Solicitations",
          value: 0,
          icon: "activity",
          color: "text-green-800",
          bgColor: "bg-green-500/20",
        },
        {
          title: "Pending Evaluations",
          value: 0,
          icon: "clock",
          color: "text-yellow-800",
          bgColor: "bg-yellow-500/20",
        },
        {
          title: "Awarded",
          value: 0,
          icon: "award",
          color: "text-purple-800",
          bgColor: "bg-purple-500/20",
        },
      ];
    }

    return [
      {
        title: "All Solicitations",
        value: data.total || 0,
        icon: "file-text",
        color: "text-blue-800",
        bgColor: "bg-blue-500/20",
      },
      {
        title: "Active Solicitations",
        value: data.Active || 0,
        icon: "activity",
        color: "text-green-800",
        bgColor: "bg-green-500/20",
      },
      {
        title: "Pending Evaluations",
        value: data.underEvaluating || 0,
        icon: "clock",
        color: "text-yellow-800",
        bgColor: "bg-yellow-500/20",
      },
      {
        title: "Awarded",
        value: data.awarded || 0,
        icon: "award",
        color: "text-purple-800",
        bgColor: "bg-purple-500/20",
      },
    ];
  }

  /**
   * Transform Company Admin role distribution data
   */
  static transformCompanyRoleDistribution(data: any) {
    if (!data || !Array.isArray(data)) {
      return [
        { name: "Admin", value: 0, percentage: 0 },
        { name: "User", value: 0, percentage: 0 },
        { name: "Viewer", value: 0, percentage: 0 },
      ];
    }

    const total = data.reduce(
      (sum: number, item: any) => sum + (item.count || 0),
      0
    );

    return data.map((item: any) => ({
      name: item.roleName || "Unknown",
      value: item.count || 0,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }));
  }

  /**
   * Transform Procurement Solicitation Status data for pie chart
   */
  static transformProcurementSolicitationStatus(data: any) {
    if (!data) {
      return applyConsistentColors([
        { name: "Active", value: 0 },
        { name: "Under Evaluation", value: 0 },
        { name: "Closed", value: 0 },
        { name: "Draft", value: 0 },
        { name: "Awarded", value: 0 },
      ]);
    }

    const chartData = [
      { name: "Active", value: data.active || 0 },
      { name: "Under Evaluation", value: data.evaluating || 0 },
      { name: "Closed", value: data.closed || 0 },
      { name: "Draft", value: data.draft || 0 },
      { name: "Awarded", value: data.awarded || 0 },
    ];

    return applyConsistentColors(chartData);
  }

  /**
   * Transform Procurement Bid Intent data for donut chart
   */
  static transformProcurementBidIntent(data: any) {
    if (!data) {
      return applyConsistentColors([
        { name: "Confirmed", value: 0, percentage: 0 },
        { name: "Declined", value: 0, percentage: 0 },
        { name: "Invited", value: 0, percentage: 0 },
      ]);
    }

    const total =
      (data.confirmed || 0) + (data.declined || 0) + (data.invited || 0);

    const chartData = [
      {
        name: "Confirmed",
        value: data.confirmed || 0,
        percentage: total > 0 ? Math.round((data.confirmed / total) * 100) : 0,
      },
      {
        name: "Declined",
        value: data.declined || 0,
        percentage: total > 0 ? Math.round((data.declined / total) * 100) : 0,
      },
      {
        name: "Invited",
        value: data.invited || 0,
        percentage: total > 0 ? Math.round((data.invited / total) * 100) : 0,
      },
    ];

    return applyConsistentColors(chartData);
  }

  /**
   * Transform Procurement Vendors Distribution data for donut chart
   */
  static transformProcurementVendorsDistribution(
    data?: VendorsDistributionData
  ) {
    if (!data) {
      return applyConsistentColors([
        { name: "Active", value: 0, percentage: 0 },
        { name: "Inactive", value: 0, percentage: 0 },
        { name: "Pending", value: 0, percentage: 0 },
      ]);
    }

    const chartData = [
      {
        name: "Active",
        value: data.active.count || 0,
        percentage: data.active.percentage || 0,
      },
      {
        name: "Inactive",
        value: data.inactive.count || 0,
        percentage: data.inactive.percentage || 0,
      },
      {
        name: "Pending",
        value: data.pending.count || 0,
        percentage: data.pending.percentage || 0,
      },
    ];

    return applyConsistentColors(chartData);
  }

  /**
   * Transform Procurement Weekly Activities data for area chart
   */
  static transformProcurementWeeklyActivities(data: any) {
    if (!data || !data.solicitations || !data.evaluations) {
      return Array.from({ length: 7 }, (_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        solicitations: 0,
        evaluations: 0,
      }));
    }

    // Create a map for easy lookup
    const solicitationsMap = new Map();
    const evaluationsMap = new Map();

    data.solicitations.forEach((item: any) => {
      solicitationsMap.set(item.label, item.value);
    });

    data.evaluations.forEach((item: any) => {
      evaluationsMap.set(item.label, item.value);
    });

    // Generate the combined data
    return data.solicitations.map((item: any) => ({
      day: item.label,
      solicitations: item.value || 0,
      evaluations: evaluationsMap.get(item.label) || 0,
    }));
  }

  /**
   * Transform Procurement Proposal Submission data for line chart
   */
  static transformProcurementProposalSubmission(data: any) {
    if (!data || !Array.isArray(data)) {
      return Array.from({ length: 7 }, (_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        submitted: 0,
        missedDeadline: 0,
        declined: 0,
      }));
    }

    return data.map((item: any) => {
      // Create month-year label for x-axis
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthLabel = monthNames[item.month - 1] || "Unknown";
      const dateLabel = `${monthLabel} ${item.year}`;

      return {
        day: dateLabel,
        submitted: item.submitted || 0,
        missedDeadline: item.missedDeadline || 0,
        declined: item.declined || 0,
        // Keep backward compatibility
        submissions: item.submitted || 0,
        evaluations: item.missedDeadline || 0,
      };
    });
  }

  /**
   * Transform Procurement Total Evaluations data for bar chart
   */
  static transformProcurementTotalEvaluations(data: any) {
    if (!data || !Array.isArray(data)) {
      return Array.from({ length: 12 }, (_, i) => ({
        month: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][i],
        onTime: 0,
        late: 0,
        pending: 0,
        completed: 0,
      }));
    }

    return data.map((item: any) => ({
      month: item.label || item.month || "Unknown",
      onTime: item.onTime || 0,
      late: item.late || 0,
      pending: item.pending || 0,
      completed: item.completed || 0,
    }));
  }

  /**
   * Transform Evaluator dashboard data into stats cards
   */
  static transformEvaluatorStats(
    data: EvaluatorDashboardData | undefined
  ): DashboardConfig["stats"] {
    if (!data) {
      // Return default/loading state
      return [
        {
          title: "All Evaluations",
          value: 0,
          icon: "file",
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
        },
        {
          title: "Active Evaluations",
          value: 0,
          icon: "file",
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        },
        {
          title: "Pending Evaluations",
          value: 0,
          icon: "file",
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        },
        {
          title: "Completed Evaluations",
          value: 0,
          icon: "file",
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        },
      ];
    }

    return [
      {
        title: "All Evaluations",
        value: data.total || 0,
        icon: "file",
        color: "text-gray-500",
        bgColor: "bg-gray-500/10",
      },
      {
        title: "Active Evaluations",
        value: data.Active || 0,
        icon: "file",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        title: "Pending Evaluations",
        value: data.Pending || 0,
        icon: "file",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      },
      {
        title: "Completed Evaluations",
        value: data.Completed || 0,
        icon: "file",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
    ];
  }

  /**
   * Transform Evaluator My Actions data for activity component
   */
  static transformEvaluatorMyActions(data: EvaluatorMyActions | undefined) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const getFormattedText = (
      statusText: string,
      data: { id: string; name: string }
    ) => {
      const actions = applyDynamicStatusTextReplacement(
        statusText,
        'evaluator',
        'myActions',
        data
      )

      return actions;
    };

    return data.map((action: any, index: number) => ({
      id: action?.evaluation._id || `action-${index}`,
      title: action?.evaluation.solicitation?.name,
      text: getFormattedText(action.statusText, {
        id: action?.evaluation?._id,
        name: action?.evaluation?.solicitation?.name,
      }),
      type: action.type || "unknown",
      date:
        action.date || action.createdAt
          ? format(
              new Date(action.date || action.createdAt),
              "MMM d, yyyy h:mm a 'GMT'xxx"
            )
          : format(new Date(), "MMM d, yyyy h:mm a 'GMT'xxx"),
    }));
  }

  /**
   * Transform Evaluator Evaluation Updates data for activity component
   */
  static transformEvaluatorEvaluationUpdates(
    data: EvaluatorEvaluationActivity | undefined
  ) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((update: any, index: number) => ({
      id: update?.evaluation._id || `update-${index}`,
      title: update?.evaluation.solicitation.name,
      text: applyDynamicStatusTextReplacement(
        update.statusText,
        'evaluator',
        'general',
        {
          id: update?.evaluation?._id,
          name: update?.evaluation?.solicitation?.name,
        }
      ),
      type: update.type || "evaluation",
      date:
        update.date || update.updatedAt || update.createdAt
          ? format(
              new Date(update.date || update.updatedAt || update.createdAt),
              "MMM d, yyyy h:mm a 'GMT'xxx"
            )
          : format(new Date(), "MMM d, yyyy h:mm a 'GMT'xxx"),
    }));
  }

  /**
   * Transform Vendor dashboard data into stats cards
   */
  static transformVendorStats(data: any | undefined): DashboardConfig["stats"] {
    if (!data) {
      // Return default/loading state
      return [
        {
          title: "All Invitations",
          value: 0,
          icon: "folder-open",
          color: "text-gray-500",
          bgColor: "bg-gray-500/20",
        },
        {
          title: "Confirmed Invitations",
          value: 0,
          icon: "folder-open",
          color: "text-green-600",
          bgColor: "bg-green-500/20",
        },
        {
          title: "Declined Invitations",
          value: 0,
          icon: "folder-open",
          color: "text-red-500",
          bgColor: "bg-red-500/20",
        },
        {
          title: "Pending Invitations",
          value: 0,
          icon: "folder-open",
          color: "!text-yellow-500",
          bgColor: "bg-yellow-500/20",
        },
      ];
    }

    // Transform API data into stats format
    // const statsMap = data.reduce((acc: any, item: any) => {
    //   acc[item.status] = item.count || 0;
    //   return acc;
    // }, {});

    return [
      {
        title: "All Invitations",
        value: data.all,
        icon: "folder-open",
        color: "text-gray-500",
        bgColor: "bg-gray-500/20",
      },
      {
        title: "Confirmed Invitations",
        value: data?.active || 0,
        icon: "folder-open",
        color: "text-green-600",
        bgColor: "bg-green-500/20",
      },
      {
        title: "Declined Invitations",
        value: data.declined || 0,
        icon: "folder-open",
        color: "text-red-500",
        bgColor: "bg-red-500/20",
      },
      {
        title: "Pending Invitations",
        value: data.pending || 0,
        icon: "folder-open",
        color: "!text-yellow-500",
        bgColor: "bg-yellow-500/20",
      },
    ];
  }

  /**
   * Transform Vendor My Actions data for activity component
   * Based on VendorAction schema: array of objects with action and solicitation properties
   */
  static transformVendorMyActions(data: VendorMyActions[] | undefined) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const getFormattedText = (
      statusText: string,
      data: { id: string; name: string }
    ) => {
      return applyDynamicStatusTextReplacement(
        statusText,
        'vendor',
        'myActions',
        data
      );
    };

    return data.map((action, index) => {
      return {
        id: action._id || `vendor-action-${index}`,
        text: getFormattedText(action.statusText, {
          id: action.solicitation._id,
          name: action.solicitation.name,
        }),
        date: action.createdAt
          ? format(new Date(action.createdAt), "MMM d, yyyy h:mm a")
          : null,
        title: action.solicitation || "Unknown Solicitation",
      };
    });
  }

  /**
   * Transform Vendor General Updates data for activity component
   */
  static transformVendorGeneralUpdates(data: any | undefined) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((update: any, index: number) => ({
      id: update.id || `vendor-update-${index}`,
      text: applyDynamicStatusTextReplacement(
        update.statusText,
        'vendor',
        'general',
        {
          id: update.solicitation._id,
          name: update.solicitation.name,
        }
      ),
      title: update.solicitation.name,
      time:
        update.time ||
        (update.date
          ? format(new Date(update.date), "MMM d, yyyy") +
            " • " +
            format(new Date(update.date), "HH:mm 'GMT'xxx")
          : format(new Date(), "MMM d, yyyy") +
            " • " +
            format(new Date(), "h:mm a 'GMT'xxx")),
    }));
  }

  /**
   * Transform Procurement My Actions data for activity component
   */
  static transformProcurementMyActions(data: any[] | undefined) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const getFormattedText = (
      statusText: string,
      data: { id: string; name: string }
    ) => {
      return applyDynamicStatusTextReplacement(
        statusText,
        'procurement',
        'myActions',
        data
      );
    };

    return data.map((action: any, index: number) => ({
      id: action.solicitation._id || `action-${index}`,
      text: getFormattedText(action.statusText, {
        id: action.solicitation._id || action.evaluation._id,
        name: action.solicitation.name || action.evaluation.name,
      }),
      type: action?.replace?.("_", " ") || "",
      title: action.solicitation.name,
      date:
        action.createdAt || action.date
          ? format(
              new Date(action.createdAt || action.date),
              "MMM d, yyyy h:mm a 'GMT'xxx"
            )
          : format(new Date(), "MMM d, yyyy h:mm a 'GMT'xxx"),
      status: action.status || "active",
    }));
  }

  /**
   * Transform Procurement General Updates data for activity component
   */
  static transformProcurementGeneralUpdates(data: any[] | undefined) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((update: any, index: number) => ({
      id: update._id || update.id || `update-${index}`,
      title: update.solicitation.name,
      text: applyDynamicStatusTextReplacement(
        update.statusText,
        'procurement',
        'general',
        {
          id: update.solicitation._id || update.evaluation._id,
          name: update.solicitation.name || update.evaluation.name,
        }
      ),
      date:
        update.updatedAt || update.date || update.createdAt
          ? `${format(
              new Date(update.updatedAt || update.date || update.createdAt),
              "MMM d, yyyy h:mm a"
            )} ${update.timezone || "GMT"}`
          : format(new Date(), "MMM d, yyyy h:mm a 'GMT'xxx"),
      status: update.status || "active",
    }));
  }

  /**
   * Transform Company Admin General Updates data for activity component
   * Based on VendorUpdate schema: array of objects with action, createdAt, and solicitation properties
   */
  static transformCompanyAdminGeneralUpdates(data: any[] | undefined) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const actionDescriptions = {
      vendor_invitation: "A vendor has been invited to bid on",
      vendor_accept: "A vendor has accepted to bid on",
      vendor_reminder: "Reminder sent to vendor for",
      vendor_feedback: "Feedback received on",
      evaluation: "Evaluation has been updated for",
      update: "Update received for",
      vendor_declined: "A vendor declined to bid on",
      vendor_submitted: "A vendor submitted proposal for",
      proposal_submitted: "A proposal was submitted for",
      proposal_draft: "A proposal draft was created for",
      proposal_updated: "A proposal was updated for",
      scored: "A score was submitted for",
      awarded: "Contract was awarded for",
      question: "A question was received for",
      response: "A response was received for",
      invite: "An invitation was sent for",
      addendum: "An addendum was published for",
      created: "A new solicitation was created",
      solicitation_published: "Solicitation was published",
      evaluation_started: "Evaluation process started for",
      evaluation_completed: "Evaluation process completed for",
    };

    return data.map((update: any, index: number) => ({
      id: update._id || update.id || `admin-update-${index}`,
      title: update.solicitation?.name || "Unknown Solicitation",
      action:
        actionDescriptions[update.action as keyof typeof actionDescriptions] ||
        update.action ||
        "Recent activity",
      time: update.createdAt
        ? format(new Date(update.createdAt), "MMM d, yyyy") +
          " • " +
          format(new Date(update.createdAt), "h:mm a 'GMT'xxx")
        : format(new Date(), "MMM d, yyyy") +
          " • " +
          format(new Date(), "h:mm a 'GMT'xxx"),
      status: update.solicitation?.status || "active",
      timezone: update.solicitation?.timezone || "UTC",
    }));
  }

  /**
   * Transform Solicitation Status data for chart
   */
  static transformSolicitationStatusChart(data: any) {
    if (!data) {
      return applyConsistentColors([
        { name: "Active", value: 0 },
        { name: "Draft", value: 0 },
        { name: "Closed", value: 0 },
        { name: "Awarded", value: 0 },
      ]);
    }

    const chartData = [
      { name: "Active", value: data.active || 0 },
      { name: "Draft", value: data.draft || 0 },
      { name: "Closed", value: data.closed || 0 },
      { name: "Awarded", value: data.awarded || 0 },
    ];

    return applyConsistentColors(chartData);
  }

  /**
   * Transform Bid Intent data for chart
   */
  static transformBidIntentChart(data: any) {
    if (!data) {
      return applyConsistentColors([
        { name: "Confirmed", value: 0 },
        { name: "Declined", value: 0 },
        { name: "Invited", value: 0 },
      ]);
    }

    const total =
      (data.confirmed || 0) + (data.declined || 0) + (data.invited || 0);

    const chartData = [
      {
        name: "Confirmed",
        value: data.confirmed || 0,
        percentage: total > 0 ? Math.round((data.confirmed / total) * 100) : 0,
      },
      {
        name: "Declined",
        value: data.declined || 0,
        percentage: total > 0 ? Math.round((data.declined / total) * 100) : 0,
      },
      {
        name: "Invited",
        value: data.invited || 0,
        percentage: total > 0 ? Math.round((data.invited / total) * 100) : 0,
      },
    ];

    return applyConsistentColors(chartData);
  }

  /**
   * Transform Total Evaluations data for chart
   */
  static transformTotalEvaluations(data: any) {
    if (!data || !Array.isArray(data)) {
      return Array.from({ length: 12 }, (_, i) => ({
        month: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][i],
        evaluations: 0,
        completed: 0,
        pending: 0,
      }));
    }

    return data.map((item: any) => ({
      month: item.label || item.month || "Unknown",
      evaluations: item.total || item.evaluations || 0,
      completed: item.completed || 0,
      pending: item.pending || 0,
    }));
  }
}
