import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-gray-600",
  bgColor = "bg-gray-50",
}: StatCardProps) {
  return (
    <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          </div>
          <div className={cn("p-3 rounded-full dark:bg-opacity-20", bgColor)}>
            <Icon className={cn("h-6 w-6 dark:opacity-90", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}