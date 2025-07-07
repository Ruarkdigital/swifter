import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Users } from "lucide-react";
import {
  TextDatePicker,
  TextInput,
} from "@/components/layouts/FormInputs/TextInput";
import { TextArea } from "@/components/layouts/FormInputs/TextInput";
import { TextFileUploader } from "@/components/layouts/FormInputs/TextFileInput";
import { Forge, Forger, useForge } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";
import { useWatch } from "react-hook-form";
import { useUserRole } from "@/hooks/useUserRole";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  documents: yup.array().nullable(),
  submissionDeadline: yup.string().required("Submission deadline is required"),
  questionAcceptanceDeadline: yup
    .string()
    .required("Question acceptance deadline is required"),
});

type FormValues = yup.InferType<typeof schema>;

interface CreateAddendumDialogProps {
  solicitationId: string;
  onClose: () => void;
}

const CreateAddendumDialog: React.FC<CreateAddendumDialogProps> = ({
  solicitationId,
  onClose,
}) => {
  const formRef = useRef<any>(null);
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const { isVendor } = useUserRole();

  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      documents: null,
      submissionDeadline: "",
      questionAcceptanceDeadline: "",
    },
  });

  const submissionDeadlineDate = useWatch({
    name: "submissionDeadline",
    control,
  });
  const maxDate = submissionDeadlineDate
    ? new Date(submissionDeadlineDate)
    : undefined;

  // File upload mutation
  const uploadFilesMutation = useMutation<
    ApiResponse<any[]>,
    ApiResponseError,
    File[]
  >({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });
      
      return await postRequest({
        url: '/upload',
        payload: formData,
        config: {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      });
    },
  });

  // Create addendum mutation
  const createAddendumMutation = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    { data: FormValues; status: "draft" | "publish" }
  >({
    mutationFn: async ({ data, status }) => {
      let uploadedFiles: any[] = [];
      
      // Upload files first if any
      if (data.documents && data.documents.length > 0) {
        const uploadResponse = await uploadFilesMutation.mutateAsync(data.documents);
        uploadedFiles = uploadResponse.data?.data || [];
      }
      
      const payload = {
        title: data.title,
        description: data.description,
        submissionDeadline: new Date(data.submissionDeadline).toISOString(),
        questionDeadline: new Date(data.questionAcceptanceDeadline).toISOString(),
        status: status,
        files: uploadedFiles.map(file => ({
          name: file.name,
          url: file.url,
          size: file.size.toString(),
          type: file.type
        })),
      };
      
      // Use different API endpoint based on user role
      const endpoint = isVendor
        ? `/vendor/solicitations/${solicitationId}/addendums` // Vendor-specific endpoint
        : `/procurement/solicitations/${solicitationId}/addendums`; // Default procurement endpoint
      
      return await postRequest({
        url: endpoint,
        payload,
      });
    },
    onSuccess: (_, variables) => {
      const action =
        variables.status === "draft" ? "saved as draft" : "published";
      toast.success("Success", `Addendum ${action} successfully`);
      queryClient.invalidateQueries({
        queryKey: ["addendums", solicitationId],
      });
      onClose();
    },
    onError: (error) => {
      console.error("Create addendum error:", error);
      toast.error(
        "Error",
        error?.response?.data?.message ?? "Failed to create addendum"
      );
    },
  });

  const handleSaveAsDraft = async (data: FormValues) => {
    await createAddendumMutation.mutateAsync({ data, status: "draft" });
  };

  const handlePublishAddendum = async (data: FormValues) => {
    await createAddendumMutation.mutateAsync({ data, status: "publish" });
  };

  const handleBack = () => {
    onClose();
  };

  const FileUploadElement = () => (
    <>
      <Upload className="h-8 w-8 text-gray-400 mb-2" />
      <div className="text-sm text-gray-600">
        <span className="font-medium text-blue-600 cursor-pointer hover:text-blue-500">
          Drag & Drop or Click to choose file
        </span>
      </div>
      <p className="text-xs text-gray-500">
        Supported formats: DOC, PDF, XLS, XLSLS, ZIP, PNG, JPEG
      </p>
    </>
  );

  const FileListItem = ({ file }: { file: File }) => (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
      <span className="text-sm text-gray-700">{file.name}</span>
      <span className="text-xs text-gray-500">
        {(file.size / 1024).toFixed(1)} KB
      </span>
    </div>
  );

  const acceptedFileTypes = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "application/vnd.ms-excel": [".xls"],
    "application/zip": [".zip"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
  };

  return (
    <div className="w-full">
      {/* Header */}
      <DialogHeader className="flex flex-row items-center justify-between p-6">
        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Create Addendum
        </DialogTitle>
      </DialogHeader>

      <Forge control={control} onSubmit={handlePublishAddendum} ref={formRef}>
        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <Forger
            name="title"
            component={TextInput}
            label="Title"
            placeholder="Enter Title"
          />

          {/* Description */}
          <div className="relative">
            <Forger
              name="description"
              component={TextArea}
              label="Description"
              placeholder="Enter Detail"
              rows={4}
            />
            <div className="absolute bottom-3 right-3">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </div>

          {/* Upload Documents */}
          <Forger
            name="documents"
            component={TextFileUploader}
            label="Upload New/Revised Documents"
            containerClass="dark:border-gray-200"
            element={<FileUploadElement />}
            List={FileListItem}
            accept={acceptedFileTypes as any}
          />

          {/* Submission Deadline */}
          <Forger
            name="submissionDeadline"
            component={TextDatePicker}
            label="Submission Deadline Date & Time"
            placeholder="Select Date"
            minDate={new Date()}
            showTime
          />

          {/* Question Acceptance Deadline */}
          <Forger
            name="questionAcceptanceDeadline"
            component={TextDatePicker}
            label="Question Acceptance Deadline Date & Time"
            placeholder="Select Date & Time"
            minDate={new Date()}
            dependencies={[maxDate]}
            maxDate={maxDate}
            showTime
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6">
          <Button
              type="button"
              variant="outline"
              onClick={() => formRef.current?.onSubmit(handleSaveAsDraft)}
              className="text-gray-700 border-gray-300"
              disabled={createAddendumMutation.isPending || uploadFilesMutation.isPending}
            >
              {createAddendumMutation.isPending || uploadFilesMutation.isPending ? "Saving..." : "Save as Draft"}
            </Button>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="text-gray-700 border-gray-300"
              disabled={createAddendumMutation.isPending || uploadFilesMutation.isPending}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-[#2A4467] hover:bg-[#1e3252] text-white"
              disabled={createAddendumMutation.isPending || uploadFilesMutation.isPending}
            >
              {createAddendumMutation.isPending || uploadFilesMutation.isPending
                ? uploadFilesMutation.isPending ? "Uploading files..." : "Publishing..."
                : "Publish Addendum"}
            </Button>
          </div>
        </div>
      </Forge>
    </div>
  );
};

export default CreateAddendumDialog;
