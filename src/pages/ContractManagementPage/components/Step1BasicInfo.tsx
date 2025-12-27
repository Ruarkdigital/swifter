import React from "react";
import { Forger } from "@/lib/forge";
import {
  TextInput,
  TextSelect,
  TextArea,
} from "@/components/layouts/FormInputs";

const Step1BasicInfo: React.FC = () => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Forger
        name="name"
        label="Contract Name"
        placeholder="Enter Title"
        component={TextInput}
        data-testid="contract-name-input"
      />
      <Forger
        name="relationship"
        label="Contract Relationship"
        placeholder="Select Type"
        component={TextSelect}
        options={[
          { label: "Master Service Agreement (MSA)", value: "msa" },
          { label: "Link to an existing MSA", value: "link_msa" },
          { label: "Link to an existing Project", value: "link_project" },
          { label: "Stand-Alone Project", value: "standalone" },
        ]}
        data-testid="contract-relationship-select"
      />
      <Forger
        name="project"
        label="Select Project"
        placeholder="Select"
        component={TextSelect}
        options={[
          { label: "Project A", value: "project_a" },
          { label: "Project B", value: "project_b" },
        ]}
        data-testid="select-project-select"
      />
      <Forger
        name="type"
        label="Contract Type"
        placeholder="Select Type"
        component={TextSelect}
        options={[
          { label: "Fixed Price/Lump Sum", value: "fixed_price" },
          { label: "Time & Material", value: "time_material" },
          { label: "Retainer", value: "retainer" },
          { label: "Cost Plus", value: "cost_plus" },
          { label: "Cost Reimbursable", value: "cost_reimbursable" },
          { label: "Unit Rate", value: "unit_rate" },
          { label: "Target Price", value: "target_price" },
        ]}
        data-testid="contract-type-select"
      />
      <Forger
        name="category"
        label="Category"
        placeholder="Select"
        component={TextSelect}
        options={[
          { label: "Legal", value: "legal" },
          { label: "IT Operations", value: "it_ops" },
          { label: "Office Supplies", value: "office_supplies" },
        ]}
        data-testid="contract-category-select"
      />
      <Forger
        name="manager"
        label="Contract Manager"
        placeholder="Enter Title"
        component={TextInput}
        data-testid="contract-manager-input"
      />
      <Forger
        name="jobTitle"
        label="Job Title"
        placeholder="Enter Title"
        component={TextInput}
        data-testid="job-title-input"
      />
      <Forger
        name="contractId"
        label="Contract ID/Number"
        placeholder="Enter Title"
        component={TextInput}
        data-testid="contract-id-input"
      />
      <Forger
        name="description"
        label="Description"
        placeholder="Enter Detail"
        component={TextArea}
        data-testid="description-input"
      />
    </div>
  );
};

export default Step1BasicInfo;
