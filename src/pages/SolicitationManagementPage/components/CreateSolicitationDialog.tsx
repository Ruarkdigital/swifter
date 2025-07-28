import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Forge, useForge } from "@/lib/forge";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postRequest, getRequest } from "@/lib/axiosInstance";
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
    .when("bidIntent", {
      is: "required",
      then: (schema) => schema.required("Bid intent deadline date is required when bid intent is required"),
      otherwise: (schema) => schema.optional(),
    }),
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

const documentSchema = yup.mixed().test({
  name: "isFile",
  message: "Document is required",
  test: (value) => {
    return value instanceof File;
  },
}); // Allow additional properties without validation

const vendorSchema = yup.object({
  value: yup.string().required("Vendor ID is required"),
});

const step4Schema = yup.object({
  documents: yup.array().of(documentSchema).optional().nullable(),
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

export type CreateSolicitationFormData = Step1FormData &
  Step2FormData &
  Step3FormData &
  Step4FormData &
  Step5FormData & {
    files?: File[];
    vendors?: Array<{ id: string; status?: string }>;
  };

// Types for API request
type SolicitationCreateRequest = {
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

const CreateSolicitationDialog = () => {
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

  // Single form instance for all steps
  const forge = useForge<CreateSolicitationFormData>({
    defaultValues: {
      // Step 3 fields
      event: [{ event: "", location: "", date: "", time: "", note: "" }],
    },
    // Add mode for validation
    mode: "onChange",
  });

  // File upload mutation
  const { mutateAsync: uploadFiles } = useMutation<
    ApiResponse<
      {
        name: string;
        url: string;
        size: string;
        type: string;
      }[]
    >,
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

  const { mutateAsync: createSolicitation, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    SolicitationCreateRequest
  >({
    mutationKey: ["createSolicitation"],
    mutationFn: async (data) =>
      await postRequest({ url: "/procurement/solicitations", payload: data }),
  });

  const onSubmit = async (data: any, event?: React.FormEvent) => {
    // Prevent default form submission behavior which causes page reload
    if (event) {
      event.preventDefault();
    }
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

      if (completeData.documents && completeData.documents.length > 0) {
        const fileFormData = new FormData();
        completeData.documents.forEach((file: File) => {
          fileFormData.append("file", file);
        });

        const uploadResponse = await uploadFiles(fileFormData);
        if (uploadResponse?.data?.data) {
          uploadedFiles = uploadResponse.data.data;
        }
      }

      // Transform form data to match API schema
      const apiPayload: SolicitationCreateRequest = {
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
        status: "active",
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

      const response = await createSolicitation(apiPayload);

      if (response?.data) {
        // Invalidate queries to refresh the solicitation list
        queryClient.invalidateQueries({ queryKey: ["solicitations"] });
        queryClient.invalidateQueries({ queryKey: ["my-solicitations"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

        toast.success(
          "Solicitation Created",
          "Your solicitation has been created successfully."
        );
        setOpen(false);
        setCurrentStep(1);
        forge.reset();
      }
    } catch (error) {
      console.log(error);
      const err = error as ApiResponseError;
      toast.error(
        "Creation Failed",
        err?.message ?? "Failed to create solicitation. Please try again."
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = async () => {
    try {
      const formData = forge.getValues();

      // Check if we have at least the minimum required fields for draft
      if (
        !formData.solicitationName ||
        !formData.solicitationType ||
        !formData.category ||
        !formData.description
      ) {
        // If minimum fields are not filled, just close the dialog
        setOpen(false);
        setCurrentStep(1);
        forge.reset();
        return;
      }

      // Handle file uploads first if there are files
      let uploadedFiles: Array<{
        name: string;
        url: string;
        size: string;
        type: string;
      }> = [];

      if (formData.documents && formData.documents.length > 0) {
        const fileFormData = new FormData();
        formData.documents.forEach((file: any) => {
          if (file instanceof File) {
            fileFormData.append("file", file);
          }
        });

        const uploadResponse = await uploadFiles(fileFormData);
        if (uploadResponse?.data?.data) {
          uploadedFiles = uploadResponse.data.data;
        }
      }

      // Transform form data to match API schema for draft
      const apiPayload: SolicitationCreateRequest = {
        name: formData.solicitationName,
        typeId: formData.solicitationType,
        categoryIds: Array.isArray(formData.category)
          ? formData.category
          : [formData.category],
        estimatedCost: formData.estimatedCost
          ? parseFloat(formData.estimatedCost)
          : undefined,
        description: formData.description,
        visibility:
          (formData.visibility as "public" | "invite-only") || "invite-only",
        status: "draft", // Save as draft
        submissionDeadline: formData.submissionDeadlineDate
          ? new Date(formData.submissionDeadlineDate).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default to 30 days from now
        questionDeadline: formData.questionAcceptanceDeadlineDate
          ? new Date(formData.questionAcceptanceDeadlineDate).toISOString()
          : undefined,
        bidIntentDeadline: formData.bidIntentDeadlineDate
          ? new Date(formData.bidIntentDeadlineDate).toISOString()
          : undefined,
        timezone: formData.timezone || "Africa/Lagos",
        events: formData.event?.map((evt: any) => {
          // Validate date and time before creating Date object
          if (!evt.date || !evt.time) {
            return {
              eventType: "",
              eventLocation: "",
              eventDate: "",
              eventDescription: undefined,
            };
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
            return {
              eventType: "",
              eventLocation: "",
              eventDate: "",
              eventDescription: undefined,
            };
          }

          return {
            eventType: evt.event,
            eventLocation: evt.location,
            eventDate: eventDate.toISOString(),
            eventDescription: evt.note || undefined,
          };
        }),
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        vendors:
          formData.vendor?.map((item: any) => ({ id: item.value })) ||
          undefined,
      };

      const response = await createSolicitation(apiPayload);

      if (response?.data) {
        // Invalidate queries to refresh the solicitation list
        queryClient.invalidateQueries({ queryKey: ["solicitations"] });
        queryClient.invalidateQueries({ queryKey: ["my-solicitations"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

        toast.success(
          "Draft Saved",
          "Your solicitation has been saved as a draft. You can continue editing it later."
        );
        setOpen(false);
        setCurrentStep(1);
        forge.reset();
      }
    } catch (error) {
      console.log(error);
      const err = error as ApiResponseError;
      toast.error(
        "Save Failed",
        err?.message ?? "Failed to save draft. Please try again."
      );
    }
  };

  // Validate current step before proceeding to the next step
  const validateAndProceed = async () => {
    try {
      // Get current form values
      const formValues = forge.getValues();

      // Validate based on current step
      switch (currentStep) {
        case 1:
          await step1Schema.validate(formValues, { abortEarly: false });
          break;
        case 2:
          await step2Schema.validate(formValues, { abortEarly: false });
          break;
        case 3:
          await step3Schema.validate(formValues, { abortEarly: false });
          break;
        case 4:
          // // Skip validation for step 4 if no documents are uploaded
          if (formValues.documents && formValues.documents.length > 0) {
            await step4Schema.validate(formValues, { abortEarly: false });
          }
          break;
        case 5:
          await step5Schema.validate(formValues, { abortEarly: false });
          break;
        default:
          break;
      }

      // If we reach here, validation passed, proceed to next step
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      // Handle validation errors
      if (error instanceof yup.ValidationError) {
        // Set errors in the form
        const fieldErrors: Record<string, string> = {};

        error.inner.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path] = err.message;
          }
        });

        // Set errors in the form
        Object.keys(fieldErrors).forEach((field) => {
          forge.setError(field as any, {
            type: "manual",
            message: fieldErrors[field],
          });
        });

        // Show toast with first error
        if (error.inner.length > 0) {
          toast.error(
            "Validation Error",
            error.inner[0].message || "Please check the form for errors."
          );
        }
      } else {
        // Handle unexpected errors
        console.error("Validation error:", error);
        toast.error("Error", "An unexpected error occurred. Please try again.");
      }
    }
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
        <Button className="bg-[#2A4467] hover:bg-[#1e3147] text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Solicitation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Custom Header with Close Button */}
        <div className="flex items-center justify-between p-6">
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Create Solicitation
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
              <Step3Form eventOptions={eventOptions} control={forge.control} />
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
                formData={forge.getValues()}
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
                onClick={currentStep === 6 ? undefined : validateAndProceed}
                disabled={isPending}
                className="px-8 py-2 bg-[#2A4467] hover:bg-[#1e3147] text-white rounded-lg"
              >
                {currentStep === 6
                  ? isPending
                    ? "Publishing..."
                    : "Publish"
                  : "Continue"}
              </Button>
            </div>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSolicitationDialog;
