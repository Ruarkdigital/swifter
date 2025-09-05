import { DocSVG } from "@/assets/icons/Doc";
import { PdfSVG } from "@/assets/icons/Pdf";
import PowerPointSVG from "@/assets/icons/PowerPoint";
import { ExcelSVG } from "@/assets/icons/Excel";

/**
 * Helper function to get file extension from name or type
 * @param fileName - The file name
 * @param fileType - The file MIME type or type string
 * @returns The file extension in uppercase
 */
export const getFileExtension = (
  fileName: string,
  fileType: string
): string => {
  const extension = fileName.split(".").pop()?.toUpperCase();
  if (extension) return extension;

  // Fallback to type if no extension in name
  const lowerType = fileType.toLowerCase();

  // PDF files
  if (
    lowerType.includes("pdf") ||
    lowerType.includes("portable document format")
  ) {
    return "PDF";
  }

  // Word/DOC files
  if (
    lowerType.includes("doc") ||
    lowerType.includes("word") ||
    lowerType.includes("msword") ||
    lowerType.includes("wordprocessingml") ||
    lowerType.includes("opendocument.text") ||
    lowerType.includes("rtf")
  ) {
    return "DOC";
  }

  // Excel/Spreadsheet files
  if (
    lowerType.includes("excel") ||
    lowerType.includes("sheet") ||
    lowerType.includes("spreadsheet") ||
    lowerType.includes("ms-excel") ||
    lowerType.includes("spreadsheetml") ||
    lowerType.includes("opendocument.spreadsheet") ||
    lowerType.includes("csv") ||
    lowerType.includes("comma-separated")
  ) {
    return "XLS";
  }

  // PowerPoint/Presentation files
  if (
    lowerType.includes("powerpoint") ||
    lowerType.includes("presentation") ||
    lowerType.includes("ms-powerpoint") ||
    lowerType.includes("presentationml") ||
    lowerType.includes("opendocument.presentation") ||
    lowerType.includes("slideshow")
  ) {
    return "PPT";
  }

  return "FILE";
};

/**
 * Simple helper function to get file extension from filename only
 * @param filename - The file name
 * @returns The file extension in lowercase
 */
export const getSimpleFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

/**
 * Helper function to get the appropriate file icon based on file extension
 * @param fileExtension - The file extension (case insensitive)
 * @returns JSX element for the file icon
 */
export const getFileIcon = (fileExtension: string) => {
  const ext = fileExtension.toUpperCase();

  const excelExtension = [
    "XLS",
    "XLSX",
    "XLSM",
    "XLSB",
    "XLT",
    "XLTX",
    "XLTM",
    "CSV",
    "ODS",
  ];

  const powerPointExtension = [
    "PPT",
    "PPTX",
    "PPTM",
    "PPS",
    "PPSX",
    "PPSM",
    "POT",
    "POTX",
    "POTM",
    "ODP",
  ];

  const wordExtension = ["DOC", "DOCX", "RTF", "ODT"];

  if (excelExtension.includes(ext)) {
    return <ExcelSVG />;
  }

  if (powerPointExtension.includes(ext)) {
    return <PowerPointSVG />;
  }

  if (wordExtension.includes(ext)) {
    return <DocSVG />;
  }

  return <PdfSVG />
};

/**
 * Helper function to format file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Check if a file extension represents a document file
 * @param extension - File extension
 * @returns True if it's a document file
 */
export const isDocumentFile = (extension: string): boolean => {
  const docExtensions = ["DOC", "DOCX", "RTF", "ODT"];
  return docExtensions.includes(extension.toUpperCase());
};

/**
 * Check if a file extension represents a PDF file
 * @param extension - File extension
 * @returns True if it's a PDF file
 */
export const isPdfFile = (extension: string): boolean => {
  return extension.toUpperCase() === "PDF";
};

/**
 * Check if a file extension represents a spreadsheet file
 * @param extension - File extension
 * @returns True if it's a spreadsheet file
 */
export const isSpreadsheetFile = (extension: string): boolean => {
  const spreadsheetExtensions = [
    "XLS",
    "XLSX",
    "XLSM",
    "XLSB",
    "XLT",
    "XLTX",
    "XLTM",
    "CSV",
    "ODS",
  ];
  return spreadsheetExtensions.includes(extension.toUpperCase());
};

/**
 * Check if a file extension represents a presentation file
 * @param extension - File extension
 * @returns True if it's a presentation file
 */
export const isPresentationFile = (extension: string): boolean => {
  const presentationExtensions = [
    "PPT",
    "PPTX",
    "PPTM",
    "PPS",
    "PPSX",
    "PPSM",
    "POT",
    "POTX",
    "POTM",
    "ODP",
  ];
  return presentationExtensions.includes(extension.toUpperCase());
};
