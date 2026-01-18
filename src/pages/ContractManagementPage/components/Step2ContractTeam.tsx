import React from "react";
import { Forger } from "@/lib/forge";
import {
  TextInput,
  TextSelect,
  TextTagInput,
} from "@/components/layouts/FormInputs";

type Props = {
  internalStakeholderOptions?: Array<{ label: string; value: string }>;
};

const Step2ContractTeam: React.FC<Props> = ({
  internalStakeholderOptions = [],
}) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Forger
          name="manager"
          label="Contract Manger"
          placeholder="Enter Title"
          component={TextInput}
        />
        <Forger
          name="jobTitle"
          label="Job Title"
          placeholder="Enter Title"
          component={TextInput}
        />
      </div>
      <Forger
        name="vendor"
        label="Vendor / Contractor"
        placeholder="Enter Name"
        component={TextInput}
        // helperText="Add with email address, Vendor name"
      />
      <Forger
        name="personnel"
        label="Vendor/Contractor Key Personnel. (Multi-Select)"
        component={TextTagInput}
        enableDetailsPopover
        helperText="Add vendor’s/contractor’s key personnel with email address, name"
      />
      <Forger
        name="internalTeam"
        label="Internal Team/Stakeholders (Multi-Select)"
        component={TextTagInput}
        enableDetailsPopover
        options={internalStakeholderOptions}
        helperText="Add with email address, name"
      />
      <Forger
        name="visibility"
        label="Visibility"
        placeholder="Private, Public"
        component={TextSelect}
        options={[
          { label: "Private", value: "private" },
          { label: "Public", value: "public" },
        ]}
      />
    </div>
  );
};

export default Step2ContractTeam;
