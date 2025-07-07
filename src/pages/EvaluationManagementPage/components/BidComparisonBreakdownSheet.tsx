import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronLeft, Share2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { useState } from "react";

type ProposalPriceAction = {
  component: string;
  description: string;
  quantity: number;
  unitOfMeasurement: string;
  unitPrice: number;
  subtotal: number;
  subItems?: ProposalPriceAction[];
};

type ProposalData = {
  vendorName?: string;
  vendorEmail?: string;
  total?: number;
  score?: number;
  submission?: string;
  rank?: string;
  priceAction?: ProposalPriceAction[];
};

interface BidComparisonSheetProps {
  proposalId: string;
  vendorName?: string;
}

export const BidComparisonSheet = ({ proposalId }: BidComparisonSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {  } = useQuery({
    queryKey: ["proposal-details", proposalId],
    queryFn: async () => {
      const response = await getRequest({ url: `/procurement/evaluations/proposal/${proposalId}` });
      return response.data as ProposalData;
    },
    enabled: isOpen && !!proposalId,
  });



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
      <SheetContent className="w-full max-w-4xl p-0 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-medium text-gray-900">
              Price Breakdown
            </h2>
          </div>
          <X className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Export */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Zenith Solutions Price Breakdown
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Company and Submission Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Submitted by</p>
              <p className="text-base font-medium text-gray-900">
                Zenith Solutions
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Submission Date</p>
              <p className="text-base text-gray-900">April 30, 2025</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Evaluation Score</p>
              <p className="text-base font-semibold text-gray-900">87%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Rank</p>
              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 font-medium px-3 py-1">
                Best Price
              </Badge>
            </div>
          </div>

          {/* Price Breakdown Table */}
          <div className="border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-gray-700">
                <div className="col-span-3">Line Item / Component</div>
                <div className="col-span-3">Description (Optional)</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Subtotal</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-white">
              <div className="grid grid-cols-12 gap-4 px-4 py-4 border-b text-sm">
                <div className="col-span-3 text-gray-900">Hardware Supply</div>
                <div className="col-span-3 text-gray-600">
                  50 laptops, Dell Inspiron
                </div>
                <div className="col-span-2 text-gray-900">50</div>
                <div className="col-span-2 text-gray-900">$600.00</div>
                <div className="col-span-2 text-gray-900 font-medium">
                  $30,000.00
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 px-4 py-4 border-b text-sm">
                <div className="col-span-3 text-gray-900">
                  Software Licenses
                </div>
                <div className="col-span-3 text-gray-600">
                  Annual licenses for MS 365
                </div>
                <div className="col-span-2 text-gray-900">50</div>
                <div className="col-span-2 text-gray-900">$120.00</div>
                <div className="col-span-2 text-gray-900 font-medium">
                  $6,000.00
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 px-4 py-4 border-b text-sm">
                <div className="col-span-3 text-gray-900">
                  Installation Services
                </div>
                <div className="col-span-3 text-gray-600">
                  Onsite setup across 3 locations
                </div>
                <div className="col-span-2 text-gray-900">3</div>
                <div className="col-span-2 text-gray-900">$1,200.00</div>
                <div className="col-span-2 text-gray-900 font-medium">
                  $3,600.00
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 px-4 py-4 border-b text-sm">
                <div className="col-span-3 text-gray-900">Training</div>
                <div className="col-span-3 text-gray-600">
                  2-day training for staff
                </div>
                <div className="col-span-2 text-gray-900">2</div>
                <div className="col-span-2 text-gray-900">$2,500.00</div>
                <div className="col-span-2 text-gray-900 font-medium">
                  $5,000.00
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 px-4 py-4 text-sm">
                <div className="col-span-3 text-gray-900">
                  Support & Maintenance
                </div>
                <div className="col-span-3 text-gray-600">
                  12-month support package
                </div>
                <div className="col-span-2 text-gray-900">1</div>
                <div className="col-span-2 text-gray-900">$1,200.00</div>
                <div className="col-span-2 text-gray-900 font-medium">
                  $1,200.00
                </div>
              </div>
            </div>

            {/* Total Row */}
            <div className="bg-white border-t">
              <div className="grid grid-cols-12 gap-4 px-4 py-4">
                <div className="col-span-10"></div>
                <div className="col-span-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      45,800.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" className="px-6">
              Download
            </Button>
            <Button className="px-6 bg-blue-900 hover:bg-blue-800">
              Print
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
