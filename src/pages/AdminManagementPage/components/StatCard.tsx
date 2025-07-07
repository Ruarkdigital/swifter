import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export const StatCard = ({ title, value, icon: Icon, iconColor, iconBgColor }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor} dark:bg-opacity-20`}>
          <Icon className={`h-8 w-8 ${iconColor} dark:text-opacity-80`} />
        </div>
      </div>
    </div>
  );
};