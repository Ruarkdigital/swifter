import { Forger, useForgeValues } from "@/lib/forge";
 import { TextFileUploader } from "@/components/layouts/FormInputs/TextFileInput";
import { useWatch } from "react-hook-form";
import { X } from "lucide-react";

export const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-primary">
          Drag & Drop or Click to choose file
        </span>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Supported formats: DOC, PDF, XLS, XLSLS, ZIP, PNG, JPEG
      </p>
    </>
  );
};

const FileListItem = ({ file, control }: { file: File; control: any }) => {
  const { setValue } = useForgeValues({ control });
  const value = useWatch({ name: "documents" });

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  const getFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${Math.round(mb)}MB` : `${Math.round(bytes / 1024)}KB`;
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();

    // PDF files
    if (["pdf"].includes(extension || "")) {
      return (
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center">
          <svg
            className="w-6 h-6 text-red-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M9.5,11.5C9.5,10.67 10.17,10 11,10H12.5V11.5H11V13H12.5V14.5H11A1.5,1.5 0 0,1 9.5,13V11.5M14.5,10H16A1.5,1.5 0 0,1 17.5,11.5V13A1.5,1.5 0 0,1 16,14.5H14.5V10M16,11.5H16V13H16V11.5Z" />
          </svg>
        </div>
      );
    }

    // Word documents
    if (["doc", "docx"].includes(extension || "")) {
      return (
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M7,13L8.5,18H10L11.5,13L13,18H14.5L16,13H14.5L13.5,16.5L12,13H11L9.5,16.5L8.5,13H7Z" />
          </svg>
        </div>
      );
    }

    // PowerPoint presentations
    if (["ppt", "pptx"].includes(extension || "")) {
      return (
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded flex items-center justify-center">
          <svg
            className="w-6 h-6 text-orange-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M9.5,11.5C9.5,10.67 10.17,10 11,10H12.5A1.5,1.5 0 0,1 14,11.5V13A1.5,1.5 0 0,1 12.5,14.5H11V16H9.5V11.5M11,11.5V13H12.5V11.5H11Z" />
          </svg>
        </div>
      );
    }

    // Excel files
    if (["xls", "xlsx", "xlsls"].includes(extension || "")) {
      return (
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">
          <svg
            className="w-6 h-6 text-green-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,11L10,14L8,17H9.5L11,15L12.5,17H14L12,14L14,11H12.5L11,13L9.5,11H8Z" />
          </svg>
        </div>
      );
    }

    // Text files
    if (["txt", "rtf"].includes(extension || "")) {
      return (
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900/20 rounded flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M7,11H17V13H7V11M7,15H17V17H7V15Z" />
          </svg>
        </div>
      );
    }

    // Image files
    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(
        extension || ""
      )
    ) {
      return (
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded flex items-center justify-center">
          <svg
            className="w-6 h-6 text-purple-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8.5,13.5L11,16.5L14.5,12L18,17H6L8.5,13.5Z" />
          </svg>
        </div>
      );
    }

    // Archive files
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
      return (
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded flex items-center justify-center">
          <svg
            className="w-6 h-6 text-indigo-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14,17H12V15H14M14,13H12V11H14M12,9H14V7H12M12,19H14V17H12M14,7V5H12V7M14,3V5H16V3M10,5H12V3H10M16,7H18V5H16M6,19A2,2 0 0,1 4,17V7A2,2 0 0,1 6,5H8V3A2,2 0 0,1 10,1H16A2,2 0 0,1 18,3V5H20A2,2 0 0,1 22,7V17A2,2 0 0,1 20,19H18V21A2,2 0 0,1 16,23H10A2,2 0 0,1 8,21V19H6M8,19H16V21H10V19H8M20,17V7H18V17H20Z" />
          </svg>
        </div>
      );
    }

    // Default file icon
    return (
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900/20 rounded flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      </div>
    );
  };

  const handleRemove = () => {
    if (value && Array.isArray(value)) {
      const newFiles = value.filter((f: File) => f.name !== file.name);
      setValue("documents", newFiles.length > 0 ? newFiles : null);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 border-2 border-dashed border-gray-400">
      <div className="flex items-center space-x-3">
        {getFileIcon(file.name)}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getFileExtension(file.name)} • {getFileSize(file.size)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-500 transition-colors p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

function Step4Form() {
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
    <Forger
      name="documents"
      label="Upload Files"
      containerClass="p-4 px-6"
      className="border dark:border-gray-200 mt-4"
      component={TextFileUploader}
      element={<FileSvgDraw />}
      List={FileListItem}
      dropzoneOptions={{
        multiple: true,
        // maxFiles: 4,
      }}
      accept={acceptedFileTypes as any}
    />
  );
}

export default Step4Form;
