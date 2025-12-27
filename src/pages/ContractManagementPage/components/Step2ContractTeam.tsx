import React from "react";
import { Forger } from "@/lib/forge";
import { TextInput, TextMultiSelect } from "@/components/layouts/FormInputs";

const Step2ContractTeam: React.FC = () => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4">
      <Forger
        name="manager"
        label="Contract Manager"
        placeholder="Enter Name"
        component={TextInput}
      />
      <Forger
        name="vendor"
        label="Vendor / Contractor"
        placeholder="Enter Name"
        component={TextInput}
      />
      <span className="text-xs text-slate-500">
        Add with email address, Vendor name, domain name
      </span>
      <Forger
        name="vendorKeyPersonnel"
        label="Vendor/Contractor Key Personnel. (Multi-Select)"
        component={TextMultiSelect}
        options={[]}
      />
      <span className="text-xs text-slate-500">
        Add with email address, name, domain name
      </span>
      <Forger
        name="internalStakeholders"
        label="Internal Team/Stakeholders (Multi-Select)"
        component={TextMultiSelect}
        options={[]}
      />
    </div>
  );
};

export default Step2ContractTeam;
