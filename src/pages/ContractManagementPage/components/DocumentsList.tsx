import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Doc = {
  name: string;
  type: "DOC" | "PDF" | "XLS" | "ZIP";
  size: string;
};

const docs: Doc[] = [
  { name: "RFP_HRSoftware", type: "DOC", size: "25KB" },
  { name: "RFP_HRSoftware", type: "PDF", size: "1MB" },
  { name: "RFP_HRSoftware", type: "XLS", size: "3MB" },
  { name: "RFP_HRSoftware", type: "ZIP", size: "278MB" },
];

const typeColor: Record<Doc["type"], string> = {
  DOC: "bg-blue-100 text-blue-700",
  PDF: "bg-red-100 text-red-700",
  XLS: "bg-green-100 text-green-700",
  ZIP: "bg-emerald-100 text-emerald-700",
};

const DocumentsList: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-slate-700">All Documents</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((d, i) => (
          <Card key={`${d.name}-${i}`} className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-md flex items-center justify-center ${typeColor[d.type]}`}>{d.type}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{d.name}</p>
                <p className="text-xs text-slate-500">{d.type} • {d.size}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" aria-label="Preview"><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" aria-label="Download"><Download className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentsList;

