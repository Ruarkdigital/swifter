import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronLeft } from "lucide-react";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { BidComparisonItem } from "../hooks/useEvaluationDetailApi";
import { useToastHandler } from "@/hooks/useToaster";


interface BidComparisonSheetProps {
  evaluationId: string;
  proposalId: string;
  vendorName?: string;
}

export const BidComparisonSheet = ({ evaluationId, proposalId, vendorName }: BidComparisonSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toastHandlers = useToastHandler();

  const { data: bidComparisonData, isLoading, error } = useQuery({
    queryKey: ["bid-comparison", evaluationId],
    queryFn: async () => {
      const response = await getRequest({ url: `/procurement/evaluations/${evaluationId}/bid-comparison` });
      return response.data.data as BidComparisonItem[];
    },
    enabled: isOpen && !!evaluationId,
  });

  // Export bid comparison mutation for download
  const exportBidComparisonMutation = useMutation<
    Blob,
    Error,
    { type: "pdf" | "docx" }
  >({
    mutationFn: async ({ type }) => {
      const response = await getRequest({
        url: `/procurement/evaluations/${evaluationId}/bid-comparison/export?type=${type}`,
        config: { responseType: "blob" },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `bid-comparison-breakdown-${evaluationId}.${variables.type}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toastHandlers.success(
        "Download Successful",
        `Bid comparison breakdown downloaded as ${variables.type.toUpperCase()} successfully`
      );
    },
    onError: (error) => {
      toastHandlers.error("Download Failed", error.message || "An error occurred during download");
    },
  });

  // Handle download
  const handleDownload = () => {
    exportBidComparisonMutation.mutate({ type: "pdf" });
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Find the specific proposal data
  const proposalData = bidComparisonData?.find(item => item.proposalId === proposalId);
  const totalAmount = proposalData?.total || 0;

  // Define table columns for bid comparison summary
  const columns: ColumnDef<BidComparisonItem>[] = [
    {
      accessorKey: "vendorName",
      header: "Vendor Name",
      cell: ({ row }) => (
        <div className="text-gray-900 font-medium">
          {row.original.vendorName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "vendorEmail",
      header: "Vendor Email",
      cell: ({ row }) => (
        <div className="text-gray-600">
          {row.original.vendorEmail || "-"}
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: "Total Amount",
      cell: ({ row }) => (
        <div className="text-gray-900 font-medium">
          ${row.original.total?.toFixed(2) || "0.00"}
        </div>
      ),
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => (
        <div className="text-gray-900">
          {row.original.score?.toFixed(1) || "-"}
        </div>
      ),
    },
    {
      accessorKey: "rank",
      header: "Rank",
      cell: ({ row }) => (
        <div className="text-gray-900 font-medium">
          {row.original.rank || "-"}
        </div>
      ),
    },
  ];



  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-0 h-auto font-normal"
        >
          View Breakdown
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-4xl p-0 overflow-y-auto ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-medium text-gray-900">
              Price Breakdown
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Export */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {vendorName} Price Breakdown
            </h1>
          </div>

          {/* Company and Submission Info */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Selected Vendor</p>
              <p className="text-base font-medium text-gray-900">
                {proposalData?.vendorName || vendorName || "Vendor"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-base font-semibold text-gray-900">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Rank</p>
              <p className="text-base font-medium text-gray-900">
                {proposalData?.rank || "-"}
              </p>
            </div>
          </div>

          {/* Bid Comparison Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading bid comparison data...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-500">Failed to load bid comparison data</div>
            </div>
          ) : (
            <>
              <DataTable
                data={bidComparisonData || []}
                columns={columns}
                classNames={{
                  container: "border rounded-lg overflow-hidden",
                  table: "border-separate border-spacing-0",
                  tHeader: "bg-gray-50",
                  tHead: "text-sm font-medium text-gray-700 px-4 py-3 text-left",
                  tRow: "bg-white border-b last:border-b-0",
                  tCell: "px-4 py-4 text-sm",
                }}
                options={{
                  disablePagination: true,
                  disableSelection: true,
                  isLoading: false,
                  totalCounts: bidComparisonData?.length || 0,
                  manualPagination: false,
                  setPagination: () => {},
                  pagination: { pageIndex: 0, pageSize: 100 },
                }}
                emptyPlaceholder={
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">No bid comparison data available</div>
                  </div>
                }
              />
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <Button 
              variant="outline" 
              className="px-6"
              onClick={handleDownload}
              disabled={exportBidComparisonMutation.isPending}
            >
              {exportBidComparisonMutation.isPending ? "Downloading..." : "Download"}
            </Button>
            <Button 
              className="px-6 bg-blue-900 hover:bg-blue-800"
              onClick={handlePrint}
            >
              Print
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
