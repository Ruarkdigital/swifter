import React from "react";
import { Forger } from "@/lib/forge";
import { TextDatePicker, TextInput, TextSelect } from "@/components/layouts/FormInputs";

type Props = {
  termTypeOptions: Array<{ label: string; value: string }>;
};

const Step4Timeline: React.FC<Props> = ({ termTypeOptions }) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Forger
        name="effectiveDate"
        label="Contract Effective Date"
        component={TextDatePicker}
        placeholder="Select Date"
        helperText="Could be in the past, present or future."
      />
      <Forger
        name="endDate"
        label="End Date"
        component={TextDatePicker}
        placeholder="Select Date"
      />
      <Forger
        name="duration"
        label="Duration"
        placeholder="Duration"
        disabled={true}
        component={TextInput}
        containerClass="md:col-span-2"
      />
      <Forger
        name="termType"
        label="Term Type"
        placeholder="Select Type"
        component={TextSelect}
        options={termTypeOptions}
        containerClass="md:col-span-2"
      />
    </div>
  );
};

export default Step4Timeline;
