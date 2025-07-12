import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, X, FileText } from "lucide-react";
import { TextFileUploader } from "@/components/layouts/FormInputs/TextFileInput";
import { Control } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";

interface UploadFileResponse {
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedAt: string;
}

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesUploaded?: (
    files: UploadFileResponse[],
    requiredDocumentId: string
  ) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  control?: Control<any>;
  requiredDocumentId?: string;
  type: string
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onOpenChange,
  onFilesUploaded,
  acceptedTypes = [".pdf", ".doc", ".docx", ".xls", ".xlsx"],
  requiredDocumentId,
  type
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileResponse[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const toast = useToastHandler();

  // Upload files mutation
  const { mutateAsync: uploadFiles, isPending: isUploading } = useMutation<
    ApiResponse<UploadFileResponse[]>,
    ApiResponseError,
    FormData
  >({
    mutationKey: ["uploadFiles"],
    mutationFn: async (formData) =>
      await postRequest({
        url: "/upload",
        payload: formData,
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      }),
  });

  const handleFileSelect = (files: File[] | null) => {
    if (!files || files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    // Create temporary preview objects
    const newFiles: UploadFileResponse[] = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      url: URL.createObjectURL(file), 
      uploadedAt: new Date().toISOString(),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No Files", "Please select files to upload");
      return;
    }

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("file", file);
      });

      const response = await uploadFiles(formData);

      if (response.data?.data) {
        const uploadedFileResponses = response.data.data;

        if (onFilesUploaded) {
          onFilesUploaded(uploadedFileResponses.map(item => ({
            ...item,
            type
          })), requiredDocumentId || "");
        }

        toast.success("Success", "Files uploaded successfully");
        onOpenChange(false);
        setUploadedFiles([]);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      const err = error as ApiResponseError;
      toast.error(
        "Upload Failed",
        err?.response?.data?.message ?? "Failed to upload files"
      );
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setUploadedFiles([]);
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Select files to upload. Supported formats:{" "}
            {acceptedTypes.join(", ")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <TextFileUploader
            value={selectedFiles}
            onChange={handleFileSelect}
            dropzoneOptions={{
              multiple: true
            }}
            accept={
              acceptedTypes
                ? acceptedTypes.reduce((acc, type) => {
                    acc[type] = [type];
                    return acc;
                  }, {} as Record<string, string[]>)
                : {}
            }
            label="Upload Files"
            className="w-full border border-dashed rounded-2xl"
            // containerClass="border border-dashed rounded-2xl"
            element={
              <div className="flex flex-col items-center space-y-4 ">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <UploadIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Drag & Drop or Click to choose file
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supported formats: {acceptedTypes.join(", ")}
                  </p>
                </div>
              </div>
            }
            List={({ file }) => {
              const fileIndex = uploadedFiles.findIndex(
                (f) =>
                  f.name === file.name && f.size === formatFileSize(file.size)
              );
              return (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(fileIndex)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className=""
            disabled={isUploading || selectedFiles.length === 0}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
