import { FileText } from "lucide-react";

// Simple File list item component for Communication Management uploads
export const FileListItem = ({ file }: { file: File }) => {
  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  const getFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${Math.round(mb)}MB` : `${Math.round(bytes / 1024)}KB`;
  };

  const getFileIcon = () => {
    return (
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900/20 rounded flex items-center justify-center">
        <FileText className="w-6 h-6 text-gray-600" />
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 border">
      <div className="flex items-center space-x-3 flex-1">
        {getFileIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
            {file.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {getFileExtension(file.name)} • {getFileSize(file.size)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};