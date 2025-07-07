import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Forge, useForge } from "@/lib/forge";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postRequest, getRequest, putRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import Step3Form from "./Step3Form";
import Step4Form from "./Step4Form";
import Step5Form from "./Step5Form";
import Step6Form from "./Step6Form";
import { cn } from "@/lib/utils";

// Form validation schemas for each step
const step1Schema = yup.object({
  solicitationName: yup.string().required("Solicitation name is required"),
  solicitationType: yup.string().required("Solicitation type is required"),
  estimatedCost: yup.string().optional(),
  category: yup.string().required("Category is required"),
  procurementLead: yup.string().required("Procurement lead is required"),
  jobTitle: yup.string().required("Job title is required"),
  emailAddress: yup
    .string()
    .email("Valid email is required")
    .required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  projectOwner: yup.string().optional(),
  description: yup.string().required("Description is required"),
});

const step2Schema = yup.object({
  submissionDeadlineDate: yup
    .string()
    .required("Submission deadline date is required"),
  questionAcceptanceDeadlineDate: yup
    .string()
    .required("Question acceptance deadline date is required"),
  timezone: yup.string().required("Timezone is required"),
  bidIntent: yup.string().required("Bid intent is required"),
  bidIntentDeadlineDate: yup
    .string()
    .required("Bid intent deadline date is required"),
  visibility: yup.string().required("Visibility is required"),
});

