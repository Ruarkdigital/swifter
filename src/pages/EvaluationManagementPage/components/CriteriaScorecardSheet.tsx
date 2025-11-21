import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronLeft } from "lucide-react";
import { DataTable, createExpandButton } from "@/components/layouts/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ApiResponseError } from "@/types";

interface ScoreCardItem {
  scoring?: { weight?: number, pass_fail?: string };
  _id: string;
  evaluationCriteria: {
    criteria: {
      pass_fail: string;
      weight: number;
      status: string;
    };
    _id: string;
    evaluation: string;
  };
  vendor: { _id: string; name: string };
  evaluator: { _id: string; name: string };
  comment?: string;
  evaluation: string;
}

interface CriteriaScorecardResponse {
  status: number;
  message: string;
  data: ScoreCardItem[];
}

export const CriteriaScorecardSheet = ({
  evaluationId,
  criteriaId,
}: {
  evaluationId: string;
  criteriaId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: scoreData,
    isLoading,
    error,
  } = useQuery<CriteriaScorecardResponse, ApiResponseError>({
    queryKey: ["criteria-score-card", evaluationId, criteriaId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/procurement/evaluations/${evaluationId}/criteria/${criteriaId}/score-card`,
      });
      return response.data as CriteriaScorecardResponse;
    },
    enabled: isOpen && !!evaluationId && !!criteriaId,
  });

  const rows: ScoreCardItem[] = Array.isArray(scoreData?.data)
    ? scoreData!.data.sort((a, b) => {
        const aEvaluator = a.evaluator.name ?? "";
        const bEvaluator = b.evaluator.name ?? "";
        return bEvaluator.localeCompare(aEvaluator);
      })
    : [];

  const columns: ColumnDef<ScoreCardItem>[] = [
    {
      id: "expander",
      header: "",
      size: 40,
      cell: ({ row }) => createExpandButton(row as any),
    },
    {
      accessorKey: "vendor.name",
      header: "Vendor",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.vendor?.name}</span>
      ),
    },
    {
      accessorKey: "evaluator.name",
      header: "Evaluator",
      cell: ({ row }) => <span>{row.original.evaluator?.name}</span>,
    },
    {
      accessorKey: "scoring.weight",
      header: "Score",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.scoring?.weight ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "evaluationCriteria.criteria.weight",
      header: "Weight",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.evaluationCriteria?.criteria?.weight ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "evaluationCriteria.criteria.pass_fail",
      header: "Pass/Fail",
      cell: ({ row }) => {
        const status = row.original.evaluationCriteria?.criteria?.status;
        const val = row.original.scoring?.pass_fail;

        if (status !== "pass_fail" || !val)
          return <span className="text-muted-foreground">-</span>;

        const label = String(val).toLowerCase() === "fail" ? "Fail" : "Pass";

        return <span className="font-medium">{label}</span>;
      },
    },
    {
      accessorKey: "evaluationCriteria.criteria.status",
      header: "Status",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.evaluationCriteria?.criteria?.status || "-"}
        </span>
      ),
    },
    // comment moved to sub-row
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="link" className="text-green-600 p-0 h-auto">
          View Scores
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl p-0 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-slate-200" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-slate-200">
              Criteria Score Card
            </h2>
          </div>
        </div>

        <div className="py-6">
          {error && (
            <div className="text-red-600 dark:text-red-400 mb-3">
              {error?.response?.data?.message || "Failed to load score card"}
            </div>
          )}

          <DataTable
            data={rows}
            columns={columns}
            options={{
              disableSelection: true,
              disablePagination: true,
              isLoading,
              totalCounts: rows.length,
              manualPagination: false,
              setPagination: () => {},
              pagination: { pageIndex: 0, pageSize: 50 },
              enableExpanding: true,
              getRowCanExpand: (row) =>
                !!(row.original as ScoreCardItem).comment,
              renderSubComponent: ({ row }) => (
                <div className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  <div className="font-medium mb-1">Comment</div>
                  <div>{(row.original as ScoreCardItem).comment || "-"}</div>
                </div>
              ),
            }}
            classNames={{
              container: "bg-white dark:bg-slate-950 rounded-xl px-3",
              tCell: "text-sm",
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CriteriaScorecardSheet;
