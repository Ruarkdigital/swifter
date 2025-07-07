import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ExportReportSheet: React.FC = () => {
  const [exportFormat, setExportFormat] = useState("PDF");
  const [selectedSections, setSelectedSections] = useState({
    solicitationDetails: true,
    submission: true,
    criteria: true,
    scoringSummary: true,
    submissionScores: true,
    submissionScoresComments: true,
  });

  const handleSectionChange = (section: string, checked: boolean) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: checked
    }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" variant="outline" className="space-x-4 rounded-xl">
          <Share2 className="h-4 w-4 mr-3" />
          Export
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Export Report
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Solicitation Overview */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Solicitation Overview
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="solicitation-details"
                  checked={selectedSections.solicitationDetails}
                  onCheckedChange={(checked) => handleSectionChange('solicitationDetails', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="solicitation-details" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    Solicitation Details
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Overview of the solicitation dates, highest ranking vendor, and NDA + COI forms
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="submission"
                  checked={selectedSections.submission}
                  onCheckedChange={(checked) => handleSectionChange('submission', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="submission" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    Submission
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    List of the Vendors (Email Address, Name) that submitted for this Project
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="criteria"
                  checked={selectedSections.criteria}
                  onCheckedChange={(checked) => handleSectionChange('criteria', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="criteria" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    Criteria
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    List of the Criteria (Title, Scoring Type, Description) for this project.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="scoring-summary"
                  checked={selectedSections.scoringSummary}
                  onCheckedChange={(checked) => handleSectionChange('scoringSummary', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="scoring-summary" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    Scoring Summary
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Scoring Summary Table (Submission and Criteria Scores)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="submission-scores"
                  checked={selectedSections.submissionScores}
                  onCheckedChange={(checked) => handleSectionChange('submissionScores', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="submission-scores" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    Submission Scores
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Scoring summary tables per submission
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="submission-scores-comments"
                  checked={selectedSections.submissionScoresComments}
                  onCheckedChange={(checked) => handleSectionChange('submissionScoresComments', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="submission-scores-comments" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    Submission Scores Comments
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Scoring summary comment tables per submission
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Export Format */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Export Format
            </h3>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Excel">Excel</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4">
          <Button className="w-full ">
            Download Report
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExportReportSheet;