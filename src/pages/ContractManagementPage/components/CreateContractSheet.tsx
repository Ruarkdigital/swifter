import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Forge, useForge } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { cn } from "@/lib/utils";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2ContractTeam from "./Step2ContractTeam";
import Step3ValuePayments from "./Step3ValuePayments";
import Step4Timeline from "./Step4Timeline";
import Step5Deliverables from "./Step5Deliverables";
import Step6Documents from "./Step5Documents";
import Step7ApprovalLevel from "./Step7ApprovalLevel";
import Step8ReviewPublish from "./Step6ReviewPublish";
import Step6ComplianceSecurity from "./Step6ComplianceSecurity";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { useUserQueryKey } from "@/hooks/useUserQueryKey";
import { useProjectsList } from "@/pages/ProjectManagementPage/services/useProjectApi";
import { useToastHandler } from "@/hooks/useToaster";

type Props = {
  trigger: React.ReactNode;
};

const schema = yup.object({
  name: yup.string().required("Contract name is required"),
  relationship: yup.string().required("Relationship is required"),
  project: yup.string().optional(),
  awardedSolicitation: yup.string().optional(),
  type: yup.string().required("Contract type is required"),
  category: yup.string().required("Category is required"),
  // manager: yup.string().optional(),
  // jobTitle: yup.string().optional(),
  contractId: yup.string().optional(),
  description: yup.string().required("Description is required"),
  vendor: yup.string().optional(),
  vendorKeyPersonnel: yup.array().optional(),
  internalStakeholders: yup.array().optional(),
  vendorKeyPersonnelMeta: yup
    .array(
      yup.object({
        id: yup.string().optional(),
        name: yup.string().optional(),
        email: yup.string().optional(),
        role: yup.string().optional(),
        phone: yup.string().optional(),
      })
    )
    .optional(),
  internalStakeholdersMeta: yup
    .array(
      yup.object({
        id: yup.string().optional(),
        name: yup.string().optional(),
        email: yup.string().optional(),
        role: yup.string().optional(),
        phone: yup.string().optional(),
      })
    )
    .optional(),
  visibility: yup.string().optional(),
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
  effectiveDate: yup.date().optional(),
  endDate: yup.date().optional(),
  duration: yup.string().optional(),
  termType: yup.string().optional(),
  documents: yup.array().optional(),
  deliverables: yup
    .array(
      yup.object({
        name: yup.string().optional(),
        dueDate: yup.date().optional(),
      })
    )
    .optional(),
  approvalGroups: yup
    .array(
      yup.object({
        name: yup.string().optional(),
        approvers: yup.array().optional(),
        approvalLevel: yup.string().optional(),
      })
    )
    .optional(),
  insuranceRequirement: yup.string().optional(),
  insuranceExpiryDate: yup.date().optional(),
  contractSecurity: yup.string().optional(),
  securityType: yup.string().optional(),
  securityAmount: yup.string().optional(),
  securityDueDate: yup.date().optional(),
  securityExpiryDate: yup.date().optional(),
});

export type CreateContractFormData = yup.InferType<typeof schema>;

const defaultValues = {
  name: "",
  relationship: "",
  project: "",
  awardedSolicitation: "",
  type: "",
  category: "",
  // manager: "",
  // jobTitle: "",
  contractId: "",
  description: "",
  vendor: "",
  vendorKeyPersonnel: [],
  internalStakeholders: [],
  vendorKeyPersonnelMeta: [],
  internalStakeholdersMeta: [],
  visibility: "",
  contractValue: "",
  contingency: "",
  holdback: "",
  paymentStructure: "",
  paymentTerm: "",
  milestones: [{ name: "", amount: "", dueDate: undefined }],
  effectiveDate: undefined,
  endDate: undefined,
  duration: "",
  termType: "",
  documents: [],
  deliverables: [
    {
      name: "",
      dueDate: undefined,
    },
  ],
  approvalGroups: [
    { name: "", approvers: [], approvalLevel: "0" },
  ],
  insuranceRequirement: "",
  insuranceExpiryDate: undefined,
  contractSecurity: "",
  securityType: "",
  securityAmount: "",
  securityDueDate: undefined,
  securityExpiryDate: undefined,
};

