import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetContent } from "@/components/ui/sheet";
import { Eye, Download, CornerDownRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { PageLoader } from "@/components/ui/PageLoader";
import { DocumentViewer } from "@/components/ui/DocumentViewer";
import { getFileExtension } from "@/lib/fileUtils.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

type Action = {
  component?: string;
  description?: string;
  quantity?: number;
  unitOfMeasurement?: string;
  unitPrice?: number;
  subtotal?: number;
  subItems?: Action[];
}

// Proposal Detail type based on API response
type ProposalDetail = {
  _id: string;
  requiredDoc: Array<{
    _id: string;
    files: Array<{
      name: string;
      url: string;
      type: string;
      size: string;
      uploadedAt: string;
    }>;
  }>;
  action: Action[]
  total: number;
  status: "draft" | "submit";
  createdAt: string;
  updatedAt: string;
};

interface ProposalDetailsSheetProps {
  proposalId: string;
  onClose: () => void;
  solicitationId?: string;
  solicitationName?: string;
}

// Helper function to format file size
const formatFileSize = (sizeStr: string): string => {
  const bytes = parseInt(sizeStr);
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file icon based on type
const getFileIcon = (type: string) => {
  const fileType = type.toLowerCase();
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('doc') || fileType.includes('docx')) return '📝';
  if (fileType.includes('xls') || fileType.includes('xlsx')) return '📊';
  if (fileType.includes('zip') || fileType.includes('rar')) return '🗜️';
  return '📎';
};

const ProposalDetailsSheet: React.FC<ProposalDetailsSheetProps> = ({
  proposalId,
  solicitationId,
  solicitationName,
  onClose,
}) => {
  // Document viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; name: string; type: string } | null>(null);

  // Fetch proposal details
  const {
    data: proposalData,
    isLoading,
    error,
  } = useQuery<ApiResponse<ProposalDetail>, ApiResponseError>({
    queryKey: ["proposal-details", proposalId],
    queryFn: () => getRequest({ url: `/vendor/proposal/${proposalId}` }),
    enabled: !!proposalId,
  });

  const proposal = proposalData?.data;

  // Handle document viewing
  const handleViewDocument = (file: { url: string; name: string; type: string }) => {
    setSelectedDocument(file);
    setViewerOpen(true);
  };

  // Helper: render price breakdown item with optional nested subItems
  const renderPriceItem = (item: any, index: number, isSubItem = false) => (
    <div key={`${item?.component ?? 'item'}-${index}`} className={`space-y-2 ${isSubItem ? 'ml-6' : ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="sm:col-span-3 min-w-0 flex items-center gap-2">
          {isSubItem && <CornerDownRight className="text-gray-400 h-4 w-4" />}
          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{item?.component ?? '-'}</span>
        </div>
        <div className="sm:col-span-3 min-w-0">
          <div className="text-gray-600 dark:text-gray-400 truncate">{item?.description ?? '-'}</div>
        </div>
        <div className="sm:col-span-2 min-w-0">
          <div className="text-center text-gray-900 dark:text-gray-100">{item?.quantity ?? '-'}</div>
        </div>
        <div className="sm:col-span-2 min-w-0">
          <div className="text-gray-900 dark:text-gray-100 truncate">{item?.unitOfMeasurement ?? '-'}</div>
        </div>
        <div className="sm:col-span-1 min-w-0">
          <div className="text-right text-gray-900 dark:text-gray-100 px-3">{formatCurrency(item?.unitPrice ?? 0, "en-US", "USD")}</div>
        </div>
        <div className="sm:col-span-1 min-w-0">
          <div className="text-right font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(item?.subtotal ?? 0, "en-US", "USD")}</div>
        </div>
      </div>

      {Array.isArray(item?.subItems) && item.subItems.length > 0 && (
        <div className="space-y-2">
          {item.subItems.map((sub: any, subIndex: number) => renderPriceItem(sub, subIndex, true))}
        </div>
      )}
    </div>
  );

  // Helper: compute total from action items when proposal.total is not present
  const computeTotalFromActions = (items: any[]): number => {
    if (!Array.isArray(items)) return 0;
    const sumWithChildren = (arr: any[]): number =>
      arr.reduce((sum, itm) => {
        const own = typeof itm?.subtotal === 'number' ? itm.subtotal : 0;
        const children = Array.isArray(itm?.subItems) ? sumWithChildren(itm.subItems) : 0;
        return sum + own + children;
      }, 0);
    return sumWithChildren(items);
  };

  if (isLoading) {
    return (
      <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto">
        <PageLoader 
          showHeader={false}
          message="Loading proposal details..."
          className="px-6"
        />
      </SheetContent>
    );
  }

  if (error || !proposal) {
    return (
      <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">Failed to load proposal details</p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    );
  }

  return (
    <SheetContent className="!max-w-6xl overflow-y-auto">
      {/* Header */}
      <SheetHeader className="pb-4 mb-6">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Proposal Details
          </SheetTitle>
        </div>
      </SheetHeader>

      <div className="space-y-6">
        {/* Solicitation Info */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Solicitation ID</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{solicitationId || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Solicitation Name</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{solicitationName || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div>
          <Tabs defaultValue="documents" className="w-full bg-transparent">
            <TabsList className="h-auto rounded-none border-b border-gray-300 !bg-transparent p-0 w-full justify-start">
              <TabsTrigger value="documents"  className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
>Uploaded Documents</TabsTrigger>
              <TabsTrigger value="price"  className="data-[state=active]:border-[#2A4467] data-[state=active]:dark:bg-transparent data-[state=active]:dark:text-slate-100 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 border-0 border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex-none px-3"
>Price Breakdown</TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <div className="space-y-3">
                {proposal?.data.requiredDoc?.map((doc: any) =>
                  doc.files?.map((file: any, fileIndex: number) => (
                    <div
                      key={`${doc._id}-${fileIndex}`}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getFileIcon(file.type)}</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{file.type.toUpperCase()}</span>
                            <span>•</span>
                            <span>{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => handleViewDocument(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="price">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Price Breakdown
                </h3>
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <div className="col-span-3">Item / Component</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2">Unit of Measurement</div>
                  <div className="col-span-1 text-right">Unit Price</div>
                  <div className="col-span-1 text-right">Subtotal</div>
                </div>

                {/* Items */}
                <div className="space-y-3 mt-3">
                  {Array.isArray(proposal?.data?.action) && proposal?.data.action.length > 0 ? (
                    proposal?.data.action.map((item: any, idx: number) => renderPriceItem(item, idx))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No price breakdown available.</p>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Total</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(computeTotalFromActions(proposal?.data?.action || []), "en-US", "USD")}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

      </div>
      
      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedDocument(null);
          }}
          fileUrl={selectedDocument.url}
          fileName={selectedDocument.name}
          fileType={getFileExtension(selectedDocument.name, selectedDocument.type)}
        />
      )}
    </SheetContent>
  );
};

export default ProposalDetailsSheet;