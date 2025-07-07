import { Badge } from "@/components/ui/badge";

type Evaluation = {
  id: string;
  name: string;
  solicitationId: string;
  type: string;
  deadline: string;
  daysLeft: number;
  status: "Active" | "Pending" | "Completed";
};

interface StatusBadgeProps {
  status: Evaluation["status"];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0`}>{status}</Badge>
  );
};