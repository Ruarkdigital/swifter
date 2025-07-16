import { UserRole } from "../types";
import { faker } from "@faker-js/faker";
import { applyConsistentColors } from "@/lib/chartColorUtils";
// import { format } from "date-fns";

// Dashboard configuration for different roles
export interface DashboardConfig {
  stats: {
    title: string;
    value: number;
    icon: string;
    color: string;
    bgColor: string;
  }[];
  rows: {
    type: "chart" | "activity" | "mixed";
    className?: string;
    properties: {
      cy?: string;
      cx?: string;
      id?: string;
      title?: string;
      type?: "pie" | "line" | "bar" | "donut" | "area";
      data?: any[];
      visible?: boolean;
      filters?: string[];
      items?: any[];
      to?: string;
      innerRadius?: number;
      outerRadius?: number;
      className?: string;
      stacked?: boolean; // Whether to stack bars in a bar chart
      layout?: "horizontal" | "vertical"; // Bar chart layout orientation
      showLegend?: boolean; // Whether to show legend
      centerText?: {
        value: string | number;
        label: string;
      };
      // Dynamic styling properties
      colors?: { [key: string]: string }; // Custom colors for data keys
      fillColors?: { [key: string]: string }; // Custom fill colors for area charts
      strokeWidth?: number; // Line/area stroke width
      dotRadius?: number; // Dot radius for line/area charts
      activeDotRadius?: number; // Active dot radius for line/area charts
      fillOpacity?: number; // Fill opacity for area charts
      barSize?: number; // Bar size for bar charts
      barClassName?: string; // Bar CSS class
      barRadius?: [number, number, number, number]; // Bar border radius [topLeft, topRight, bottomRight, bottomLeft]
      gridVertical?: boolean; // Show vertical grid lines
      legendPosition?: {
        vertical?: "top" | "middle" | "bottom";
        horizontal?: "left" | "center" | "right";
      };
      legendLayout?: "horizontal" | "vertical";
      legendIconType?: "line" | "rect" | "circle" | "cross" | "diamond" | "square" | "star" | "triangle" | "wye";
      lineType?: "basis" | "basisClosed" | "basisOpen" | "linear" | "linearClosed" | "natural" | "monotoneX" | "monotoneY" | "monotone" | "step" | "stepBefore" | "stepAfter";
      strokeDasharray?: { [key: string]: string }; // Custom dash patterns for lines
      defaultFill?: string; // Default fill color for pie charts
      labelLine?: boolean; // Show label lines for pie charts
      startAngle?: number; // Start angle for pie charts
      endAngle?: number; // End angle for pie charts
    }[];
  }[];
}

