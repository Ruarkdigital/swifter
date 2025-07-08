import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Search, Plus, FileText } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, deleteRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import CreateAddendumDialog from "./CreateAddendumDialog";
import AddendumDetailsSheet from "./AddendumDetailsSheet";
import { format } from "date-fns";
import { useUserRole } from "@/hooks/useUserRole";

// Addendum type definition based on API schema
type SolicitationAddendum = {
  _id: string;
  title: string;
  description?: string;
  submissionDeadline?: string;
  questionDeadline?: string;
  questions?: string;
  status: "Draft" | "Published";
  files?: Array<{
    _id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

type Addendum = {
  id: string;
  title: string;
  linkedQuestion: boolean;
  datePublished: string;
  status: "Draft" | "Published";
};

interface AddendumsTabProps {
  solicitationId?: string;
}

// Transform API addendum data to component format
const transformAddendumData = (apiAddendum: SolicitationAddendum): Addendum => {
  // Safely format the date, fallback to "N/A" if invalid
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return format(date, "MMMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  return {
    id: apiAddendum._id,
    title: apiAddendum.title,
    linkedQuestion: !!apiAddendum.questions,
    datePublished: formatDate(apiAddendum.createdAt),
    status: apiAddendum.status === "Published" ? "Published" : "Draft",
  };
};

// Status badge component for addendums
const AddendumStatusBadge = ({ status }: { status: Addendum["status"] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0`}>{status}</Badge>
  );
};

// Add more specific error handling
const getErrorMessage = (error: ApiResponseError) => {
  if (error?.response?.status === 403) {
    return "You don't have permission to access addendums for this solicitation.";
  }
  if (error?.response?.status === 404) {
    return "Solicitation not found.";
  }
  return error?.response?.data?.message ?? "Failed to load addendums";
};

// Create useAddendums hook
const useAddendums = (solicitationId: string) => {
  const { isVendor } = useUserRole();

  return useQuery<ApiResponse<SolicitationAddendum[]>, ApiResponseError>({
    queryKey: ["addendums", solicitationId],
    queryFn: async () => {
      const endpoint = isVendor
        ? `/vendor/solicitations/${solicitationId}/addendums`
        : `/procurement/solicitations/${solicitationId}/addendums`;
      return await getRequest({ url: endpoint });
    },
    enabled: !!solicitationId,
  });
};

const AddendumsTab: React.FC<AddendumsTabProps> = ({ solicitationId }) => {
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const { isVendor } = useUserRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedAddendum, setSelectedAddendum] = useState<Addendum | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  // Fetch addendums from API
  const {
    data: addendumsData,
    isLoading,
    error,
  } = useAddendums(solicitationId ?? "");

  // Delete addendum mutation
  const deleteAddendumMutation = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    string
  >({
    mutationFn: async (addendumId: string) => {
      // Use different API endpoint based on user role
      const endpoint = isVendor
        ? `/vendor/solicitations/${solicitationId}/addendums/${addendumId}` // Vendor-specific endpoint
        : `/procurement/solicitations/${solicitationId}/addendums/${addendumId}`; // Default procurement endpoint

      return await deleteRequest({ url: endpoint });
    },
    onSuccess: () => {
      toast.success("Success", "Addendum deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["addendums", solicitationId],
      });
    },
    onError: (error) => {
      console.error("Delete addendum error:", error);
      toast.error(
        "Error",
        error?.response?.data?.message ?? "Failed to delete addendum"
      );
    },
  });

  // Transform API data to component format
  const addendums = useMemo(() => {
    if (!addendumsData?.data?.data) return [];
    return addendumsData.data.data.map(transformAddendumData);
  }, [addendumsData]);

  // Filter addendums based on search query
  const filteredAddendums = useMemo(() => {
    if (!searchQuery) return addendums;
    return addendums.filter((addendum) =>
      addendum.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [addendums, searchQuery]);

  // Handle delete addendum
  const handleDeleteAddendum = async (addendumId: string) => {
    await deleteAddendumMutation.mutateAsync(addendumId);
  };

  // Define addendums table columns
  const addendumColumns: ColumnDef<Addendum>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "linkedQuestion",
      header: "Linked Question",
      cell: ({ row }) => (
        <span className="">{row.original.linkedQuestion ? "Yes" : "No"}</span>
      ),
    },
    {
      accessorKey: "datePublished",
      header: "Date Published",
      cell: ({ row }) => <span className="">{row.original.datePublished}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <AddendumStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.status === "Draft" ? (
            <>
              <Button variant="link" className="text-green-600 p-0 h-auto">
                Edit
              </Button>
              <ConfirmAlert
                type="delete"
                title="Delete Addendum"
                text="Are you sure you want to delete this addendum? This action cannot be undone."
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                onPrimaryAction={() => handleDeleteAddendum(row.original.id)}
                trigger={
                  <Button
                    variant="link"
                    className="text-red-600 p-0 h-auto"
                    disabled={deleteAddendumMutation.isPending}
                  >
                    Delete
                  </Button>
                }
              />
            </>
          ) : (
            <Button
              variant="link"
              className="text-green-600 p-0 h-auto"
              onClick={() => {
                setSelectedAddendum(row.original);
                setIsDetailsSheetOpen(true);
              }}
            >
              View
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Memoize expensive computations
  const memoizedColumns = useMemo(
    () => addendumColumns,
    [deleteAddendumMutation.isPending]
  );

  // Add debounced search
  // const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  return (
    <div className="space-y-6">
      {/* Data Table */}
      <div className="mt-6">
        <DataTable
          header={() => (
            <div className="p-4 border-b flex items-center w-full gap-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Addendums
              </h2>
              <div className="relative flex-1 ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search Addendums"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              {solicitationId && !isVendor && (
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#2A4467] hover:bg-[#1e3252] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Addendum
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <CreateAddendumDialog
                      solicitationId={solicitationId}
                      onClose={() => setIsCreateDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
          data={filteredAddendums}
          classNames={{
            container:
              "bg-white dark:bg-slate-950 rounded-xl px-3 border border-gray-300 dark:border-slate-600",
          }}
          columns={memoizedColumns}
          emptyPlaceholder={
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
                No Addendums Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                {searchQuery
                  ? `No addendums match your search for "${searchQuery}". Try adjusting your search terms.`
                  : "No addendums have been created for this solicitation yet."}
              </p>
            </div>
          }
          options={{
            disableSelection: true,
            isLoading,
            totalCounts: filteredAddendums.length,
            manualPagination: false,
            setPagination,
            pagination,
          }}
        />
      </div>
      
      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-600 dark:text-red-400">
            {getErrorMessage(error)}
          </div>
        </div>
      )}

      {/* Addendum Details Sheet */}
      <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
        <SheetContent
          side="right"
          className="md:max-w-[50dvw] sm:w-[600px] p-0"
        >
          {selectedAddendum && (
            <AddendumDetailsSheet
              addendum={selectedAddendum}
              solicitationId={solicitationId!}
              onClose={() => setIsDetailsSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddendumsTab;