const CreateContractSheet: React.FC<Props> = ({ trigger }) => {
  const { control, getValues, reset } = useForge({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const [step, setStep] = React.useState(1);
  const stepTitles = [
    "Step 1 of 8: Basic Information",
    "Step 2 of 8: Contract Team",
    "Step 3 of 8: Timeline",
    "Step 4 of 8: Deliverables",
    "Step 5 of 9: Contract Value & Payments",
    "Step 6 of 9: Compliance & Security",
    "Step 7 of 9: Documents",
    "Step 8 of 9: Configure Approval Level",
    "Step 9 of 9: Review & Publish",
  ];
  const totalSteps = stepTitles.length;

  const { success, error } = useToastHandler();
  const qc = useQueryClient();

  // Contract metadata: types, payment terms, term types, personnel, awarded solicitation
  type ApiListResponse<T> = { status: number; message: string; data: T[] };
  type ContractType = { _id: string; name: string; description?: string };
  type ContractTerm = { _id: string; name: string; description?: string };
  type Personnel = { _id: string; name: string; email: string };
  type AwardedVendorItem = {
    solicitationId: string;
    solicitationName: string;
    vendor: { _id: string; name: string; email: string };
  };

  const typesQuery = useQuery<ApiListResponse<ContractType>>({
    queryKey: useUserQueryKey(["contract-types"]),
    queryFn: async () => {
      const res = await getRequest({ url: "/contract/manager/types" });
      return res.data as ApiListResponse<ContractType>;
    },
    staleTime: 60_000,
  });

  const paymentTermsQuery = useQuery<ApiListResponse<ContractTerm>>({
    queryKey: useUserQueryKey(["contract-payment-terms"]),
    queryFn: async () => {
      const res = await getRequest({ url: "/contract/manager/payment-terms" });
      return res.data as ApiListResponse<ContractTerm>;
    },
    staleTime: 60_000,
  });

  const termTypesQuery = useQuery<ApiListResponse<ContractTerm>>({
    queryKey: useUserQueryKey(["contract-term-types"]),
    queryFn: async () => {
      const res = await getRequest({ url: "/contract/manager/terms" });
      return res.data as ApiListResponse<ContractTerm>;
    },
    staleTime: 60_000,
  });

  const personnelQuery = useQuery<ApiListResponse<Personnel>>({
    queryKey: useUserQueryKey(["contract-personnel"]),
    queryFn: async () => {
      const res = await getRequest({ url: "/contract/manager/personnel" });
      return res.data as ApiListResponse<Personnel>;
    },
    staleTime: 60_000,
  });

  const awardedQuery = useQuery<ApiListResponse<AwardedVendorItem>>({
    queryKey: useUserQueryKey(["awarded-solicitations"]),
    queryFn: async () => {
      const res = await getRequest({ url: "/contract/manager/awarded-solicitation" });
      return res.data as ApiListResponse<AwardedVendorItem>;
    },
    staleTime: 60_000,
  });

  // Projects list (reuse existing service)
  const { data: projectsData } = useProjectsList({ limit: 50, page: 1 });

  const typeOptions =
    typesQuery.data?.data?.map((t) => ({ label: t.name, value: t._id })) ?? [];
  const paymentTermOptions =
    paymentTermsQuery.data?.data?.map((t) => ({ label: t.name, value: t._id })) ??
    [];
  const termTypeOptions =
    termTypesQuery.data?.data?.map((t) => ({ label: t.name, value: t._id })) ?? [];
  const internalStakeholderOptions =
    personnelQuery.data?.data?.map((p) => ({
      label: p.email || p.name,
      value: p.email || p._id,
    })) ?? [];
  const projectOptions =
    projectsData?.data?.map((p) => ({ label: p.name, value: p._id })) ?? [];
  const awardedOptions =
    awardedQuery.data?.data?.map((a) => ({
      label: `${a.solicitationName} — ${a.vendor.name}`,
      value: a.solicitationId,
      // carry vendor info for mapping
      vendorEmail: a.vendor.email,
      vendorId: a.vendor._id,
    })) ?? [];

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await postRequest({ url: "/contracts", payload });
      return res.data as {
        status: number;
        message: string;
        data: { _id: string; title: string };
      };
    },
    onSuccess: (res) => {
      success("Contract Created", res.message);
      qc.invalidateQueries({ queryKey: ["contracts-all"] });
      qc.invalidateQueries({ queryKey: ["contracts-me"] });
      qc.invalidateQueries({ queryKey: ["contracts-stats"] });
      reset(defaultValues);
      setStep(1);
    },
    onError: (e: any) => {
      error("Failed to create contract", e);
    },
  });

  const buildPayload = (data: CreateContractFormData) => {
    const tz =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const relationship =
      data.relationship === "msa"
        ? "msa_project"
        : data.relationship === "standalone"
        ? "standalone"
        : "project";

    const holdBack =
      typeof data.holdback === "string" && data.holdback.endsWith("%")
        ? parseFloat(data.holdback.replace("%", ""))
        : typeof data.holdback === "string"
        ? parseFloat(data.holdback)
        : Number(data.holdback ?? 0);

    const paymentStructureIsMilestone = data.paymentStructure === "milestone";

    const approvals =
      (data.approvalGroups ?? []).flatMap((g) => {
        const lvl = g.approvalLevel ? Number(g.approvalLevel) : undefined;
        return (g.approvers ?? []).map((u: any) => ({
          user: u?.value ?? u,
          groupName: g.name,
          levelName: lvl,
        }));
      }) ?? [];

    const milestone =
      paymentStructureIsMilestone
        ? (data.milestones ?? []).map((m) => ({
            amount:
              typeof m.amount === "string"
                ? parseFloat(m.amount)
                : Number(m.amount ?? 0),
            dueDate: m.dueDate
              ? new Date(m.dueDate as unknown as Date)
                  .toISOString()
                  .slice(0, 10)
              : undefined,
            name: m.name,
          }))
        : undefined;

    const deliverables =
      (data.deliverables ?? []).map((d) => ({
        name: d.name,
        dueDate: d.dueDate
          ? new Date(d.dueDate as unknown as Date).toISOString().slice(0, 10)
          : undefined,
      })) ?? [];

    const files =
      (data.documents ?? []).map((f: any) => ({
        name: f?.name,
        url: f?.url,
        type: f?.type,
        size: f?.size,
      })) ?? [];

    const awardedMatch = awardedQuery.data?.data?.find(
      (a) => a.solicitationId === data.awardedSolicitation
    );

    const payload = {
      title: data.name,
      description: data.description,
      category: data.category,
      timezone: tz,
      contractType: data.type,
      contractRelationship: relationship,
      projectId: relationship === "project" ? data.project || undefined : undefined,
      msaContractId: relationship === "msa_project" ? data.project || undefined : undefined,
      solicitationId: data.awardedSolicitation || undefined,
      contractId: data.contractId || undefined,
      // jobTitle: data.jobTitle || undefined,
      vendor: (data.vendor || awardedMatch?.vendor?.email) || undefined,
      personnel:
        (data.vendorKeyPersonnelMeta && data.vendorKeyPersonnelMeta.length > 0
          ? (data.vendorKeyPersonnelMeta ?? []).map((p: any) => ({
              name: p?.name || undefined,
              email: p?.email || undefined,
              ...(p?.role ? { role: p.role } : {}),
              ...(p?.phone ? { phone: p.phone } : {}),
            }))
          : (data.vendorKeyPersonnel ?? []).map((t: any) => {
              const val = t?.value ?? t;
              const isEmail = typeof val === "string" && val.includes("@");
              return isEmail ? { email: val } : { name: val };
            })) ?? undefined,
      internalTeam:
        (data.internalStakeholdersMeta && data.internalStakeholdersMeta.length > 0
          ? (data.internalStakeholdersMeta ?? []).map((p: any) => ({
              name: p?.name || undefined,
              email: p?.email || undefined,
              ...(p?.role ? { role: p.role } : {}),
              ...(p?.phone ? { phone: p.phone } : {}),
            }))
          : (data.internalStakeholders ?? []).map((t: any) => t?.value ?? t)) ??
        undefined,
      visibility:
        data.visibility === "invites_only" ? "private" : data.visibility || "private",
      contractAmount:
        typeof data.contractValue === "string"
          ? parseFloat(data.contractValue)
          : typeof data.contractValue === "number"
          ? data.contractValue
          : undefined,
      contigency: data.contingency || undefined,
      holdBack,
      paymentTerm: data.paymentTerm || undefined,
      startDate: data.effectiveDate
        ? new Date(data.effectiveDate as unknown as Date).toISOString().slice(0, 10)
        : undefined,
      endDate: data.endDate
        ? new Date(data.endDate as unknown as Date).toISOString().slice(0, 10)
        : undefined,
      duration: data.duration ? Number(data.duration) : undefined,
      termType: data.termType || undefined,
      deliverables,
      milestone,
      files,
      approvals,
    };

    // Remove undefined fields to avoid sending undeclared values
    Object.keys(payload).forEach((k) => {
      if ((payload as any)[k] === undefined) {
        delete (payload as any)[k];
      }
    });

    return payload;
  };

  const submit = (formData: CreateContractFormData) => {
    const payload = buildPayload(formData);
    mutation.mutate(payload);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "rounded-2xl p-0 max-h-[90vh] overflow-y-auto",
          step === 8 ? "sm:max-w-5xl" : "sm:max-w-xl"
        )}
      >
        <div data-testid="create-contract-sheet" className="space-y-6">
          <DialogHeader className="px-8 pt-8">
            <DialogTitle>Create Contract</DialogTitle>
          </DialogHeader>

          <div className="px-4 pb-8">
            <p className="text-sm font-medium text-slate-700">
              {stepTitles[step - 1]}
            </p>

            <Forge
              control={control}
              onSubmit={submit}
              className="mt-4 space-y-6"
            >
              {step === 1 && (
                <Step1BasicInfo
                  typeOptions={typeOptions}
                  projectOptions={projectOptions}
                  awardedOptions={awardedOptions}
                />
              )}

              {step === 2 && (
                <Step2ContractTeam internalStakeholderOptions={internalStakeholderOptions} />
              )}

              {step === 5 && (
                <Step3ValuePayments
                  control={control}
                  paymentTermOptions={paymentTermOptions}
                />
              )}

              {step === 3 && (
                <Step4Timeline termTypeOptions={termTypeOptions} />
              )}

              {step === 4 && <Step5Deliverables control={control} />}

              {step === 6 && <Step6ComplianceSecurity control={control} />}

              {step === 7 && <Step6Documents />}

              {step === 8 && <Step7ApprovalLevel control={control} />}

              {step === 9 && <Step8ReviewPublish control={control} />}

              {step === 1 ? (
                <div className="flex w-full gap-4 pt-4">
                  <DialogClose className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    className="w-full h-12 rounded-xl"
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </Button>
                </div>
              ) : (
                <div className="flex w-full gap-4 pt-4 justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className=" h-12 rounded-xl"
                    onClick={() => {
                      const vals = getValues();
                      submit(vals as CreateContractFormData);
                    }}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Saving..." : "Save as Draft"}
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-24 h-12 rounded-xl bg-slate-300"
                      onClick={() => setStep(Math.max(1, step - 1))}
                    >
                      Back
                    </Button>
                    {step < totalSteps ? (
                      <Button
                        type="button"
                        className="w-32 h-12 rounded-xl"
                        onClick={() => setStep(Math.min(totalSteps, step + 1))}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-32 h-12 rounded-xl"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? "Publishing..." : "Publish"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Forge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContractSheet;
