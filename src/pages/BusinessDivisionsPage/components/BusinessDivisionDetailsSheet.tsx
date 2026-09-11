import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, X } from "lucide-react";
import { formatDateTZ } from "@/lib/utils";
import {
  businessDivisionApi,
  type BusinessDivision,
  type BusinessDivisionContract,
  type BusinessDivisionProject,
} from "../api/businessDivisionApi";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  divisionId?: string | null;
  onEditDivision?: (division: BusinessDivision) => void;
};

const formatCompactCurrency = (value?: number) => {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 0,
  }).format(num);
};

const InfoItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-2 font-quicksand">
      <p className="text-sm font-medium text-[#9CA3AF] dark:text-slate-400">{label}</p>
      <p className="text-sm font-bold text-[#111827] dark:text-slate-100">{value}</p>
    </div>
  );
};

const safeText = (value: unknown) => {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : "—";
};

const StatusPill = ({ status }: { status?: string }) => {
  const label = String(status ?? "").trim();
  if (!label) return <span className="text-sm text-[#9CA3AF] dark:text-slate-400">—</span>;

  const key = label.toLowerCase();
  const tone =
    key.includes("complete") || key.includes("active") || key.includes("approved")
      ? "bg-[#ECFDF3] text-[#027A48] dark:bg-emerald-950 dark:text-emerald-300"
      : key.includes("pending") || key.includes("draft") || key.includes("progress")
        ? "bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-300"
        : key.includes("reject") || key.includes("cancel") || key.includes("terminat")
          ? "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-300"
          : "bg-[#F2F4F7] text-[#344054] dark:bg-slate-800 dark:text-slate-300";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize font-quicksand ${tone}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
};

const ListSection = ({
  title,
  count,
  isLoading,
  emptyLabel,
  children,
}: {
  title: string;
  count: number;
  isLoading: boolean;
  emptyLabel: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-3 font-quicksand">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-[#111827] dark:text-slate-100">{title}</p>
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F3F4F6] px-1.5 text-xs font-bold text-[#374151] dark:bg-slate-800 dark:text-slate-300">
          {isLoading ? "—" : count}
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] dark:border-slate-700">
        {isLoading ? (
          <div className="p-4 text-sm text-[#9CA3AF] dark:text-slate-400">Loading…</div>
        ) : count === 0 ? (
          <div className="p-4 text-sm text-[#9CA3AF] dark:text-slate-400">{emptyLabel}</div>
        ) : (
          <div className="max-h-60 divide-y divide-[#F3F4F6] overflow-y-auto dark:divide-slate-800">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

const ListRow = ({
  title,
  subtitle,
  value,
  status,
}: {
  title: string;
  subtitle: string;
  value: string;
  status?: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 font-quicksand">
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-sm font-semibold text-[#111827] dark:text-slate-100">
          {title}
        </p>
        <p className="truncate text-xs text-[#6B7280] dark:text-slate-400">{subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <p className="text-sm font-bold text-[#111827] dark:text-slate-100">{value}</p>
        <StatusPill status={status} />
      </div>
    </div>
  );
};

const BusinessDivisionDetailsSheet = ({
  open,
  onOpenChange,
  divisionId,
  onEditDivision,
}: Props) => {
  const { data: detailRes, isLoading } = useQuery({
    queryKey: ["businessDivisions", "detail", divisionId],
    queryFn: async () => await businessDivisionApi.getDivisionById(String(divisionId)),
    enabled: open && Boolean(divisionId),
  });

  const division: BusinessDivision | undefined = detailRes?.data;
  const projects = division?.projects ?? [];
  const contracts = division?.contracts ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-[720px] w-full rounded-2xl overflow-hidden p-0 [&>button.absolute]:hidden"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-[#E5E7EB] dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <SheetClose asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 font-quicksand"
                >
                  <ArrowLeft className="h-5 w-5 text-[#6B7280] dark:text-slate-400" />
                  <SheetTitle className="text-base font-semibold text-[#2A4467] dark:text-slate-100">
                    Business Division Details
                  </SheetTitle>
                </button>
              </SheetClose>
              <SheetClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-lg"
                >
                  <X className="h-5 w-5 text-[#EF4444]" />
                </button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-[#0F0F0F] dark:text-slate-100 font-quicksand">
                  {isLoading ? "—" : safeText(division?.name)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-16 gap-y-8">
                <InfoItem
                  label="Division Name"
                  value={isLoading ? "—" : safeText(division?.name)}
                />
                <InfoItem
                  label="Location"
                  value={isLoading ? "—" : safeText(division?.location)}
                />
                <InfoItem
                  label="Total Contracts"
                  value={isLoading ? "—" : safeText(division?.totalContracts ?? 0)}
                />
                <InfoItem
                  label="Total Contract Value"
                  value={
                    isLoading ? "—" : formatCompactCurrency(division?.totalContractValue)
                  }
                />
                <InfoItem
                  label="Total Projects"
                  value={isLoading ? "—" : safeText(division?.totalProjects ?? 0)}
                />
                <InfoItem
                  label="Total Project Value"
                  value={
                    isLoading ? "—" : formatCompactCurrency(division?.totalProjectValue)
                  }
                />
                <div className="col-span-2">
                  <InfoItem
                    label="Date Created"
                    value={
                      isLoading
                        ? "—"
                        : division?.createdAt
                          ? formatDateTZ(division.createdAt, "MMM dd, yyyy")
                          : "—"
                    }
                  />
                </div>
              </div>

              <ListSection
                title="Projects"
                count={projects.length}
                isLoading={isLoading}
                emptyLabel="No projects linked to this division yet."
              >
                {projects.map((project: BusinessDivisionProject) => (
                  <ListRow
                    key={project._id}
                    title={safeText(project.title)}
                    subtitle={safeText(project.projectId)}
                    value={formatCompactCurrency(project.budget)}
                    status={project.status}
                  />
                ))}
              </ListSection>

              <ListSection
                title="Contracts"
                count={contracts.length}
                isLoading={isLoading}
                emptyLabel="No contracts linked to this division yet."
              >
                {contracts.map((contract: BusinessDivisionContract) => (
                  <ListRow
                    key={contract._id}
                    title={safeText(contract.title)}
                    subtitle={safeText(contract.contractId)}
                    value={formatCompactCurrency(contract.contractValue ?? 0)}
                    status={contract.status}
                  />
                ))}
              </ListSection>
            </div>

            <div className="border-t border-[#E5E7EB] p-6 dark:border-slate-700">
              <Button
                type="button"
                className="h-[52px] w-full rounded-xl bg-[#F3F4F6] text-base font-semibold text-[#111827] font-quicksand hover:bg-[#E5E7EB] dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                disabled={isLoading || !division}
                onClick={() => {
                  if (!division) return;
                  onOpenChange(false);
                  onEditDivision?.(division);
                }}
              >
                Edit Business Division
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BusinessDivisionDetailsSheet;
