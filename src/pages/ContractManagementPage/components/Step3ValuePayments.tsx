import React from "react";
import { Button } from "@/components/ui/button";
import { Forger, useFieldArray } from "@/lib/forge";
import {
  TextCurrencyInput,
  TextSelect,
  TextInput,
  TextDatePicker,
} from "@/components/layouts/FormInputs";
import { useWatch, Control } from "react-hook-form";
import { CreateContractFormData } from "./CreateContractSheet";

type Props = { 
  control: Control<CreateContractFormData>;
  paymentTermOptions: Array<{ label: string; value: string }>;
};

const Step3ValuePayments: React.FC<Props> = ({ control, paymentTermOptions }) => {
  const paymentStructure = useWatch({ control, name: "paymentStructure" });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
    inputProps: []
  });

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Forger
        name="contractValue"
        label="Contract Value ($)"
        placeholder="Enter Amount"
        component={TextCurrencyInput}
      />
      <Forger
        name="contingency"
        label="Contingency"
        placeholder="Enter Contingency"
        component={TextInput}
      />
      <Forger
        name="holdback"
        label="Holdback (Optional)"
        component={TextSelect}
        options={[
          { label: "10%", value: "10%" },
          { label: "5%", value: "5%" },
          { label: "0%", value: "0%" },
        ]}
      />
      <Forger
        name="paymentStructure"
        label="Payment Structure"
        component={TextSelect}
        options={[
          { label: "Monthly", value: "monthly" },
          { label: "Milestone", value: "milestone" },
          { label: "Lump Sum", value: "lump_sum" },
        ]}
      />

      {paymentStructure === "milestone" && (
        <div className="col-span-2 space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
            >
              <Forger
                name={`milestones.${index}.name`}
                label="Milestone Name"
                placeholder={`Milestone ${index + 1}`}
                component={TextInput}
              />
              <Forger
                name={`milestones.${index}.amount`}
                label="Amount ($)"
                placeholder="Enter Amount"
                component={TextCurrencyInput}
              />
              <Forger
                name={`milestones.${index}.dueDate`}
                label="Due Date"
                component={TextDatePicker}
              />
              <button
                type="button"
                className="text-xs text-red-600"
                onClick={() => remove(index)}
              >
                Remove Milestone
              </button>
            </div>
          ))}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: `Milestone ${fields.length + 1}`,
                  amount: "",
                  dueDate: undefined,
                })
              }
            >
              + Add Milestone
            </Button>
          </div>
        </div>
      )}

      <Forger
        name="paymentTerm"
        label="Payment Term"
        placeholder="Select Type"
        component={TextSelect}
        options={paymentTermOptions}
      />
    </div>
  );
};

export default Step3ValuePayments;