const eventSchema = yup.object({
  event: yup.string().required("Event is required"),
  location: yup.string().required("Location is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
  note: yup.string().optional(),
});

const step3Schema = yup.object({
  event: yup.array().of(eventSchema).min(1, "At least one event is required"),
});

const documentSchema = yup.object({
  path: yup.string().required("Document path is required"),
  relativePath: yup.string().required("Relative path is required"),
});

const vendorSchema = yup.object({
  value: yup.string().required("Vendor ID is required"),
});

const step4Schema = yup.object({
  documents: yup.array().of(documentSchema).optional(),
});

const step5Schema = yup.object({
  vendor: yup.array().of(vendorSchema).optional(),
  message: yup.string().optional(),
});

type Step1FormData = yup.InferType<typeof step1Schema>;
type Step2FormData = yup.InferType<typeof step2Schema>;
type Step3FormData = yup.InferType<typeof step3Schema>;
type Step4FormData = yup.InferType<typeof step4Schema>;
type Step5FormData = yup.InferType<typeof step5Schema>;

export type EditSolicitationFormData = Step1FormData &
  Step2FormData &
  Step3FormData &
  Step4FormData &
  Step5FormData & {
    files?: File[];
    vendors?: Array<{ id: string; status?: string }>;
  };

// Types for API request
type SolicitationUpdateRequest = {
  name: string;
  typeId: string;
  categoryIds: string[];
  estimatedCost?: number;
  description: string;
  visibility?: "public" | "invite-only";
  status?: "draft" | "active" | "closed" | "awarded" | "evaluating";
  submissionDeadline: string;
  questionDeadline?: string;
  bidIntentDeadline?: string;
  timezone?: string;
  events?: Array<{
    eventType: string;
    eventLocation: string;
    eventDate: string;
    eventDescription?: string;
  }>;
  files?: Array<{
    name: string;
    url: string;
    size: string;
    type: string;
  }>;
  vendors?: Array<{
    id: string;
    status?: "invited" | "confirmed" | "declined";
  }>;
};

// Solicitation type for props
type Solicitation = {
  _id: string;
  name: string;
  typeId: { _id: string; name: string } | string;
  type?: { _id: string; name: string };
  categoryIds: Array<{ _id: string; name: string }>;
  categories?: Array<{ _id: string; name: string }>;
  submissionDeadline: string;
  estimatedCost?: number;
  description: string;
  visibility: "public" | "private" | "invite-only";
  status: "draft" | "active" | "closed" | "awarded" | "evaluating";
  questionDeadline?: string;
  bidIntentDeadline?: string;
  timezone: string;
  events?: Array<{
    _id: string;
    eventType: string;
    eventLocation: string;
    eventDate: string;
    eventDescription?: string;
  }>;
  files?: Array<{
    _id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  vendors?: Array<{
    _id: string;
    email: string;
    name?: string;
    status: "invited" | "confirmed" | "declined";
  }>;
};

interface EditSolicitationDialogProps {
  solicitation: Solicitation;
  isLink?: boolean;
}

const EditSolicitationDialog = ({
  solicitation,
  isLink,
}: EditSolicitationDialogProps) => {
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Types for category API
  type VendorCategory = {
    _id?: string;
    name: string;
  };

  type SolicitationType = {
    _id: string;
    name: string;
  };

  // Fetch vendor categories
  const { data: categoriesData } = useQuery<
    ApiResponse<VendorCategory[]>,
    ApiResponseError
  >({
    queryKey: ["solicitationCategories"],
    queryFn: async () =>
      await getRequest({ url: "/procurement/solicitations/meta/categories" }),
  });

  // Fetch solicitation types
  const { data: typesData } = useQuery<
    ApiResponse<SolicitationType[]>,
    ApiResponseError
  >({
    queryKey: ["solicitationTypes"],
    queryFn: async () =>
      await getRequest({ url: "/procurement/solicitations/meta/types" }),
  });

  const solicitationTypes =
    typesData?.data.data?.map((type) => ({
      label: type.name,
      value: type._id,
    })) || [];

  const categoryOptions =
    categoriesData?.data.data?.map((category) => ({
      label: category.name,
      value: category._id || category.name,
    })) || [];

  const bidIntentOptions = [
    { label: "Required", value: "required" },
    { label: "Not Required", value: "not-required" },
  ];

  const visibilityOptions = [
    { label: "Public", value: "public" },
    { label: "Invite-only", value: "invite-only" },
  ];

  const eventOptions = [
    { label: "Pre-bid Meeting", value: "pre-bid-meeting" },
    { label: "Technical Presentation", value: "technical-presentation" },
    { label: "Q&A Session", value: "qa-session" },
  ];

  // Helper function to format date for input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Helper function to format time for input
  const formatTimeForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toTimeString().split(" ")[0].substring(0, 5);
  };

  // Prepare default values from solicitation data
  const getDefaultValues = (): EditSolicitationFormData => {
    const typeId =
      typeof solicitation.typeId === "object"
        ? solicitation.typeId._id
        : solicitation.typeId;
    const categories =
      solicitation.categories || solicitation.categoryIds || [];
    const categoryId = categories.length > 0 ? categories[0]._id : "";

    return {
      solicitationName: solicitation.name || "",
      solicitationType: typeId || "",
      estimatedCost: solicitation.estimatedCost?.toString() || "",
      category: categoryId,
      procurementLead: "", // This might need to be fetched from user data
      jobTitle: "", // This might need to be fetched from user data
      emailAddress: "", // This might need to be fetched from user data
      phoneNumber: "", // This might need to be fetched from user data
      projectOwner: "",
      description: solicitation.description || "",
      submissionDeadlineDate: formatDateForInput(
        solicitation.submissionDeadline
      ),
      questionAcceptanceDeadlineDate: formatDateForInput(
        solicitation.questionDeadline || ""
      ),
      timezone: solicitation.timezone || "Africa/Lagos",
      bidIntent: "required", // Default value, might need to be determined from data
      bidIntentDeadlineDate: formatDateForInput(
        solicitation.bidIntentDeadline || ""
      ),
      visibility:
        solicitation.visibility === "private"
          ? "invite-only"
          : solicitation.visibility || "public",
      event: solicitation.events?.map((evt) => ({
        event: evt.eventType || "",
        location: evt.eventLocation || "",
        date: formatDateForInput(evt.eventDate),
        time: formatTimeForInput(evt.eventDate),
        note: evt.eventDescription || "",
      })) || [{ event: "", location: "", date: "", time: "", note: "" }],
      documents: [],
      vendor:
        solicitation.vendors?.map((vendor) => ({
          value: vendor._id,
        })) || [],
      message: "",
    };
  };

  // Single form instance for all steps
  const forge = useForge<EditSolicitationFormData>({
    defaultValues: getDefaultValues(),
  });

  // Reset form when solicitation changes
  useEffect(() => {
    forge.reset(getDefaultValues());
  }, [solicitation]);

  // File upload mutation
  const { mutateAsync: uploadFiles } = useMutation<
    ApiResponse<string[]>,
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

  const { mutateAsync: updateSolicitation, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    SolicitationUpdateRequest
  >({
    mutationKey: ["updateSolicitation"],
    mutationFn: async (data) =>
      await putRequest({
        url: `/procurement/solicitations/${solicitation._id}`,
        payload: data,
      }),
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = forge.getValues();
      const completeData = {
        ...formData,
        ...data,
      };

      // Handle file uploads first if there are files
      let uploadedFiles: Array<{
        name: string;
        url: string;
        size: string;
        type: string;
      }> = [];

      if (completeData.files && completeData.files.length > 0) {
        const fileFormData = new FormData();
        completeData.files.forEach((file: File) => {
          fileFormData.append("file", file);
        });

        const uploadResponse = await uploadFiles(fileFormData);
        if (uploadResponse?.data?.data) {
          uploadedFiles = completeData.files.map(
            (file: File, index: number) => ({
              name: file.name,
              url: uploadResponse.data.data[index],
              size: file.size.toString(),
              type: file.type,
            })
          );
        }
      }

      // Transform form data to match API schema
      const apiPayload: SolicitationUpdateRequest = {
        name: completeData.solicitationName,
        typeId: completeData.solicitationType,
        categoryIds: Array.isArray(completeData.category)
          ? completeData.category
          : [completeData.category],
        estimatedCost: completeData.estimatedCost
          ? parseFloat(completeData.estimatedCost)
          : undefined,
        description: completeData.description,
        visibility: completeData.visibility as "public" | "invite-only",
        status: solicitation.status, // Keep existing status
        submissionDeadline: new Date(
          completeData.submissionDeadlineDate
        ).toISOString(),
        questionDeadline: completeData.questionAcceptanceDeadlineDate
          ? new Date(completeData.questionAcceptanceDeadlineDate).toISOString()
          : undefined,
        bidIntentDeadline: completeData.bidIntentDeadlineDate
          ? new Date(completeData.bidIntentDeadlineDate).toISOString()
          : undefined,
        timezone: completeData.timezone || "Africa/Lagos",
        events: completeData.event
          ?.map((evt: any) => {
            // Validate date and time before creating Date object
            if (!evt.date || !evt.time) {
              console.warn("Invalid event date or time:", {
                date: evt.date,
                time: evt.time,
              });
              return null;
            }

            // Handle Date object from TextDatePicker
            const dateStr =
              evt.date instanceof Date
                ? evt.date.toISOString().split("T")[0] // Extract YYYY-MM-DD
                : evt.date;

            // Validate the constructed date string
            const dateTimeStr = `${dateStr}T${evt.time}`;
            const eventDate = new Date(dateTimeStr);

            if (isNaN(eventDate.getTime())) {
              console.warn("Invalid date constructed:", dateTimeStr);
              return null;
            }

            return {
              eventType: evt.event,
              eventLocation: evt.location,
              eventDate: eventDate.toISOString(),
              eventDescription: evt.note || undefined,
            };
          })
          .filter(Boolean), // Remove null entries
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        vendors:
          completeData.vendor?.map((item: any) => ({ id: item.value })) ||
          undefined,
      };

      const response = await updateSolicitation(apiPayload);

      if (response?.data) {
        // Invalidate queries to refresh the solicitation data
        queryClient.invalidateQueries({ queryKey: ["solicitations"] });
        queryClient.invalidateQueries({ queryKey: ["my-solicitations"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        queryClient.invalidateQueries({
          queryKey: ["solicitation", solicitation._id],
        });

        toast.success(
          "Solicitation Updated",
          "Your solicitation has been updated successfully."
        );
        setOpen(false);
        setCurrentStep(1);
        forge.reset(getDefaultValues());
      }
    } catch (error) {
      console.log(error);
      const err = error as ApiResponseError;
      toast.error(
        "Update Failed",
        err?.message ?? "Failed to update solicitation. Please try again."
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setCurrentStep(1);
    forge.reset(getDefaultValues());
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Step 1 of 6: Basic Information";
      case 2:
        return "Step 2 of 6: Timeline & Bid Details";
      case 3:
        return "Step 3 of 6: Create Event";
      case 4:
        return "Step 4 of 6: Documents";
      case 5:
        return "Step 5 of 6: Invite Vendors";
      case 6:
        return "Step 6 of 6: Review & Publish";
      default:
        return "Step 1 of 6: Basic Information";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          // variant={isLink ? "link" : "default"}
          className={cn("flex items-center gap-2 bg-gray-300 text-gray-800 hover:bg-gray-400", {
            "!bg-transparent !text-gray-600": isLink,
          })}
        >
         {!isLink && <Edit className="h-4 w-4" />}
          Edit Solicitation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Custom Header with Close Button */}
        <div className="flex items-center justify-between p-6">
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Edit Solicitation
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">{getStepTitle()}</p>
          </div>
        </div>

        {/* Form Content */}
        <Forge control={forge.control} onSubmit={onSubmit}>
          {currentStep === 1 && (
            <Step1Form
              solicitationTypes={solicitationTypes}
              categoryOptions={[...categoryOptions]}
            />
          )}

          {currentStep === 2 && (
            <Step2Form
              bidIntentOptions={bidIntentOptions}
              visibilityOptions={visibilityOptions}
            />
          )}

          {currentStep === 3 && (
            <>
              <Step3Form eventOptions={eventOptions} control={forge.control as any} />
            </>
          )}

          {currentStep === 4 && (
            <>
              <Step4Form />
            </>
          )}

          {currentStep === 5 && (
            <>
              <Step5Form />
            </>
          )}

          {currentStep === 6 && (
            <>
              <Step6Form
                setStep={(val) => setCurrentStep(val)}
                formData={forge.getValues() as any}
              />
            </>
          )}

          {/* Footer Buttons */}
          <div
            className={cn("flex items-center justify-end pt-6  px-6 py-6", {
              "justify-between": currentStep > 1,
            })}
          >
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-8 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Save as Draft
              </Button>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="px-8 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Back
              </Button>
              <Button
                type={currentStep === 6 ? "submit" : "button"}
                onClick={
                  currentStep === 6
                    ? undefined
                    : () => setCurrentStep((prev) => prev + 1)
                }
                disabled={isPending}
                className="px-8 py-2 bg-[#2A4467] hover:bg-[#1e3147] text-white rounded-lg"
              >
                {currentStep === 6
                  ? isPending
                    ? "Updating..."
                    : "Update Solicitation"
                  : "Continue"}
              </Button>
            </div>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
};

export default EditSolicitationDialog;
