import React from "react";
import { Forger } from "@/lib/forge";
import { TextDatePicker, TextInput, TextSelect } from "@/components/layouts/FormInputs";
import { useWatch, Control } from "react-hook-form";
import { CreateContractFormData } from "./CreateContractSheet";

type Props = {
  control: Control<CreateContractFormData>;
};

const Step6ComplianceSecurity: React.FC<Props> = ({ control }) => {
  const security = useWatch({ control, name: "contractSecurity" });

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Forger
        name="insuranceRequirement"
        label="Insurance Requirement"
        placeholder="Enter Title"
        component={TextInput}
      />
      <Forger
        name="insuranceExpiryDate"
        label="Expiry Date"
        component={TextDatePicker}
        placeholder="Enter Title"
      />
      <Forger
        name="contractSecurity"
        label="Contract Security"
        placeholder="Yes / No"
        component={TextSelect}
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
        containerClass="md:col-span-2"
      />

      {security === "yes" && (
        <>
          <Forger
            name="securityType"
            label="Security Type"
            placeholder="Enter Title"
            component={TextSelect}
            options={[
              { label: "Letter of Credit", value: "letter_of_credit" },
              { label: "Bank Guarantee", value: "bank_guarantee" },
              { label: "Performance Bond", value: "performance_bond" },
              { label: "Labour & Material Bond", value: "labour_material_bond" },
            ]}
            containerClass="md:col-span-2"
          />
          <Forger
            name="securityAmount"
            label="Amount"
            placeholder="Enter Title"
            component={TextInput}
            containerClass="md:col-span-2"
          />
          <Forger
            name="securityDueDate"
            label="Due Date"
            component={TextDatePicker}
            placeholder="Enter Title"
          />
          <Forger
            name="securityExpiryDate"
            label="Expiry Date"
            component={TextDatePicker}
            placeholder="Enter Title"
          />
        </>
      )}
    </div>
  );
};

export default Step6ComplianceSecurity;
