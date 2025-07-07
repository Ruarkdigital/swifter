import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Share2, ArrowLeft, X, ChevronDown } from "lucide-react";

interface EvaluationScorecardSheetProps {
  evaluator: {
    name: string;
    email: string;
  };
}

const EvaluationScorecardSheet: React.FC<EvaluationScorecardSheetProps> = ({ evaluator }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-0 h-auto font-normal"
        >
          View
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="p-1">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Evaluation Scorecard</h2>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Evaluator Details Section */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Evaluator Details</h3>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Evaluator Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{evaluator.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contact</p>
                  <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">{evaluator.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Submission Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">April 30, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Completed
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Evaluation Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">87%</p>
                </div>
              </div>
            </div>

            {/* Evaluation Criterion Breakdown */}
            <div className="p-6">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">Evaluation Criterion Breakdown</h3>
              
              {/* Technical Proposal */}
              <div className="border rounded-lg mb-4">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Technical Proposal</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="px-4 pb-4 border-t">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weight (%)</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">60%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Score Given</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">85</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comments</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      "Lorem ipsum dolor sit amet consectetur. Volutpat quis egestas nunc egestas ut sed accumsan commodo vitae. Ullamcorper feugiat pulvinar consectetur vel natoque amet enim ac sed. Laoreet fringilla sollicitudin pharetra sit proin dictum. Sit sed lorem mauris."
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Offer */}
              <div className="border rounded-lg mb-4">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Financial Offer</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="px-4 pb-4 border-t">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weight (%)</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">30%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Score Given</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">90</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comments</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      "Lorem ipsum dolor sit amet consectetur. Volutpat quis egestas nunc egestas ut sed accumsan commodo vitae. Ullamcorper feugiat pulvinar consectetur vel natoque amet enim ac sed. Laoreet fringilla sollicitudin pharetra sit proin dictum. Sit sed lorem mauris."
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="border rounded-lg mb-4">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Delivery Timeline</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="px-4 pb-4 border-t">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weight (%)</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">10%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Score Given</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">88</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comments</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      "Lorem ipsum dolor sit amet consectetur. Volutpat quis egestas nunc egestas ut sed accumsan commodo vitae. Ullamcorper feugiat pulvinar consectetur vel natoque amet enim ac sed. Laoreet fringilla sollicitudin pharetra sit proin dictum. Sit sed lorem mauris."
                    </p>
                  </div>
                </div>
              </div>

              {/* Comment Summary */}
              <div className="border rounded-lg">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Comment Summary</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="px-4 pb-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comments</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      "Clear technical flow"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EvaluationScorecardSheet;