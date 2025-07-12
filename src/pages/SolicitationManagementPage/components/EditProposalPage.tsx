import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRequest, putRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { Forge, FormPropsRef, useForge } from "@/lib/forge";
import CompleteProposalDialog from "./CompleteProposalDialog";
import FileUploadDialog from "./FileUploadDialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToastHandler } from "@/hooks/useToaster";
import { SEOWrapper } from "@/components/SEO";

// Types for the proposal form
interface UploadFileResponse {
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedAt: string;
}

type SubItem = {
  _id: string;
  component: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  subItems: SubItem[];
};

export interface RequiredFile {
  _id: string;
  title: string;
  type: string;
  required: boolean;
  multipleFile: boolean;
  status: "pending" | "uploaded" | "complete";
}

interface EditProposalPageProps {}

const schema = yup.object().shape({
  total: yup
    .number()
    .required("Total amount is required")
    .min(0, "Total must be positive"),
  status: yup
    .string()
    .oneOf(["submit"], "Status must be submit")
    .required("Status is required"),
  document: yup.array().of(
    yup.object().shape({
      requiredDocumentId: yup
        .string()
        .required("Required document ID is required"),
      files: yup.array().of(
        yup.object().shape({
          name: yup.string().required("File name is required"),
          type: yup.string().required("File type is required"),
          size: yup.string().required("File size is required"),
          url: yup.string().required("File URL is required"),
        })
      ),
    })
  ),
  priceAction: yup
    .array()
    .of(
      yup.object().shape({
        component: yup.string().required("Component is required"),
        description: yup.string().required("Description is required"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .min(0, "Quantity must be positive"),
        unitOfmeasurement: yup
          .string()
          .required("Unit of measurement is required"),
        unitPrice: yup
          .number()
          .required("Unit price is required")
          .min(0, "Unit price must be positive"),
        subtotal: yup.number().optional().min(0, "Subtotal must be positive"),
        subItems: yup
          .array()
          .of(
            yup.object().shape({
              component: yup.string().required("Sub-component is required"),
              description: yup.string().required("Sub-description is required"),
              quantity: yup
                .number()
                .required("Sub-quantity is required")
                .min(0, "Sub-quantity must be positive"),
              unitOfmeasurement: yup
                .string()
                .required("Sub-unit of measurement is required"),
              unitPrice: yup
                .number()
                .required("Sub-unit price is required")
                .min(0, "Sub-unit price must be positive"),
              subtotal: yup
                .number()
                .required("Sub-subtotal is required")
                .min(0, "Sub-subtotal must be positive"),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export type FormValues = yup.InferType<typeof schema>;

const EditProposalPage: React.FC<EditProposalPageProps> = () => {
  const navigate = useNavigate();
  const toast = useToastHandler();
  const [type, setType] = useState("");
  const formRef = useRef<FormPropsRef>(null);
  const { id: solicitationId, proposalId } = useParams<{
    id: string;
    proposalId: string;
  }>();
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  // Initialize useForge for proposal form
  const forge = useForge<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      total: 0,
      status: "submit",
      document: [],
      priceAction: [
        {
          component: "",
          description: "",
          quantity: 0,
          unitOfmeasurement: "",
          unitPrice: 0,
          subtotal: 0,
          subItems: [],
        },
      ],
    },
  });

  // Fetch existing proposal data
  const { data: proposalData, isLoading: isLoadingProposal } = useQuery<
    ApiResponse<{
      _id: string;
      action: {
        _id: string;
        component: string;
        description: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
        subItems: SubItem[];
      };
      solicitation: {
        _id: string;
        status: string;
        timezone: string;
        solId: string;
      };
      requiredDoc: Array<{
        id: string;
        files: Array<{
          name: string;
          url: string;
          type: string;
          size: string;
          uploadedAt: string;
          _id: string;
        }>;
        _id: string;
      }>;
      updatedAt: string;
    }>,
    ApiResponseError
  >({
    queryKey: ["vendor-proposal-details", solicitationId, proposalId],
    queryFn: async () => {
      return await getRequest({
        url: `/vendor/proposal/${proposalId}`,
      });
    },
    enabled: !!solicitationId && !!proposalId,
  });

  // Fetch solicitation details from API
  const { data: solicitationData, isLoading } = useQuery<
    ApiResponse<{
      solicitation: {
        name: string;
        status: string;
        solId: string;
        typeId: object;
      };
      documents: Array<{
        title: string;
        link: string;
        _id: string;
        size: string;
        required: boolean;
        type: string;
      }>;
    }>,
    ApiResponseError
  >({
    queryKey: ["vendor-solicitation", solicitationId],
    queryFn: async () => {
      return await getRequest({
        url: `/vendor/proposal/${solicitationId}/view-criteria`,
      });
    },
    enabled: !!solicitationId,
  });

  // Update proposal mutation
  const { mutateAsync: updateProposal, isPending: isSubmitting } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    FormValues
  >({
    mutationKey: ["updateProposal"],
    mutationFn: async (proposalData) =>
      await putRequest({
        url: `/vendor/proposal/${solicitationId}/proposal/${proposalId}`,
        payload: proposalData,
      }),
  });

  // Extract solicitation data from API response
  const solicitation = solicitationData?.data?.data?.solicitation;
  const solicitationName = solicitation?.name || "Loading...";
  const solicitationStatus = solicitation?.status || "Unknown";
  const requiredFiles = solicitationData?.data?.data?.documents || [];

  // Populate form with existing proposal data
  useEffect(() => {
    if (proposalData?.data?.data) {
      const existingProposal = proposalData.data.data;

      // Map existing documents to form format
      const existingDocuments = existingProposal.requiredDoc.map((doc) => ({
        requiredDocumentId: doc.id,
        files: doc.files.map((file) => ({
          name: file.name,
          url: file.url,
          type: file.type,
          size: file.size,
          uploadedAt: file.uploadedAt,
        })),
      }));

      // Reset form with existing data
      forge.reset({
        total: 0, // You may need to calculate this from existing data
        status: "submit",
        document: existingDocuments,
        priceAction: existingProposal.action as any || [
          {
            component: "",
            description: "",
            quantity: 0,
            unitOfmeasurement: "",
            unitPrice: 0,
            subtotal: 0,
            subItems: [],
          },
        ],
      });
    }
  }, [proposalData]);

  // Handle file upload completion
  const handleFilesUploaded = (
    files: UploadFileResponse[],
    requiredDocumentId: string
  ) => {
    const currentDocuments = forge.getValues("document") || [];
    const existingDocIndex = currentDocuments.findIndex(
      (doc) => doc.requiredDocumentId === requiredDocumentId
    );

    if (existingDocIndex >= 0) {
      // Update existing document
      const updatedDocuments = [...currentDocuments];
      updatedDocuments[existingDocIndex] = {
        requiredDocumentId: requiredDocumentId,
        files: files,
      };
      forge.setValue("document", updatedDocuments);
    } else {
      // Add new document
      const newDocument = {
        requiredDocumentId: requiredDocumentId,
        files: files,
      };
      forge.setValue("document", [...currentDocuments, newDocument]);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      const submissionData = {
        ...data,
        status: "submit" as const,
      };

      await updateProposal(submissionData);
      toast.success("Success", "Proposal updated and submitted successfully");
      navigate(-1); // Navigate back after successful submission
    } catch (error) {
      console.error("Submit error:", error);
      const err = error as ApiResponseError;
      toast.error(
        "Submission Failed",
        err?.response?.data?.message ?? "Failed to update proposal"
      );
    }
  };

  // Check if document has uploaded files
  const getUploadedFilesForDocument = (documentId: string) => {
    const currentDocuments = forge.watch("document") || [];
    const document = currentDocuments.find(
      (doc) => doc.requiredDocumentId === documentId
    );
    return document?.files || [];
  };

  // Define table columns
  const columns: ColumnDef<{
    _id: string;
    title: string;
    link: string;
    size: string;
    required: boolean;
    type: string;
  }>[] = [
    {
      accessorKey: "title",
      header: "Requested Doc",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Document Type",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "required",
      header: "Required",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.required ? "Yes" : "Optional"}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const doc = row.original;
        const uploadedFiles = getUploadedFilesForDocument(doc._id);
        const hasFiles = uploadedFiles.length > 0;

        return (
          <div className="flex flex-col gap-2">
            {doc.type?.toLowerCase?.() === "pricing" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="!w-fit"
                  onClick={() => {
                    setSelectedDocumentId(doc._id);
                    setIsCompleteDialogOpen(true);
                  }}
                >
                  {hasFiles ? "Update Proposal" : "Complete Proposal"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => {
                  setType(doc.type);
                  setSelectedDocumentId(doc._id);
                  setIsFileUploadDialogOpen(true);
                }}
              >
                <Upload className="h-4 w-4 mr-1" />
                {hasFiles ? "Update Files" : "Upload File"}
              </Button>
            )}
          </div>
        );
      },
    },
    {
      id: "uploads",
      header: "Uploads",
      cell: ({ row }) => {
        const uploadedFiles = getUploadedFilesForDocument(row.original._id);
        const uploadCount = uploadedFiles.length;
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {uploadCount > 0 ? (
              <div className="flex flex-col gap-1">
                <span>{uploadCount} file(s)</span>
                {uploadedFiles.map((file, index) => (
                  <span
                    key={index}
                    className="text-xs text-blue-600 dark:text-blue-400"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            ) : (
              "-"
            )}
          </div>
        );
      },
    },
  ];

  if (isLoadingProposal || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading proposal data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOWrapper
        title={`Edit Proposal - ${solicitationName} - SwiftPro eProcurement Portal`}
        description="Edit and update your proposal submission for the solicitation with document uploads and pricing details."
        keywords="edit proposal, update proposal, solicitation, procurement, vendor portal"
        canonical={`/dashboard/solicitations/${solicitationId}/edit-proposal/${proposalId}`}
        robots="noindex, nofollow"
      />
      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="px-6 py-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Solicitations</span>
            <span className="mx-2">→</span>
            <span>Solicitation Details</span>
            <span className="mx-2">→</span>
            <span>{isLoading ? "Loading..." : solicitationName}</span>
            <span className="mx-2">→</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              Edit Proposal
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Edit Proposal - {isLoading ? "Loading..." : solicitationName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {solicitation?.solId || "Loading..."} • {solicitationStatus}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={`${
                  solicitationStatus?.toLowerCase() === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {solicitationStatus || "Unknown"}
              </Badge>
            </div>
          </div>

          {/* Upload Documents Section */}
          <div className="">
            <div className="py-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Update Requested Documents
              </h2>
            </div>

            <Forge
              control={forge.control}
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className="py-4">
                <DataTable
                  data={requiredFiles}
                  columns={columns}
                  options={{
                    disablePagination: true,
                    disableSelection: true,
                    isLoading: false,
                    totalCounts: requiredFiles.length,
                    manualPagination: false,
                    setPagination: () => {},
                    pagination: { pageIndex: 0, pageSize: 10 },
                  }}
                  classNames={{
                    container: "border-0",
                    table: "border-collapse",
                    tHeader: "bg-gray-50 dark:bg-gray-700",
                    tHead:
                      "text-left font-medium text-gray-700 dark:text-gray-300 py-3 px-4",
                    tCell:
                      "py-4 px-4 border-b border-gray-200 dark:border-gray-600",
                    tRow: "hover:bg-gray-50 dark:hover:bg-gray-700",
                  }}
                />
              </div>
            </Forge>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end mt-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6"
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                className="px-6 bg-[#2A4467] hover:bg-[#1e3147]"
                onClick={() => formRef.current?.onSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Proposal"}
              </Button>
            </div>
          </div>

          {/* Dialogs */}
          <CompleteProposalDialog
            open={isCompleteDialogOpen}
            onOpenChange={setIsCompleteDialogOpen}
            control={forge.control as any}
            reset={forge.reset}
            setValue={forge.setValue as any}
            getValue={forge.getValues as any}
            id={selectedDocumentId}
          />

          <FileUploadDialog
            open={isFileUploadDialogOpen}
            onOpenChange={setIsFileUploadDialogOpen}
            onFilesUploaded={(files) =>
              handleFilesUploaded(files, selectedDocumentId || "")
            }
            control={forge.control}
            requiredDocumentId={selectedDocumentId || ""}
            maxFiles={5}
            type={type}
            acceptedTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
          />
        </div>
        <div className="h-10" />
      </div>
    </>
  );
};

export default EditProposalPage;
