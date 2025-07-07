import { Card, CardContent } from "@/components/ui/card";

export type StatCardProps = {
  title: string;
  value: number;
  icon: any;
  iconColor?: string;
  iconBgColor?: string;
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-gray-500",
  iconBgColor = "bg-gray-100",
}: StatCardProps) => {
  return (
    <Card className="p-6 border border-gray-200 rounded-lg">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${iconBgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};