// Evaluator Dashboard Configuration
const evaluatorConfig: DashboardConfig = {
  stats: [
    {
      title: "All Evaluations",
      value: 52,
      icon: "file",
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
    },
    {
      title: "Active Evaluations",
      value: 22,
      icon: "file",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pending Evaluations",
      value: 20,
      icon: "file",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Completed Evaluations",
      value: 10,
      icon: "file",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ],
  rows: [
    {
      type: "activity",
      properties: [
        {
          id: "my-actions",
          title: "My Actions",
          items: Array.from({ length: 5 }, () => ({
            id: faker.string.uuid(),
            action: "System maintenance completed",
            type: "system",
            date: faker.date.recent({ days: 7 }).toLocaleDateString(),
          })),
        },
        {
          id: "evaluation-updates",
          title: "Evaluation Update",
          items: Array.from({ length: 5 }, () => ({
            id: faker.string.uuid(),
            action: "System maintenance completed",
            type: "system",
            date: faker.date.recent({ days: 7 }).toLocaleDateString(),
          })),
        },
      ],
    },
    
  ],
};

// Vendor Dashboard Configuration
const vendorConfig: DashboardConfig = {
  stats: [
    {
      title: "All Invitations",
      value: 52,
      icon: "folder-open",
      color: "text-gray-500",
      bgColor: "bg-gray-500/20",
    },
    {
      title: "Confirmed Invitations",
      value: 11,
      icon: "folder-open",
      color: "text-green-600",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Declined Invitations",
      value: 4,
      icon: "folder-open",
      color: "text-red-500",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Pending Invitations",
      value: 4,
      icon: "folder-open",
      color: "!text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
  ],
  rows: [
    {
      type: "activity",
      properties: [
        {
          id: "my-actions",
          title: "My Actions",
          items: Array.from({ length: 4 }, () => ({
            id: faker.string.uuid(),
            action:
              "You've been invited to bid on IT Infrastructure Upgrade Project",
            status: "Pending",
            type: "Invitation",
            date: faker.date.recent({ days: 7 }).toLocaleDateString(),
          })),
        },
        {
          id: "general-updates",
          title: "General Updates",
          items: Array.from({ length: 4 }, () => ({
            id: faker.string.uuid(),
            title:
              "Your proposal was submitted for IT Infrastructure Upgrade Project",
            time:
              faker.date.recent({ days: 3 }).toLocaleDateString() +
              " • " +
              faker.date
                .recent()
                .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          })),
        },
      ],
    },
  ],
};

// Company Admin Dashboard Configuration
const companyAdminConfig: DashboardConfig = {
  stats: [
    {
      title: "All Solicitations",
      value: 52,
      icon: "folder-open",
      color: "text-gray-500",
      bgColor: "bg-gray-500/20",
    },
    {
      title: "Published Solicitations",
      value: 52,
      icon: "folder-open",
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Under Evaluations",
      value: 52,
      icon: "folder-open",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
    {
      title: "Closed Solicitations",
      value: 52,
      icon: "folder-open",
      color: "text-red-500",
      bgColor: "bg-red-500/20",
    },

    {
      title: "All Evaluations",
      value: 52,
      icon: "file",
      color: "text-gray-500",
      bgColor: "bg-gray-500/20",
    },
    {
      title: "Active Evaluations",
      value: 11,
      icon: "file",
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Pending Evaluations",
      value: 4,
      bgColor: "bg-red-500/20",
      icon: "file",
      color: "text-red-500",
    },
    {
      title: "Completed Evaluations",
      value: 4,
      bgColor: "bg-yellow-500/20",
      icon: "file",
      color: "text-yellow-500",
    },

    {
      title: "All Users",
      value: 52,
      icon: "users",
      color: "text-gray-500",
      bgColor: "bg-gray-500/20",
    },
    {
      title: "Admins",
      value: 11,
      icon: "user",
      color: "text-gray-500",
      bgColor: "bg-gray-500/20",
    },
    {
      title: "Procurement Leads",
      value: 4,
      bgColor: "bg-gray-500/20",
      icon: "user",
      color: "text-gray-500",
    },
    {
      title: "Evaluators",
      value: 4,
      bgColor: "bg-gray-500/20",
      icon: "user",
      color: "text-gray-500",
    },
  ],
  rows: [
    {
      type: "mixed",
      properties: [
        {
          id: "vendors-distribution",
          title: "Vendors Distribution",
          type: "donut",
          centerText: {
            value: 0,
            label: "Vendors"
          },
          innerRadius: 100,
          data: applyConsistentColors([
            { name: "Active", value: 57 },
            { name: "Inactive", value: 20 },
            { name: "Pending", value: 23 },
          ]),
          visible: true,
        },
        {
          title: "Recent Activity",
          items: Array.from({ length: 5 }, () => ({
            id: faker.string.uuid(),
            action: "New company registration approved",
            company: faker.company.name(),
            date: faker.date.recent({ days: 7 }).toLocaleDateString(),
          })),
        },
      ],
    },
    {
      type: "chart",
      className: "lg:grid-cols-3",
      properties: [
        {
          id: "proposal-submission",
          title: "Proposal Submission",
          type: "area",
          className: "col-span-2",
          data: Array.from({ length: 7 }, (_, i) => ({
            day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            submitted: faker.number.int({ min: 25, max: 65 }),
            "missed deadline": faker.number.int({ min: 18, max: 42 }),
            declined: faker.number.int({ min: 18, max: 42 }),
          })),
          visible: true,
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
        },
        {
          id: "vendors-intent-status",
          title: "Vendors Bid Intent Status",
          type: "donut",
          centerText: {
            value: 100,
            label: "Active Bids"
          },
          innerRadius: 100,
          data: applyConsistentColors([
            { name: "Accepted", value: 57 },
            { name: "Declined", value: 20 },
            { name: "Pending", value: 23 },
          ]),
          visible: true,
        },
      ],
    },
    {
      type: "chart",
      properties: [
        {
          id: "solicitation-status",
          title: "Solicitation Status",
          type: "pie",
          outerRadius: 150,
          data: applyConsistentColors([
            { name: "Active", value: 42 },
            { name: "Under Evaluation", value: 24 },
            { name: "Closed", value: 34 },
            { name: "Draft", value: 103 },
          ]),
          visible: true,
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
          legendIconType: 'circle'
        },
        {
          id: "role-distribution",
          title: "Role Distribution",
          type: "bar",
          layout: "vertical",
          data: [
            { role: "Procurement Lead", value: 75 },
            { role: "Evaluators", value: 60 },
            { role: "Vendors", value: 95 },
            { role: "Admin", value: 35 },
          ],
          visible: true,
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
          showLegend: false,
          colors: {
            value: "#2A4467"
          },
          barSize: 20
        },
      ],
    },
  ],
};

// Super Admin Dashboard Configuration
const superAdminConfig: DashboardConfig = {
  stats: [
    {
      title: "All Companies",
      value: 52,
      icon: "building-clock",
      color: "text-gray-800",
      bgColor: "bg-gray-500/20",
    },
    {
      title: "Active Companies",
      value: 11,
      icon: "building-clock",
      color: "text-green-800",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Suspended Companies",
      value: 4,
      icon: "building-clock",
      color: "text-red-800",
      bgColor: "bg-red-500/30",
    },
    {
      title: "All Admins",
      value: 20,
      icon: "users",
      color: "text-gray-800",
      bgColor: "bg-gray-500/30",
    },
    {
      title: "Super Admins",
      value: 3,
      icon: "user",
      color: "text-gray-800",
      bgColor: "bg-gray-500/30",
    },
    {
      title: "Organisation Admins",
      value: 7,
      icon: "user",
      color: "text-gray-800",
      bgColor: "bg-gray-500/30",
    },
  ],
  rows: [
    {
      type: "chart",
      className: "lg:grid-cols-3",
      properties: [
        {
          id: "weekly-activities",
          title: "Company Activity",
          type: "area",
          className: "col-span-2",
          data: Array.from({ length: 7 }, (_, i) => ({
            day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            submissions: faker.number.int({ min: 25, max: 65 }),
            evaluations: faker.number.int({ min: 18, max: 42 }),
          })),
          visible: true,
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
        },
        {
          id: "sub-distribution",
          title: "Subscription Distribution",
          type: "donut",
          outerRadius: 150,
          centerText: {
            value: 100,
            label: "Active Subscriptions"
          },
          innerRadius: 100,
          data: applyConsistentColors([
            { name: "Basic", value: 57 },
            { name: "Pro", value: 20 },
            { name: "Enterprise", value: 33 },
          ]),
          visible: true,
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
        },
        
      ],
    },
    {
      type: "chart",
      className: "lg:grid-cols-2",
      properties: [
        {
          id: "company-status",
          title: "Company Status Overview",
          type: "bar",
          className: "col-span-2",
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
          data: Array.from({ length: 12 }, (_, i) => ({
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
            onTime: faker.number.int({ min: 10, max: 15 }),
            late: faker.number.int({ min: 5, max: 10 }),
            pending: faker.number.int({ min: 15, max: 20 }),
            completed: faker.number.int({ min: 10, max: 15 }),
          })),
          stacked: true,
          visible: true,
          legendIconType: "circle",
        },
      ],
    },
    {
      type: 'chart',
      properties: [
        {
          id: "portal-role-distribution",
          title: "Portal Role Distribution",
          type: "pie",
          outerRadius: 150,
          data: applyConsistentColors([
            { name: "Active", value: 42 },
            { name: "Under Evaluation", value: 24 },
            { name: "Closed", value: 34 },
            { name: "Draft", value: 103 },
          ]),
          visible: true,
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
          legendIconType: 'circle'
        },
        {
          id: "module-usage",
          title: "Module Usage",
          type: "bar",
          data: [
            { name: "Module A", value: 30 },
            { name: "Module B", value: 20 },
            { name: "Module C", value: 15 },
            { name: "Module D", value: 25 },
          ],
          visible: true,
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
          legendIconType: 'circle'
        }
      ]
    }
  ],
};

// Create the weekly activities data
// const weeklyActivitiesData = generateWeeklyActivitiesData();

// Procurement Dashboard Configuration
const procurementConfig: DashboardConfig = {
  stats: [
    {
      title: "All Solicitations",
      value: 0,
      icon: "folder",
      color: "bg-blue-500/30",
      bgColor: "bg-blue-500",
    },
    {
      title: "Active Solicitations",
      value: 0,
      icon: "folder-open",
      color: "bg-green-500/30",
      bgColor: "bg-green-500",
    },
    {
      title: "Pending Evaluations",
      value: 0,
      icon: "clock",
      color: "bg-yellow-500/30",
      bgColor: "bg-yellow-500",
    },
    {
      title: "Awarded",
      value: 0,
      icon: "award",
      color: "bg-blue-500/30",
      bgColor: "bg-blue-500",
    },
  ],
  rows: [
    {
      type: "activity",
      properties: [
        {
          id: "my-actions",
          title: "My Actions",
          items: [],
        },
        {
          id: "general-updates",
          title: "General Updates",
          items:[],
        },
      ],
    },
    {
      type: "chart",
      className: "lg:grid-cols-3",
      properties: [
        {
          id: "solicitation-status",
          title: "Solicitation Status",
          type: "pie",
          outerRadius: 150,
          data: applyConsistentColors([
            { name: "Active", value: 42 },
            { name: "Under Evaluation", value: 24 },
            { name: "Closed", value: 34 },
            { name: "Draft", value: 103 },
          ]),
          visible: true,
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
        },
        {
          id: "weekly-activities",
          title: "Weekly Activities",
          type: "area",
          className: "col-span-2",
          data: Array.from({ length: 7 }, (_, i) => ({
            day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            submissions: faker.number.int({ min: 25, max: 65 }),
            evaluations: faker.number.int({ min: 18, max: 42 }),
          })),
          visible: true,
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
        },
      ],
    },
    {
      type: "chart",
      className: "lg:grid-cols-3 ",
      properties: [
        {
          id: "proposal-submission",
          title: "Proposal Submission",
          type: "line",
          className: "col-span-2",
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
          data: Array.from({ length: 7 }, (_, i) => ({
            day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            submissions: faker.number.int({ min: 25, max: 65 }),
            evaluations: faker.number.int({ min: 18, max: 42 }),
          })),
          visible: true,
        },

        {
          id: "vendors-bid-intent-status",
          title: "Vendors Bid Intent Status",
          type: "donut",
          innerRadius: 100,
          outerRadius: 90,
          data: applyConsistentColors([
            { name: "Accepted", value: 36, percentage: 57 },
            { name: "Declined", value: 13, percentage: 20 },
            { name: "Pending", value: 15, percentage: 33 },
          ]),
          centerText: {
            value: 64,
            label: "Active Bids"
          },
          visible: true,
        },
      ],
    },
    {
      type: "chart",
      className: "lg:grid-cols-3 ",
      properties: [
        {
          id: "vendors-distribution",
          title: "Vendors Distribution",
          type: "donut",
          data: applyConsistentColors([
            { name: "Active", value: 30, percentage: 57 },
            { name: "Inactive", value: 10, percentage: 20 },
            { name: "Pending", value: 12, percentage: 23 },
          ]),
          innerRadius: 100,
          
          centerText: {
            value: 52,
            label: "Vendors"
          },
          visible: true,
        },
        {
          id: "total-evaluation",
          title: "Total Evaluation",
          type: "bar",
          className: "col-span-2",
          filters: ["12 months", "6 months", "3 months", "30 days", "7 days"],
          data: Array.from({ length: 12 }, (_, i) => ({
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
            onTime: faker.number.int({ min: 10, max: 15 }),
            late: faker.number.int({ min: 5, max: 10 }),
            pending: faker.number.int({ min: 15, max: 20 }),
            completed: faker.number.int({ min: 10, max: 15 }),
          })),
          stacked: true,
          visible: true,
        },
      ],
    },
  ],
};

// Export dashboard configurations
export const dashboardConfigs: Record<UserRole, DashboardConfig> = {
  evaluator: evaluatorConfig,
  vendor: vendorConfig,
  company_admin: companyAdminConfig,
  super_admin: superAdminConfig,
  procurement: procurementConfig,
};

// Helper function to get dashboard config by role
export const getDashboardConfig = (role: UserRole): DashboardConfig => {
  return dashboardConfigs[role] || procurementConfig;
};
