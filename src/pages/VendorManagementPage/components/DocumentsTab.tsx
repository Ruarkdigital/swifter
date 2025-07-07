import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { DocSVG } from "@/assets/icons/Doc";
import { PdfSVG } from "@/assets/icons/Pdf";
import { ExcelSVG } from "@/assets/icons/Excel";
import { cn } from "@/lib/utils";

export type VendorDocument = {
  id: string;
  name: string;
  type: "DOC" | "PDF" | "XLS";
  size: string;
  uploadDate: string;
};

const generateVendorDocuments = (): VendorDocument[] => {
  return [
    { id: "1", name: "CAC_Certificate", type: "DOC", size: "25KB", uploadDate: "2025-04-15" },
    { id: "2", name: "Tax_Clearance_2023", type: "PDF", size: "1MB", uploadDate: "2025-04-10" },
    { id: "3", name: "NDPR_Compliance", type: "XLS", size: "3MB", uploadDate: "2025-04-08" },
  ];
};

export const DocumentsTab: React.FC = () => {
  const documents = generateVendorDocuments();

  const getFileIcon = (type: VendorDocument["type"]) => {
    switch (type) {
      case "DOC": return <DocSVG />;
      case "PDF": return <PdfSVG />;
      case "XLS": return <ExcelSVG />;
      default: return <DocSVG />;
    }
  };

  return (
    <div className="pt-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor's Documents</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((document) => (
          <Card key={document.id} className="border hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0">{getFileIcon(document.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{document.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{document.type}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{document.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Button variant="ghost" size="icon" className={cn("h-8 w-8 p-0 bg-gray-100 rounded-full hover:bg-gray-200")} title="View">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0 bg-blue-100 rounded-full hover:bg-blue-200" title="Download">
                    <Download className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentsTab;