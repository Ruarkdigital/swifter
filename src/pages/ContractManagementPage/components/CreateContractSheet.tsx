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
import { useWatch } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, X } from "lucide-react";

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
  personnel: yup.array().optional(),
  internalTeam: yup.array().optional(),
  personnelMeta: yup
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
  internalTeamMeta: yup
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
        deliverable: yup.string().optional(),
      })
    )
    .optional(),
  effectiveDate: yup
    .date()
    .typeError("Invalid date")
    .required("Effective date is required"),
  endDate: yup
    .date()
    .typeError("Invalid date")
    .required("End date is required")
    .test(
      "end-after-start",
      "End date must be on or after the effective date",
      function (value) {
        const { effectiveDate } = this.parent as { effectiveDate?: Date };
        if (!value || !effectiveDate) return true;
        return value >= effectiveDate;
      }
    ),
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
  draftStartDate: yup.date().optional(),
  draftEndDate: yup.date().optional(),
  reviewStartDate: yup.date().optional(),
  reviewEndDate: yup.date().optional(),
  approvalStartDate: yup.date().optional(),
  approvalEndDate: yup.date().optional(),
  executionStartDate: yup.date().optional(),
  executionEndDate: yup.date().optional(),
  approvalGroups: yup
    .array(
      yup.object({
        name: yup.string().optional(),
        approvers: yup.array().optional(),
        approvalLevel: yup.string().optional(),
        amount: yup.mixed().optional(),
      })
    )
    .optional(),
  insuranceExpiryDate: yup.date().optional(),
  contractSecurity: yup.string().optional(),
  securityType: yup.string().optional(),
  securityAmount: yup.string().optional(),
  securityDueDate: yup.date().optional(),
  securityExpiryDate: yup.date().optional(),
  rating: yup.number().min(1).max(5).optional(),
  insurancePolicies: yup
    .array(
      yup.object({
        name: yup.string().optional(),
        limit: yup.string().optional(),
      })
    )
    .optional(),
  securities: yup
    .array(
      yup.object({
        type: yup.string().optional(),
        amount: yup.mixed().optional(),
        dueDate: yup.date().optional(),
      })
    )
    .optional(),
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
  personnel: [],
  internalTeam: [],
  personnelMeta: [],
  internalTeamMeta: [],
  visibility: "",
  contractValue: "",
  contingency: "",
  holdback: "",
  paymentStructure: "",
  paymentTerm: "",
  milestones: [{ name: "", amount: "", dueDate: undefined, deliverable: "" }],
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
  draftStartDate: undefined,
  draftEndDate: undefined,
  reviewStartDate: undefined,
  reviewEndDate: undefined,
  approvalStartDate: undefined,
  approvalEndDate: undefined,
  executionStartDate: undefined,
  executionEndDate: undefined,
  approvalGroups: [{ name: "", approvers: [], approvalLevel: "0", amount: "" }],
  insuranceExpiryDate: undefined,
  contractSecurity: "",
  securityType: "",
  securityAmount: "",
  securityDueDate: undefined,
  securityExpiryDate: undefined,
  insurancePolicies: [{ name: "", limit: "" }],
  securities: [],
};

// Contract metadata: types, payment terms, term types, personnel, awarded solicitation
type ApiListResponse<T> = { status: number; message: string; data: T[] };
type ContractType = { _id: string; name: string; description?: string };
type ContractTerm = { _id: string; name: string; description?: string };
type Personnel = { _id: string; name: string; email: string };
type AwardedVendorItem = {
  _id: string;
  name: string;
  vendor: { _id: string; name: string; email: string };
};

