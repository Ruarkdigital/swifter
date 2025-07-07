import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatCardProps = {
  title: string;
  value: number;
  icon: any;
  iconColor?: string;
  iconBgColor?: string;
  className?: string
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-gray-500",
  iconBgColor = "bg-gray-100",
  className
}: StatCardProps) => {
  return (
    <Card className={cn("p-6 border border-gray-200 rounded-lg", className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-muted">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${iconBgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
