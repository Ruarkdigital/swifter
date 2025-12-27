import React from "react";
import { Forger } from "@/lib/forge";
import { TextFileUploader } from "@/components/layouts/FormInputs";

const Step5Documents: React.FC = () => {
  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm font-medium text-slate-700">Upload Files</p>
      <Forger name="documents" label="" component={TextFileUploader} />
    </div>
  );
};

export default Step5Documents;

