import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// import { formatInTimeZone, format } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a currency string based on the provided locale and currency.
 * @param {number} amount - The amount of money to format.
 * @param {string} locale - The locale string (e.g., 'en-US', 'fr-FR').
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR').
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(
  amount: number,
  locale: Intl.LocaleOptions["region"],
  currency: Intl.NumberFormatOptions["currency"]
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return amount.toString();
  }
}

const getFileNameFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1] || "";
};

export const downloadFile = async (fileUrl: string) => {
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const fileName = getFileNameFromUrl(fileUrl);
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(link);
};

export const createFormData = (body: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(body).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

/**
 * Safely format dates with optional IANA timezone support.
 * Falls back to local formatting when timezone is not provided.
 */
export function formatDateTZ(
  dateInput: string | Date | undefined | null,
  formatStr?: string,
  timezone?: string
): string {
  // Guard: undefined/null -> safe string
  if (!dateInput) return "N/A";
  console.log({ formatStr, timezone })
  try {
    // Normalize input to Date
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    // Guard: invalid Date -> safe string
    if (!(date instanceof Date) || isNaN(date.getTime())) return "N/A";

    // Use formatInTimeZone exclusively.
    // If timezone is missing or empty, default to the runtime's IANA guess by using Intl.DateTimeFormat.
    // const tz =
    //   timezone && timezone.trim().length > 0
    // ? timezone
    // : Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const formattedTime =
      date.toISOString()?.split("T")?.[1]?.split(".")?.[0] || "N/A";

    return (
      date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " " +
      formattedTime
    );
  } catch {
    // Guard: any unexpected errors -> safe string
    return "N/A";
  }
}

// Internal helper: compute the timezone offset (in minutes) for a given UTC date and IANA timezone.
function getTimeZoneOffset(dateUTC: Date, timeZone: string): number {
  // Ensure we use a UTC-based date for stable calculations
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = dtf.formatToParts(dateUTC);
  const map: Record<string, number> = {} as any;
  for (const { type, value } of parts) {
    if (type !== "literal") map[type] = Number(value);
  }

  const asUTC = Date.UTC(
    map.year,
    (map.month || 1) - 1,
    map.day || 1,
    map.hour || 0,
    map.minute || 0,
    map.second || 0
  );

  // Difference between the timezone-reconstructed UTC timestamp and the original UTC timestamp
  // yields the offset in milliseconds (positive for zones ahead of UTC).
  const diffMs = asUTC - dateUTC.getTime();
  return diffMs / 60000; // minutes
}

/**
 * Convert a "wall time" (date/time without offset) in a specific IANA timezone into a UTC Date.
 * This mimics date-fns-tz's zonedTimeToUtc, avoiding direct dependency on that export.
 *
 * Example:
 *   zonedTimeToUtc(new Date("2025-01-01T12:00"), "America/Los_Angeles").toISOString()
 */
export function zonedTimeToUtc(
  dateInput: string | Date,
  timeZone: string
): Date {
  const local = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (!(local instanceof Date) || isNaN(local.getTime())) {
    return new Date(NaN);
  }

  try {
    // Build a UTC timestamp from the local date's wall time components
    const utcTsFromLocalWall = Date.UTC(
      local.getFullYear(),
      local.getMonth(),
      local.getDate(),
      local.getHours(),
      local.getMinutes(),
      local.getSeconds(),
      local.getMilliseconds()
    );

    // Determine the timezone offset (in minutes) at that instant for the target IANA timezone
    const offsetMin = getTimeZoneOffset(new Date(utcTsFromLocalWall), timeZone);

    // Adjust the UTC timestamp by subtracting the offset to get the true UTC instant
    const adjustedUtcTs = utcTsFromLocalWall - offsetMin * 60000;
    return new Date(adjustedUtcTs);
  } catch {
    return new Date(NaN);
  }
}
