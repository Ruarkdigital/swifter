import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Eye, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { format } from "date-fns";
import { PageLoader } from "@/components/ui/PageLoader";
import { useUserRole } from "@/hooks/useUserRole";
import { DocSVG } from "@/assets/icons/Doc";
import { PdfSVG } from "@/assets/icons/Pdf";
import { ExcelSVG } from "@/assets/icons/Excel";
import PowerPointSVG from "@/assets/icons/PowerPoint";

// Safe date formatting utility
const safeFormatDate = (
  dateString: string | undefined,
  formatStr: string
): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return format(date, formatStr);
  } catch {
    return "N/A";
  }
};

// API Addendum Detail type
type AddendumDetail = {
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

interface AddendumDetailsSheetProps {
  addendum: {
    id: string;
    title: string;
    linkedQuestion: boolean;
    datePublished: string;
    status: "draft" | "publish";
  };
  solicitationId: string;
  onClose: () => void;
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const AddendumDetailsSheet: React.FC<AddendumDetailsSheetProps> = ({
  addendum,
  solicitationId,
  // onClose,
}) => {
  // Get user role
  const { isVendor } = useUserRole();
  // Fetch detailed addendum data from API
  const {
    data: addendumDetailData,
    isLoading,
    error,
  } = useQuery<ApiResponse<AddendumDetail>, ApiResponseError>({
    queryKey: ["addendum-detail", solicitationId, addendum.id],
    queryFn: async () => {
      // Use different API endpoint based on user role
      const endpoint = isVendor
        ? `/vendor/solicitations/${solicitationId}/addendums/${addendum.id}` // Vendor-specific endpoint
        : `/procurement/solicitations/${solicitationId}/addendums/${addendum.id}`; // Default procurement endpoint

      return await getRequest({ url: endpoint });
    },
    enabled: !!solicitationId && !!addendum.id,
  });

  const addendumDetail = addendumDetailData?.data?.data;
  // Helper function to get file extension from name or type
  const getFileExtension = (fileName: string, fileType: string): string => {
    const extension = fileName.split(".").pop()?.toUpperCase();
    if (extension) return extension;

    // Fallback to type if no extension in name
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("doc")) return "DOC";
    if (fileType.includes("excel") || fileType.includes("sheet")) return "XLS";
    if (fileType.includes("powerpoint") || fileType.includes("presentation"))
      return "PPT";

    return "FILE";
  };

  const getFileIcon = (fileExtension: string) => {
    switch (fileExtension) {
      case "DOC":
      case "DOCX":
        return <DocSVG />;
      case "PDF":
        return <PdfSVG />;
      case "XLS":
      case "XLSX":
        return <ExcelSVG />;
      case "PPT":
      case "PPTX":
        return <PowerPointSVG />;
      default:
        return <DocSVG />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <SheetHeader className="flex flex-row items-center justify-between p-6">
        <SheetTitle className="text-lg font-semibold text-gray-900 ">
          Addendum Details
        </SheetTitle>
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button> */}
      </SheetHeader>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Title and Status */}
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            {addendum.title}
          </h2>
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-0 capitalize">
            {addendum.status}
          </Badge>
        </div>

        {/* Date and Time */}
        <div className="text-sm text-gray-500">
          {addendumDetail
            ? safeFormatDate(addendumDetail.createdAt, "MMMM d, yyyy")
            : addendum.datePublished}
        </div>

        {/* Loading State */}
        {isLoading && (
          <PageLoader
            showHeader={false}
            message="Loading addendum details..."
            className="py-8"
          />
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-600 dark:text-red-400">
              Failed to load addendum details. Please try again.
            </div>
          </div>
        )}

        {/* Addendum Details Section */}
        {addendumDetail && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Addendum Details
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Addendum Title
                </h4>
                <p className="text-sm font-medium text-gray-900">
                  {addendumDetail.title}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Publish Date
                </h4>
                <p className="text-sm font-medium text-gray-900">
                  {safeFormatDate(addendumDetail.createdAt, "MMMM d, yyyy")}
                </p>
              </div>
              {addendumDetail.submissionDeadline && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Submissions Deadline
                  </h4>
                  <p className="text-sm font-medium text-gray-900">
                    {safeFormatDate(
                      addendumDetail.submissionDeadline,
                      "MMMM d, yyyy"
                    )}{" "}
                    |{" "}
                    {safeFormatDate(
                      addendumDetail.submissionDeadline,
                      "h:mm a"
                    )}
                  </p>
                </div>
              )}
              {addendumDetail.questionDeadline && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Question Acceptance Deadline
                  </h4>
                  <p className="text-sm font-medium text-gray-900">
                    {safeFormatDate(
                      addendumDetail.questionDeadline,
                      "MMMM d, yyyy"
                    )}{" "}
                    |{" "}
                    {safeFormatDate(addendumDetail.questionDeadline, "h:mm a")}
                  </p>
                </div>
              )}
            </div>

            {addendumDetail.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-900 leading-relaxed dark:text-gray-200">
                  {addendumDetail.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Linked Question Section */}
        {addendumDetail?.questions && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-400">
              Linked Question
            </h3>

            <div className="space-y-3">
              <div className="text-xs text-gray-500">
                {safeFormatDate(addendumDetail.createdAt, "MMMM d, yyyy")} •{" "}
                {safeFormatDate(addendumDetail.createdAt, "h:mm a")}
              </div>
              <p className="text-sm text-gray-900 leading-relaxed dark:text-gray-200">
                {addendumDetail.questions}
              </p>
            </div>
          </div>
        )}

        {/* Uploaded Documents Section */}
        {addendumDetail?.files && addendumDetail.files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-400">
              Uploaded Documents
            </h3>

            <div className="space-y-3">
              {addendumDetail.files.map((file) => {
                const fileExtension = getFileExtension(file.name, file.type);
                return (
                  <div
                    key={file._id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(fileExtension)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {fileExtension} • {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {fileExtension === "PDF" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(file.url, "_blank")}
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = file.url;
                          link.download = file.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddendumDetailsSheet;
