/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  User2,
  FileText,
  Users,
  ClipboardList,
  Building2,
  UserCheck,
  Settings,
  BarChart3,
  Mail,
} from "lucide-react";
import SwiftProLogo from "../assets/image9.png";
import SwiftProWhiteLogo from "../assets/swiftpro-white.svg";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";
import { UserRole } from "@/types";

type NavigationItem = {
  icon: any;
  title: string;
  to: string;
  active: boolean;
  isImage?: boolean;
};

const getNavigationForRole = (
  role: UserRole,
  currentPath: string
): NavigationItem[] => {
  const baseNavigation = [
    {
      icon: MdDashboard,
      title: "Dashboard",
      to: "/dashboard",
      active: currentPath === "/dashboard",
    },
  ];

  const roleSpecificNavigation: Record<UserRole, NavigationItem[]> = {
    procurement: [
      {
        icon: FileText,
        title: "Solicitation Management",
        to: "/dashboard/solicitation",
        active: currentPath.startsWith("/dashboard/solicitation"),
      },
      {
        icon: Users,
        title: "Vendor Management",
        to: "/dashboard/vendor",
        active: currentPath.startsWith("/dashboard/vendor"),
      },
      {
        icon: ClipboardList,
        title: "Evaluation Management",
        to: "/dashboard/evaluation",
        active: currentPath.startsWith("/dashboard/evaluation"),
      },
      {
        icon: User2,
        title: "Profile",
        to: "/dashboard/profile",
        active: currentPath.startsWith("/dashboard/profile"),
      },
    ],
    evaluator: [
      {
        icon: ClipboardList,
        title: "My Evaluation",
        to: "/dashboard/evaluation",
        active: currentPath.startsWith("/dashboard/evaluation"),
      },
      {
        icon: User2,
        title: "Profile",
        to: "/dashboard/profile",
        active: currentPath.startsWith("/dashboard/profile"),
      },
    ],
    vendor: [
      {
        icon: Mail,
        title: "Invitations",
        to: "/dashboard/invitations",
        active: currentPath.startsWith("/dashboard/invitations"),
      },
      {
        icon: FileText,
        title: "Solicitation Management",
        to: "/dashboard/solicitation",
        active: currentPath.startsWith("/dashboard/solicitation"),
      },
      {
        icon: User2,
        title: "Profile",
        to: "/dashboard/profile",
        active: currentPath.startsWith("/dashboard/profile"),
      },
    ],
    company_admin: [
      {
        icon: FileText,
        title: "Solicitation Management",
        to: "/dashboard/solicitation",
        active: currentPath.startsWith("/dashboard/solicitation"),
      },
      {
        icon: User2,
        title: "User Management",
        to: "/dashboard/user-management",
        active: currentPath.startsWith("/dashboard/user-management"),
      },
      {
        icon: Users,
        title: "Vendor Management",
        to: "/dashboard/vendor",
        active: currentPath.startsWith("/dashboard/vendor"),
      },
      {
        icon: ClipboardList,
        title: "Evaluation",
        to: "/dashboard/evaluation",
        active: currentPath.startsWith("/dashboard/evaluation"),
      },
      {
        icon: User2,
        title: "Profile",
        to: "/dashboard/profile",
        active: currentPath.startsWith("/dashboard/profile"),
      },
    ],
    super_admin: [
      {
        icon: Building2,
        title: "Companies",
        to: "/dashboard/companies",
        active: currentPath.startsWith("/dashboard/companies"),
      },
      // {
      //   icon: Users, // Reusing the Users icon, as it's appropriate for User Management
      //   title: "User Management",
      //   to: "/dashboard/user-management", // Assuming this is the correct route
      //   active: currentPath.startsWith("/dashboard/user-management"),
      // },
      {
        icon: BarChart3,
        title: "Subscription",
        to: "/dashboard/subscription",
        active: currentPath.startsWith("/dashboard/subscription"),
      },
      {
        icon: UserCheck,
        title: "Admin Management",
        to: "/dashboard/admin-management",
        active: currentPath.startsWith("/dashboard/admin-management"),
      },
      {
        icon: Mail,
        title: "Communication Management",
        to: "/dashboard/communication-management",
        active: currentPath.startsWith("/dashboard/communication-management"),
      },
      {
        icon: BarChart3,
        title: "System Log",
        to: "/dashboard/system-log",
        active: currentPath.startsWith("/dashboard/system-log"),
      },
      {
        icon: Settings,
        title: "Portal Settings",
        to: "/dashboard/portal-settings",
        active: currentPath.startsWith("/dashboard/portal-settings"),
      },
      {
        icon: User2,
        title: "Profile",
        to: "/dashboard/profile",
        active: currentPath.startsWith("/dashboard/profile"),
      },
    ],
  };

  return [...baseNavigation, ...roleSpecificNavigation[role]];
};

export const SideBar = () => {
  const location = useLocation();
  const { userRole } = useUserRole();

  const navigation = getNavigationForRole(userRole, location.pathname);

  return (
    <Sidebar
      collapsible="none"
      className={cn(
        "border-r border-gray-200 dark:border-gray-700 transition-colors",
        userRole === "super_admin"
          ? "bg-[#2A4467]"
          : "bg-white dark:bg-gray-900"
      )}
    >
      <SidebarHeader className="p-6 ">
        <div className="flex items-center gap-3">
          <img
            src={userRole === "super_admin" ? SwiftProWhiteLogo : SwiftProLogo}
            alt="SwiftPro"
            className="h-8 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    className={cn(
                      "w-full justify-start px-3 py-5 text-sm font-medium transition-colors rounded-none",
                      userRole === "super_admin"
                        ? item.active
                          ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl"
                          : "text-white/80 hover:text-white hover:bg-white/5 "
                        : item.active
                        ? "bg-[#2A44671A] dark:bg-blue-900/20 text-[#2A4467] dark:text-blue-400 border-l-2 border-[#2A4467] dark:border-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <Link to={item.to} className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          userRole === "super_admin"
                            ? item.active
                              ? "text-white"
                              : "text-white/80"
                            : item.active
                            ? "text-[#2A4467] dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        )}
                      />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
