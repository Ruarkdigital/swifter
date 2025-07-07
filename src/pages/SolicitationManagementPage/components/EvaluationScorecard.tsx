import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEvaluationScorecard, EvaluationCriteria } from "../hooks/useEvaluationScorecard";

interface EvaluationScorecardProps {
  solicitationId: string;
  evaluatorId: string;
  evaluatorData?: {
    name: string;
    email: string;
    submissionDate: string;
    status: string;
    evaluationScore: number;
  };
}

const EvaluationScorecard: React.FC<EvaluationScorecardProps> = ({
  solicitationId,
  evaluatorId,
  evaluatorData,
}) => {
  const { data: scorecardData, isLoading, error } = useEvaluationScorecard(
    solicitationId,
    evaluatorId
  );

  // Use API data if available, otherwise fallback to prop data
  const displayData = scorecardData?.data?.evaluator || evaluatorData;
  const criteriaData = scorecardData?.data?.criteria || [];

  if (isLoading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-gray-600">Loading evaluation scorecard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load evaluation scorecard</p>
          <p className="text-gray-500 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">No evaluation data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 bg-gray-50">
        <div className="w-6 h-6">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M9 18L15 12L9 6"
              stroke="#1F2937"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Evaluation Scorecard
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-6 overflow-y-auto h-[calc(100vh-120px)]">
        {/* Evaluator Details Section */}
        <div className="rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Evaluator Details
            </h3>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-gray-600 border-gray-300 rounded-xl px-4 py-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Export</span>
            </Button>
          </div>

          <div className="space-y-4">
            {/* Row 1 */}
            <div className="flex justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Evaluator Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {displayData.name}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Contact</p>
                <p className="text-sm text-blue-600">{displayData.email}</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Submission Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {displayData.submissionDate}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="inline-flex items-center px-3 py-1 rounded-xl bg-green-100">
                  <span className="text-sm font-medium text-green-700">
                    {displayData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Evaluation Score</p>
                <p className="text-sm font-medium text-gray-900">
                  {displayData.evaluationScore}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Criterion Breakdown Section */}
        <div className="rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Evaluation Criterion Breakdown
            </h3>
          </div>

          <Accordion type="multiple" className="w-full">
            {criteriaData.length > 0 ? (
              criteriaData.map((criteria: EvaluationCriteria, index: number) => (
                <AccordionItem key={criteria.id || index} value={criteria.id || `criteria-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex justify-between items-center w-full pr-4">
                      <span className="font-medium">{criteria.title}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          Weight: {criteria.weight}%
                        </span>
                        <span className="text-sm font-medium">
                          Score: {criteria.score}/100
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 space-y-3">
                      <p className="text-sm text-gray-600">
                        {criteria.description}
                      </p>
                      {criteria.comments && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Comments:
                          </p>
                          <p className="text-sm text-gray-600">
                            {criteria.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              // Fallback to static data if no API data available
              <>
              </>
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default EvaluationScorecard;