const CreateContractSheet: React.FC<Props> = ({ trigger }) => {
  const { control, getValues, reset } = useForge<CreateContractFormData>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const [step, setStep] = React.useState(1);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false);
  const [selectedApprovalGroup, setSelectedApprovalGroup] = React.useState("");
  const [assignedApproverIds, setAssignedApproverIds] = React.useState<string[]>(
    []
  );
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
  const approvalGroups = useWatch({ control, name: "approvalGroups" }) as
    | {
        name?: string | null;
        approvers?: any[];
        approvalLevel?: string;
        amount?: unknown;
      }[]
    | undefined;

  const approvalGroupOptions = React.useMemo(
    () =>
      (approvalGroups ?? []).map((group, index) => ({
        label: `${group?.name || `Group ${index + 1}`} - Approval Level ${
          group?.approvalLevel || "-"
        }`,
        value: String(index),
      })),
    [approvalGroups]
  );

  const selectedGroupIndex = selectedApprovalGroup
    ? Number(selectedApprovalGroup)
    : 0;
  const selectedGroup = approvalGroupOptions.length
    ? approvalGroups?.[selectedGroupIndex]
    : undefined;
  const selectedApprovers = (selectedGroup?.approvers ?? []) as any[];

  React.useEffect(() => {
    if (!selectedApprovalGroup && approvalGroupOptions.length > 0) {
      setSelectedApprovalGroup(approvalGroupOptions[0].value);
    }
  }, [approvalGroupOptions, selectedApprovalGroup]);

  React.useEffect(() => {
    const ids = selectedApprovers.map((approver, index) => {
      return (
        approver?.id ||
        approver?.email ||
        approver?.value ||
        approver?.text ||
        String(index)
      );
    });
    setAssignedApproverIds(ids);
  }, [selectedApprovers]);

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
      const res = await getRequest({
        url: "/contract/manager/awarded-solicitation",
      });
      return res.data as ApiListResponse<AwardedVendorItem>;
    },
    staleTime: 60_000,
  });

  // Projects list (reuse existing service)
  const { data: projectsData } = useProjectsList({ limit: 50, page: 1 });

  const typeOptions =
    typesQuery.data?.data?.map((t) => ({ label: t.name, value: t._id })) ?? [];
  const paymentTermOptions =
    paymentTermsQuery.data?.data?.map((t) => ({
      label: t.name,
      value: t._id,
    })) ?? [];
  const termTypeOptions =
    termTypesQuery.data?.data?.map((t) => ({ label: t.name, value: t._id })) ??
    [];
  const internalStakeholderOptions =
    personnelQuery.data?.data?.map((p) => ({
      label: p.email || p.name,
      value: p.email || p._id,
    })) ?? [];
  const projectOptions =
    projectsData?.data?.map((p) => ({ label: p.name, value: p._id })) ?? [];

  const awardedOptions =
    awardedQuery.data?.data?.map((a) => ({
      label: `${a.name} — ${a.vendor.name}`,
      value: a._id,
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

  const buildPayload = (
    data: CreateContractFormData,
    status: "draft" | "publish"
  ) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

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

    // Map internal payment structure to API enum
    let paymentStructureEnum = undefined;
    if (data.paymentStructure === "monthly") paymentStructureEnum = "Monthly";
    if (data.paymentStructure === "milestone") paymentStructureEnum = "Milestone";
    if (data.paymentStructure === "lump_sum") paymentStructureEnum = "Progress Draw";

    const approvaers =
      (data.approvalGroups ?? []).flatMap((g) => {
        const lvl = g.approvalLevel ? Number(g.approvalLevel) : undefined;
        const amountValue =
          typeof g.amount === "string"
            ? parseFloat(g.amount)
            : Number(g.amount ?? 0);
        // API expects user as array of strings
        const userIds = (g.approvers ?? []).map((u: any) => u?.value ?? u);
        return {
          user: userIds,
          groupName: g.name,
          levelName: lvl,
          amount: amountValue,
        };
      }) ?? [];

    const milestone = paymentStructureIsMilestone
      ? (data.milestones ?? []).map((m) => ({
          amount:
            typeof m.amount === "string"
              ? parseFloat(m.amount)
              : Number(m.amount ?? 0),
          dueDate: m.dueDate
            ? new Date(m.dueDate as unknown as Date).toISOString().slice(0, 10)
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
      (a) => a._id === data.awardedSolicitation
    );

    // Insurance Construction
    const mainSecurity = data.securityType
      ? [
          {
            securityType: data.securityType,
            amount: Number(data.securityAmount ?? 0),
            dueDate: data.securityDueDate
              ? new Date(data.securityDueDate as unknown as Date)
                  .toISOString()
                  .slice(0, 10)
              : undefined,
          },
        ]
      : [];
    const extraSecurities = (data.securities || []).map((s) => ({
      securityType: s.type,
      amount: Number(s.amount ?? 0),
      dueDate: s.dueDate
        ? new Date(s.dueDate as unknown as Date).toISOString().slice(0, 10)
        : undefined,
    }));

    const insurancePayload = {
      insurance: data.contractSecurity === "yes" ? "Yes" : "No",
      contractSecurity: data.contractSecurity === "yes",
      expiryDate: data.insuranceExpiryDate
        ? new Date(data.insuranceExpiryDate as unknown as Date)
            .toISOString()
            .slice(0, 10)
        : undefined,
      contractSecurityType: [...mainSecurity, ...extraSecurities],
      policy: (data.insurancePolicies || []).map((p) => ({
        policyName: p.name,
        limit: p.limit,
      })),
    };

    // Dates Construction
    const formatDate = (d: any) =>
      d ? new Date(d as unknown as Date).toISOString().slice(0, 10) : undefined;

    const contractFormationStage = {
      draft: {
        startDate: formatDate(data.draftStartDate),
        endDate: formatDate(data.draftEndDate),
      },
      review: {
        startDate: formatDate(data.reviewStartDate),
        endDate: formatDate(data.reviewEndDate),
      },
      approval: {
        startDate: formatDate(data.approvalStartDate),
        endDate: formatDate(data.approvalEndDate),
      },
      execution: {
        startDate: formatDate(data.executionStartDate),
        endDate: formatDate(data.executionEndDate),
      },
    };

    const payload = {
      title: data.name,
      description: data.description,
      category: data.category,
      timezone: tz,
      contractType: data.type,
      contractRelationship: relationship,
      projectId:
        relationship === "project" ? data.project || undefined : undefined,
      msaContractId:
        relationship === "msa_project" ? data.project || undefined : undefined,
      solicitationId: data.awardedSolicitation || undefined,
      contractId: data.contractId || undefined,
      // jobTitle: data.jobTitle || undefined,
      vendor: data.vendor || awardedMatch?.vendor?.email || undefined,
      personnel:
        (data.personnelMeta && data.personnelMeta.length > 0
          ? (data.personnelMeta ?? []).map((p: any) => ({
              name: p?.name || undefined,
              email: p?.email || undefined,
              ...(p?.role ? { role: p.role } : {}),
              ...(p?.phone ? { phone: p.phone } : {}),
            }))
          : (data.personnel ?? []).map((t: any) => {
              const val = t?.value ?? t;
              const isEmail = typeof val === "string" && val.includes("@");
              return isEmail ? { email: val } : { name: val };
            })) ?? undefined,
      internalTeam:
        (data.internalTeamMeta &&
        data.internalTeamMeta.length > 0
          ? (data.internalTeamMeta ?? []).map((p: any) => ({
              name: p?.name || undefined,
              email: p?.email || undefined,
              ...(p?.role ? { role: p.role } : {}),
              ...(p?.phone ? { phone: p.phone } : {}),
            }))
          : (data.internalTeam ?? []).map((t: any) => t?.value ?? t)) ??
        undefined,
      visibility: data.visibility || "private",
      contractAmount:
        typeof data.contractValue === "string"
          ? parseFloat(data.contractValue)
          : typeof data.contractValue === "number"
          ? data.contractValue
          : undefined,
      contigency: data.contingency || undefined,
      holdBack,
      contractPaymentTerm: data.paymentTerm || undefined,
      paymentStructure: paymentStructureEnum,
      startDate: formatDate(data.effectiveDate),
      endDate: formatDate(data.endDate),
      duration: data.duration ? Number(data.duration) : undefined,
      contractTermType: data.termType || undefined,
      deliverables,
      milestone,
      files,
      approvaers,
      insurance: insurancePayload,
      contractFormationStage,
      rating: data.rating || 5,
      status: status,
    };

    // Remove undefined fields to avoid sending undeclared values
    Object.keys(payload).forEach((k) => {
      if ((payload as any)[k] === undefined) {
        delete (payload as any)[k];
      }
    });

    return payload;
  };

  const submit = (
    formData: CreateContractFormData,
    status: "draft" | "publish" = "publish"
  ) => {
    const payload = buildPayload(formData, status);
    mutation.mutate(payload);
  };

  const getApproverKey = (approver: any, index: number) =>
    approver?.id ||
    approver?.email ||
    approver?.value ||
    approver?.text ||
    String(index);

  const assignedApprovers = selectedApprovers.filter((approver, index) =>
    assignedApproverIds.includes(getApproverKey(approver, index))
  );

  const toggleApprover = (approverId: string, checked: boolean) => {
    setAssignedApproverIds((prev) =>
      checked ? [...prev, approverId] : prev.filter((id) => id !== approverId)
    );
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
                <Step2ContractTeam
                  internalStakeholderOptions={internalStakeholderOptions}
                />
              )}

              {step === 5 && (
                <Step3ValuePayments
                  control={control}
                  paymentTermOptions={paymentTermOptions}
                />
              )}

              {step === 3 && (
                <Step4Timeline
                  control={control}
                  termTypeOptions={termTypeOptions}
                />
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
                        onClick={() => {
                          if (step === 8) {
                            setIsApprovalDialogOpen(true);
                            return;
                          }
                          setStep(Math.min(totalSteps, step + 1));
                        }}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          const vals = getValues();
                          submit(vals as CreateContractFormData, "publish");
                        }}
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

            <Dialog
              open={isApprovalDialogOpen}
              onOpenChange={setIsApprovalDialogOpen}
            >
              <DialogContent className="sm:max-w-xl p-0">
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold text-slate-900">
                      Send for Approval
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsApprovalDialogOpen(false)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-900">
                      Select Approvers For Contract Execution
                    </p>
                    <div className="relative">
                      <select
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 pr-10 text-sm text-slate-700 focus:border-[#2A4467] focus:ring-[#2A4467]"
                        value={
                          approvalGroupOptions.length
                            ? String(selectedGroupIndex)
                            : ""
                        }
                        onChange={(event) =>
                          setSelectedApprovalGroup(event.target.value)
                        }
                      >
                        {approvalGroupOptions.length === 0 && (
                          <option value="">Select Group</option>
                        )}
                        {approvalGroupOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_160px_140px] bg-slate-50 px-6 py-2 text-sm font-semibold text-[#2A4467]">
                      <p>Group</p>
                      <p className="text-center">Role</p>
                      <p className="text-center">Action</p>
                    </div>
                    <div className="divide-y">
                      {selectedApprovers.length === 0 && (
                        <div className="px-6 py-6 text-sm text-slate-500">
                          No approvers added for this group
                        </div>
                      )}
                      {selectedApprovers.map((approver, index) => {
                        const approverId = getApproverKey(approver, index);
                        const name =
                          approver?.text ||
                          approver?.name ||
                          approver?.label ||
                          "Unnamed";
                        const email = approver?.id || approver?.email || "";
                        const role = approver?.meta?.role
                          ? approver.meta.role
                          : selectedGroup?.approvalLevel
                          ? `Approval Level ${selectedGroup.approvalLevel}`
                          : "Approval";
                        return (
                          <div
                            key={approverId}
                            className="grid grid-cols-[1fr_160px_140px] items-center px-6 py-4"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-slate-700">
                                {name}
                              </p>
                              {email && (
                                <p className="text-xs text-blue-600 underline">
                                  {email}
                                </p>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 text-center">
                              {role}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                              <Checkbox
                                checked={assignedApproverIds.includes(
                                  approverId
                                )}
                                onCheckedChange={(checked) =>
                                  toggleApprover(approverId, Boolean(checked))
                                }
                              />
                              <span className="text-sm text-slate-700">
                                Assign
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-900">
                      Assigned Approvers
                    </p>
                    <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-slate-50 px-4 py-4">
                      {assignedApprovers.length === 0 && (
                        <p className="text-sm text-slate-500">Search</p>
                      )}
                      {assignedApprovers.map((approver, index) => {
                        const approverId = getApproverKey(approver, index);
                        const name =
                          approver?.text ||
                          approver?.name ||
                          approver?.label ||
                          "Unnamed";
                        return (
                          <div
                            key={approverId}
                            className="flex items-center gap-2 rounded-md bg-[#2A44671A] px-2 py-1 text-xs font-semibold text-[#2A4467]"
                          >
                            <span>{name}</span>
                            <button
                              type="button"
                              onClick={() =>
                                toggleApprover(approverId, false)
                              }
                              className="text-[#2A4467]"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-8 rounded-xl"
                      onClick={() => setIsApprovalDialogOpen(false)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="h-12 px-8 rounded-xl bg-[#2A4467] hover:bg-[#1e3252] text-white"
                      onClick={() => {
                        setIsApprovalDialogOpen(false);
                        setStep(9);
                      }}
                    >
                      Send for Approval
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContractSheet;
