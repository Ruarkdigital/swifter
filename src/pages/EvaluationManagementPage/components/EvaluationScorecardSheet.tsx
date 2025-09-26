import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useEvaluationScorecard } from "../hooks/useEvaluationScorecard";
import { formatDateTZ } from "@/lib/utils";
import { getEvaluationStatusLabel, getEvaluationStatusColorClass } from "@/lib/evaluationStatusUtils";

interface EvaluationScorecardSheetProps {
  evaluatorId: string;
  solicitationId: string;
  timezone?: string;
}

const EvaluationScorecardSheet: React.FC<EvaluationScorecardSheetProps> = ({
  evaluatorId,
  solicitationId,
  timezone,
}) => {
  const {
    data: scorecardData,
    isLoading,
    error,
  } = useEvaluationScorecard(solicitationId, evaluatorId, false); // disabled by default

  const [isOpen, setIsOpen] = React.useState(false);

  // Enable the query when the sheet is opened
  const {
    data: scorecardDataEnabled,
    isLoading: isLoadingEnabled,
    error: errorEnabled,
  } = useEvaluationScorecard(solicitationId, evaluatorId, isOpen);
  const activeData = isOpen ? scorecardDataEnabled : scorecardData;
  const activeLoading = isOpen ? isLoadingEnabled : isLoading;
  const activeError = isOpen ? errorEnabled : error;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-0 h-auto font-normal"
        >
          View
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Evaluation Scorecard</h2>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Loading State */}
            {activeLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading scorecard data...</span>
              </div>
            )}

            {/* Error State */}
            {activeError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 m-6">
                <p className="text-red-800 dark:text-red-200">
                  Error loading scorecard data. Please try again.
                </p>
              </div>
            )}

            {/* Content */}
            {activeData && !activeLoading && !activeError && (
              <>
                {/* Evaluator Details Section */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Evaluator Details</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Evaluator Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activeData.data.evaluator.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contact</p>
                      <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">{activeData.data.evaluator.email}</p>
                    </div>
                    <div>
                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Submission Date</p>
                       <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                         {activeData.data.evaluator.submission
                           ? formatDateTZ(new Date(activeData.data.evaluator.submission), "MMMM dd, yyyy", timezone)
                           : "N/A"}
                       </p>
                     </div>
                     <div>
                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                       <Badge className={getEvaluationStatusColorClass(activeData.data.evaluator.status)}>
                         {getEvaluationStatusLabel(activeData.data.evaluator.status)}
                       </Badge>
                     </div>
                     <div className="col-span-2">
                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Evaluation Score</p>
                       <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeData.data.evaluator.score}%</p>
                     </div>
                  </div>
                </div>

                {/* Evaluation Criterion Breakdown */}
                <div className="p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">Evaluation Criterion Breakdown</h3>
                  
                  {activeData.data.criteria.map((criterion, index) => (
                     <div key={index} className="border rounded-lg mb-4">
                       <div className="flex items-center justify-between p-4">
                         <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                           {criterion?.title || `Criterion ${index + 1}`}
                         </span>
                       </div>
                       <div className="px-4 pb-4 border-t">
                         <div className="grid grid-cols-2 gap-4 mb-4">
                           <div>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weight (%)</p>
                             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                               {criterion.criteria?.weight || "N/A"}
                             </p>
                           </div>
                           <div>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Score Given</p>
                             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{criterion.score}</p>
                           </div>
                         </div>
                         <div>
                           <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comments</p>
                           <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                             {criterion.comment || "No comments provided"}
                           </p>
                         </div>
                       </div>
                     </div>
                   ))}


                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EvaluationScorecardSheet;