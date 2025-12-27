import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Forge, Forger, useForge } from "@/lib/forge";
import { postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextInput,
  TextArea,
  TextSelect,
  TextCurrencyInput,
  TextDatePicker,
  TextFileUploader,
} from "@/components/layouts/FormInputs";
import { CloudUpload, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";

type UploadedFile = {
  name: string;
  url: string;
  type: string;
  size: number;
};

type InitialValues = {
  name?: string;
  category?: string;
  description?: string;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  allowMultipleContracts?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  title?: string;
  dialogTestId?: string;
  submitButtonText?: string;
  initialValues?: InitialValues;
  onSubmit?: (payload: {
    name: string;
    category: string;
    description?: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
    allowMultipleContracts: boolean;
    files?: UploadedFile[];
  }) => Promise<void> | void;
  isSubmitting: boolean;
};

const schema = yup.object({
  name: yup.string().required("Project name is required"),
  category: yup.string().required("Project category is required"),
  budget: yup
    .number()
    .typeError("Budget must be a number")
    .min(0, "Budget must be positive")
    .optional(),
  startDate: yup.date().optional().nullable(),
  endDate: yup
    .date()
    .optional()
    .nullable()
    .when("startDate", ([startDate], dateSchema) => {
      if (startDate instanceof Date && !Number.isNaN(startDate.getTime())) {
        return dateSchema.min(startDate, "End date must be after start date");
      }
      return dateSchema;
    }),
  description: yup.string().optional(),
  allowMultipleContracts: yup.boolean().default(false),
  files: yup.mixed<File[]>().nullable().optional().default(null),
});

const defaultValues = {
  name: "",
  category: "",
  budget: undefined as number | undefined,
  startDate: undefined as Date | undefined,
  endDate: undefined as Date | undefined,
  description: "",
  allowMultipleContracts: true,
  files: null as File[] | null,
};

type FormState = yup.InferType<typeof schema>;

export interface UploadURLs {
  size:     string;
  type:     string;
  url:      string;
  name:     string;
  download: string;
}

type FileUploadState = {
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
};

const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;


const CreateProjectDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  onSuccess,
  title,
  dialogTestId,
  submitButtonText,
  initialValues,
  onSubmit,
  isSubmitting,
}) => {
  const [fileUploadStateByKey, setFileUploadStateByKey] = React.useState<
    Record<string, FileUploadState>
  >({});

  const { mutateAsync: uploadFile, isPending: isUploadingFiles } = useMutation<
    ApiResponse<UploadURLs[]>,
    ApiResponseError,
    { file: File; onProgress?: (progress: number) => void }
  >({
    mutationKey: ["uploadProjectFile"],
    mutationFn: async ({ file, onProgress }) => {
      const formData = new FormData();
      formData.append("file", file);

      return await postRequest({
        url: "/upload",
        payload: formData,
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            if (!event.total) return;
            const progress = Math.min(
              100,
              Math.round((event.loaded * 100) / event.total)
            );
            onProgress?.(progress);
          },
        },
      });
    },
  });

  const { control, watch, setValue } = useForge({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const allowMultiple = watch("allowMultipleContracts");
  const files = watch("files");

  React.useEffect(() => {
    if (!open || !initialValues) return;

    if (typeof initialValues.name === "string") {
      setValue("name", initialValues.name);
    }
    if (typeof initialValues.category === "string") {
      setValue("category", initialValues.category);
    }
    if (typeof initialValues.description === "string") {
      setValue("description", initialValues.description);
    }
    if (typeof initialValues.budget === "number") {
      setValue("budget", initialValues.budget);
    }
    if (initialValues.startDate instanceof Date) {
      setValue("startDate", initialValues.startDate);
    }
    if (initialValues.endDate instanceof Date) {
      setValue("endDate", initialValues.endDate);
    }
    if (typeof initialValues.allowMultipleContracts === "boolean") {
      setValue("allowMultipleContracts", initialValues.allowMultipleContracts);
    }

    setValue("files", null);
  }, [initialValues, open, setValue]);

  React.useEffect(() => {
    if (!open) {
      setFileUploadStateByKey({});
      return;
    }

    const nextKeys = new Set((files ?? []).map(getFileKey));
    setFileUploadStateByKey((prev) => {
      const next: Record<string, FileUploadState> = { ...prev };

      Object.keys(next).forEach((key) => {
        if (!nextKeys.has(key)) delete next[key];
      });

      (files ?? []).forEach((file) => {
        const key = getFileKey(file);
        if (!next[key]) {
          next[key] = { progress: 0, status: "idle" };
        }
      });

      return next;
    });
  }, [files, open]);

  const FileListItem = ({ file }: { file: File; control: unknown }) => {
    const uploadState = fileUploadStateByKey[getFileKey(file)];
    const showProgress =
      uploadState?.status === "uploading" ||
      uploadState?.status === "success" ||
      uploadState?.status === "error";

    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
            <FileText className="h-5 w-5 text-slate-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">{file.type || "File"}</p>
            {showProgress ? (
              <div className="mt-2 space-y-1 w-full">
                <Progress
                  value={uploadState?.progress ?? 0}
                  variant={
                    uploadState?.status === "success"
                      ? "success"
                      : uploadState?.status === "error"
                      ? "error"
                      : "default"
                  }
                />
                <p className="text-xs text-slate-500">
                  {uploadState?.status === "error"
                    ? "Upload failed"
                    : `${uploadState?.progress ?? 0}%`}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          onClick={() => {
            const nextFiles = (files ?? []).filter((f) => f !== file);
            setValue("files", nextFiles.length > 0 ? nextFiles : null);
          }}
          aria-label={`Remove ${file.name}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const UploadElement = () => (
    <div className="flex flex-col items-center justify-center text-center">
      <CloudUpload className="h-12 w-12 text-[#2A4467]" />
      <div className="mt-4 space-y-2">
        <p className="text-base font-semibold text-[#2A4467]">
          Drag &amp; Drop or Click to choose files
        </p>
        <p className="text-sm text-slate-500">
          Supported formats: DOC, PDF, XLS, XLSLS, ZIP, PNG, JPEG
        </p>
      </div>
    </div>
  );

  const submit = async (data: FormState) => {
    let uploadedFiles: UploadedFile[] | undefined = undefined;

    if (Array.isArray(data.files) && data.files.length > 0) {
      const results: UploadedFile[] = [];

      for (const file of data.files) {
        const key = getFileKey(file);

        setFileUploadStateByKey((prev) => ({
          ...prev,
          [key]: { progress: 0, status: "uploading" },
        }));

        try {
          const uploadResponse = await uploadFile({
            file,
            onProgress: (progress) => {
              setFileUploadStateByKey((prev) => ({
                ...prev,
                [key]: { progress, status: "uploading" },
              }));
            },
          });

          const urls = uploadResponse?.data?.data;
          const url = Array.isArray(urls) ? urls[0]?.url : undefined;

          results.push({
            name: file.name,
            url: url ?? "",
            type: file.type,
            size: file.size,
          });

          setFileUploadStateByKey((prev) => ({
            ...prev,
            [key]: { progress: 100, status: "success" },
          }));
        } catch {
          setFileUploadStateByKey((prev) => ({
            ...prev,
            [key]: { progress: prev[key]?.progress ?? 0, status: "error" },
          }));
          throw new Error("File upload failed");
        }
      }

      uploadedFiles = results.length > 0 ? results : undefined;
    }

    const payload = {
      name: data.name,
      category: data.category,
      description: data.description,
      startDate:
        data.startDate instanceof Date
          ? format(data.startDate, "yyyy-MM-dd")
          : undefined,
      endDate:
        data.endDate instanceof Date ? format(data.endDate, "yyyy-MM-dd") : undefined,
      budget: typeof data.budget === "number" ? data.budget : undefined,
      allowMultipleContracts: !!data.allowMultipleContracts,
      files: uploadedFiles,
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      }
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      // noop: errors handled by caller
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-8 pt-8">
          <DialogTitle>{title ?? "Create Project"}</DialogTitle>
        </DialogHeader>

        <div className="px-8 pb-6">
          <Forge
            control={control}
            onSubmit={submit}
            className="space-y-6"
            data-testid={dialogTestId ?? "create-project-dialog"}
            // debug
          >
            <Forger
              name="name"
              label="Project Name"
              placeholder="Enter Project Name"
              component={TextInput}
              data-testid="project-name-input"
            />

            <Forger
              name="category"
              label="Project Category"
              placeholder="Enter Project Category"
              component={TextSelect}
              options={[
                { label: "MSA", value: "msa" },
                { label: "Stand-Alone", value: "standalone" },
              ]}
              data-testid="project-category-select"
            />

            <Forger
              name="budget"
              label="Budget"
              placeholder="Enter Project Budget"
              component={TextCurrencyInput}
              data-testid="budget-input"
            />

            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="startDate"
                label="Start Date"
                placeholder="Select Date"
                component={TextDatePicker}
                data-testid="project-start-date-input"
              />

              <Forger
                name="endDate"
                label="End Date"
                placeholder="Select Date"
                component={TextDatePicker}
                data-testid="project-end-date-input"
              />
            </div>

            <Forger
              name="description"
              label="Project Description"
              placeholder="Enter Project Description"
              component={TextArea}
              data-testid="project-description-input"
            />

            <Forger
              name="files"
              label="Upload Files"
              component={TextFileUploader}
              element={<UploadElement />}
              List={FileListItem}
              containerClass="w-full"
              className="rounded-xl border border-dashed border-[#2A4467]"
              accept={
                {
                  "application/pdf": [".pdf"],
                  "application/msword": [".doc"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                    ".docx",
                  ],
                  "application/vnd.ms-excel": [".xls"],
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                    ".xlsx",
                  ],
                  "application/zip": [".zip"],
                  "image/png": [".png"],
                  "image/jpeg": [".jpeg", ".jpg"],
                } as any
              }
              dropzoneOptions={{
                multiple: true,
              }}
              data-testid="project-files-input"
            />

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">
                Project Control
              </p>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-700">
                  Allow Multiple Contracts
                </span>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={allowMultiple}
                    onCheckedChange={(val) =>
                      setValue("allowMultipleContracts", !!val)
                    }
                    data-testid="allow-multiple-contracts-switch"
                  />
                  <span className="text-sm text-slate-500">Enabled</span>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl"
                onClick={() => onOpenChange(false)}
                data-testid="cancel-create-project"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1 h-12 rounded-xl"
                disabled={isSubmitting || isUploadingFiles}
                isLoading={isSubmitting || isUploadingFiles}
                data-testid="continue-create-project"
              >
                {submitButtonText ?? "Continue"}
              </Button>
            </div>
          </Forge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
