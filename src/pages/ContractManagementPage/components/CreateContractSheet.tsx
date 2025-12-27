import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Forge, useForge } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2ContractTeam from "./Step2ContractTeam";
import Step3ValuePayments from "./Step3ValuePayments";
import Step4Timeline from "./Step4Timeline";
import Step5Documents from "./Step5Documents";
import Step6ReviewPublish from "./Step6ReviewPublish";

type Props = {
  trigger: React.ReactNode;
};

const schema = yup.object({
  // Step 1: Basic Information
  name: yup.string().required("Contract name is required"),
  relationship: yup.string().required("Relationship is required"),
  project: yup.string().optional(),
  type: yup.string().required("Contract type is required"),
  category: yup.string().optional(),
  manager: yup.string().optional(),
  jobTitle: yup.string().optional(),
  contractId: yup.string().optional(),
  description: yup.string().optional(),

  // Step 2: Contract Team
  vendor: yup.string().optional(),
  vendorKeyPersonnel: yup.array().optional(),
  internalStakeholders: yup.array().optional(),

  // Step 3: Value & Payments
  contractValue: yup.mixed().optional(),
  contingency: yup.string().optional(),
  holdback: yup.string().optional(),
  paymentStructure: yup.string().optional(),
  paymentTerm: yup.string().optional(),
  milestones: yup
    .array(
      yup.object({
        name: yup.string().optional(),
        amount: yup.mixed().optional(),
        dueDate: yup.date().optional(),
      })
    )
    .optional(),

  // Step 4: Timeline
  effectiveDate: yup.date().optional(),
  endDate: yup.date().optional(),
  duration: yup.string().optional(),
  termType: yup.string().optional(),

  // Step 5: Documents
  documents: yup.array().optional(),
});

export type CreateContractFormData = yup.InferType<typeof schema>;

const defaultValues = {
  name: "",
  relationship: "",
  project: "",
  type: "",
  category: "",
  manager: "",
  jobTitle: "",
  contractId: "",
  description: "",
  vendor: "",
  vendorKeyPersonnel: [],
  internalStakeholders: [],
  contractValue: "",
  contingency: "",
  holdback: "10%",
  paymentStructure: "",
  paymentTerm: "",
  milestones: [{ name: "Milestone 1", amount: "", dueDate: undefined }],
  effectiveDate: undefined,
  endDate: undefined,
  duration: "",
  termType: "",
  documents: [],
};

const CreateContractSheet: React.FC<Props> = ({ trigger }) => {
  const { control } = useForge({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const [step, setStep] = React.useState(1);
  const stepTitles = [
    "Step 1 of 6: Basic Information",
    "Step 2 of 6: Contract Team",
    "Step 3 of 6: Contract Value & Payments",
    "Step 4 of 6: Timeline",
    "Step 5 of 6: Documents",
    "Step 6 of 6: Review & Publish",
  ];

  const submit = () => {};

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="sm:max-w-3xl rounded-2xl" side="right">
        <div data-testid="create-contract-sheet" className="space-y-6">
          <SheetHeader>
            <SheetTitle>Create Contract</SheetTitle>
          </SheetHeader>
          <div className="px-0">
            <p className="text-sm font-medium text-slate-700">{stepTitles[step - 1]}</p>
            <Forge control={control} onSubmit={submit}>
              {step === 1 && <Step1BasicInfo />}

              {step === 2 && <Step2ContractTeam />}

              {step === 3 && <Step3ValuePayments control={control} />}

              {step === 4 && <Step4Timeline />}

              {step === 5 && <Step5Documents />}

              {step === 6 && <Step6ReviewPublish control={control} />}
              <SheetFooter>
                <div className="flex w-full gap-4 pt-4">
                  <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl">Save as Draft</Button>
                  <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep(Math.max(1, step - 1))}>Back</Button>
                  {step < 6 ? (
                    <Button type="button" className="flex-1 h-12 rounded-xl" onClick={() => setStep(Math.min(6, step + 1))}>Continue</Button>
                  ) : (
                    <Button type="submit" className="flex-1 h-12 rounded-xl">Publish</Button>
                  )}
                </div>
              </SheetFooter>
            </Forge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateContractSheet;
